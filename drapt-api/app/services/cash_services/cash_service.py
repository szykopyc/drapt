from contextlib import closing
from decimal import Decimal
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import and_, or_, func, exists
from app.enums import position
from app.models.cash_ledger import CashFlow
from app.enums.position import PositionDirection
from app.models.position import Position
from app.models.trade import Trade
from app.enums.trade import TradeTypeEnum
from app.enums.cash_ledger import CashFlowType
from app.redis_client import cache_set_indefinite, cache_get
from app.services.data_services.market_data import get_last_fx

class CashService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def _add_cash_flow(self, cashflow: CashFlow):
        self.session.add(cashflow)
        await self.session.flush()
        await self.session.refresh(cashflow)

        return cashflow

    async def _record_initial_portfolio_cash(self, Portfolio):
        # Ensure the portfolio is properly loaded
        await self.session.refresh(Portfolio)
        
        initial_deposit = CashFlow(
            portfolio_id=Portfolio.id,
            amount=Portfolio.initial_cash,
            flow_type=CashFlowType.DEPOSIT,
            currency=Portfolio.currency,
            converted_amount = Portfolio.initial_cash,
            fx_at_time_of_conversion = Decimal("1.00")
        )
        # sets the portfolio currency in cache. this is so that you dont need to query the portfolios table to get portfolio currency
        cache_set_indefinite(f"portfolio_native_currency:{Portfolio.id}", {"currency":Portfolio.currency})

        await self._add_cash_flow(initial_deposit)
    
    async def _realise_position(self, closing_trade: Trade, position: Position):
        if not position.is_closed:
            raise ValueError("Position must be closed")

        portfolio_currency = cache_get(f"portfolio_native_currency:{position.portfolio_id}")
        if not portfolio_currency:
            raise ValueError("Could not get portfolio currency from cache")
        portfolio_currency = portfolio_currency["currency"]
        
        fx_rate = await get_last_fx(f"{position.currency}{portfolio_currency}")
        
        if not fx_rate:
            raise ValueError("No FX rate available")

        fx_mid_price = Decimal(str(fx_rate["midPrice"])) # type: ignore

        if position.direction == PositionDirection.SHORT:
            buyback_cash = CashFlow(
                portfolio_id=position.portfolio_id,
                amount=Decimal("-1.0") * closing_trade.price * Decimal(closing_trade.quantity),
                converted_amount=Decimal("-1.0") * closing_trade.price * Decimal(closing_trade.quantity) * fx_mid_price,
                fx_at_time_of_conversion = fx_mid_price,
                flow_type=CashFlowType.SHORT_COVER,
                position_id=position.id,
                trade_id=closing_trade.id,
                currency=closing_trade.currency,
                root_position_id = position.root_position_id
            )
            self.session.add(buyback_cash)
        else:
            sale_proceeds = CashFlow(
                portfolio_id=position.portfolio_id,
                amount=closing_trade.price * Decimal(closing_trade.quantity),
                converted_amount=closing_trade.price * Decimal(closing_trade.quantity) * fx_mid_price,
                fx_at_time_of_conversion = fx_mid_price,
                flow_type=CashFlowType.LONG_SELL,
                position_id=position.id,
                trade_id=closing_trade.id,
                currency=closing_trade.currency,
                root_position_id = position.root_position_id
            )
            self.session.add(sale_proceeds)

        await self.session.flush()

    async def _cash_cost_from_trade(self, trade: Trade, position: Position):
        portfolio_currency = cache_get(f"portfolio_native_currency:{trade.portfolio_id}")

        if not portfolio_currency:
            raise ValueError("Could not get portfolio currency from cache")
        portfolio_currency = portfolio_currency["currency"]

        fx_rate = await get_last_fx(f"{trade.currency}{portfolio_currency}")

        if not fx_rate:
            raise ValueError("No FX rate available")

        fx_mid_price = Decimal(str(fx_rate["midPrice"])) # type: ignore
        

        if trade.direction == TradeTypeEnum.BUY:
            amount = -trade.notional
            converted_amount = -trade.notional * fx_mid_price
            flow_type = CashFlowType.LONG_BUY
        else:
            amount = trade.notional
            converted_amount = trade.notional * fx_mid_price
            flow_type = CashFlowType.SHORT_SELL

        cash_cost = CashFlow(
            portfolio_id=trade.portfolio_id,
            amount=amount,
            flow_type=flow_type,
            trade_id=trade.id,
            position_id = position.id,
            root_position_id = position.root_position_id,
            currency = trade.currency,
            converted_amount = converted_amount,
            fx_at_time_of_conversion = fx_mid_price
        )

        result = await self._add_cash_flow(cash_cost)
        return result

    # this service gets cash balance but is currency unaware. to get currency aware (like realised portfolio balance) use the next function
    async def _get_portfolio_balance_all_currency(self, portfolio_id: int) -> dict:
        result = await self.session.execute(
            select(CashFlow.currency, func.sum(CashFlow.amount))
            .where(CashFlow.portfolio_id == portfolio_id)
            .group_by(CashFlow.currency)
        )
        
        # Return a dict, e.g., {"USD":1000.50, "EUR":"50.00"}
        rows = result.all()
        
        return {row[0]: Decimal(str(row[1])) for row in rows}
    
    async def _get_portfolio_balance_native(self, portfolio_id: int):
        result = await self.session.execute(
            select(func.sum(CashFlow.converted_amount))
            .where(CashFlow.portfolio_id == portfolio_id)
        )

        row =result.one_or_none()

        return row[0] if row else Decimal("0")

    async def _get_cash_ledger_by_portfolio(self, portfolio_id: int) -> list[CashFlow]:
        cash_ledger_result = await self.session.execute(
            select(CashFlow).where(CashFlow.portfolio_id == portfolio_id)
        )

        return list(cash_ledger_result.scalars().all())


    async def _get_ndv(self, portfolio_id: int):
        result = await self.session.execute(
            select(func.sum(CashFlow.amount))
            .where(and_(
                CashFlow.portfolio_id == portfolio_id,
                or_(
                    CashFlow.flow_type == CashFlowType.DEPOSIT,
                    CashFlow.flow_type == CashFlowType.WITHDRAWAL,
                    CashFlow.flow_type == CashFlowType.DIVIDEND,
                    CashFlow.flow_type == CashFlowType.FEE
                )
            ))
        )

        row = result.scalar_one()
        return row if row else Decimal("0")

    async def _get_encumbered_short_proceeds(self, portfolio_id: int) -> Decimal:
        # return the amount of cash that is still encumbered by currently open short positions, expressed in the portfolios native currency
        # idea:
        # 1) find every root short position that is still open (essentially the parent position)
        # 2) for those roots, sum all short sell cash inflows flows (gross proceeds)
        # 3) subtract all short cover cash flows already used to buy back part (or all) of those shorts
        # 4) sum the remaining amounts across all open shorts roots
        # the result is how much short-sale cash is not actually free to reuse

        # (1) identify all open root shorts in a portfolio
        open_roots_subq = (
            select(Position.root_position_id)
            .where(
                and_(
                    Position.portfolio_id == portfolio_id,
                    Position.direction == PositionDirection.SHORT,
                    Position.is_closed.is_(False)
                )
            )
            .distinct() # one row per root_position_id
            .subquery()
        )

        # (2) for each open root, sum the short sell proceeds ('gross' encumbered)
        gross_short_subq = (
            select(
                CashFlow.root_position_id.label("root_id"),
                func.coalesce(func.sum(CashFlow.converted_amount), 0).label("gross")
            )
            .where(
                and_(
                    CashFlow.portfolio_id == portfolio_id,
                    CashFlow.flow_type == CashFlowType.SHORT_SELL,
                    CashFlow.root_position_id.in_(select(open_roots_subq.c.root_position_id))
                )
            )
            .group_by(CashFlow.root_position_id) # one row per root
            .subquery()
        )

        # (3) for each same open root, sum the short cover amounts already paid bacl
        covers_subq = (
            select(
                CashFlow.root_position_id.label("root_id"),
                func.coalesce(func.sum(CashFlow.converted_amount), 0).label("covers")
            )
            .where(
                and_(
                    CashFlow.portfolio_id == portfolio_id,
                    CashFlow.flow_type == CashFlowType.SHORT_COVER,
                    CashFlow.root_position_id.in_(select(open_roots_subq.c.root_position_id))
                )
            )
            .group_by(CashFlow.root_position_id)
            .subquery()
        )

        # (4) join the two per-root aggregates and compute the remaining encumbered cash
        encumbered_q = (
            select(
                func.coalesce(func.sum(gross_short_subq.c.gross + func.coalesce(covers_subq.c.covers, 0)), 0)
            )
            .select_from(gross_short_subq)
            .outerjoin(covers_subq, covers_subq.c.root_id == gross_short_subq.c.root_id) # outerjoin so roots with no covers yet still show up
        )

        encumbered = (await self.session.execute(encumbered_q)).scalar_one()

        return Decimal(str(encumbered)) if encumbered else Decimal("0")


    async def _get_free_cash(self, portfolio_id: int) -> Decimal:
        portfolio_balance_native = await self._get_portfolio_balance_native(portfolio_id)
        encumbered_in_shorts = await self._get_encumbered_short_proceeds(portfolio_id)

        return portfolio_balance_native - encumbered_in_shorts
