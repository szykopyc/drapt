from contextlib import closing
from decimal import Decimal
from sqlalchemy.future import select
from sqlalchemy import func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import and_
from app.models.cash_ledger import CashFlow
from app.enums.position import PositionDirection
from app.models.position import Position
from app.models.trade import Trade
from app.enums.trade import TradeTypeEnum
from app.enums.cash_ledger import CashFlowType
from app.redis_client import cache_set_indefinite, cache_get
from app.services.data_services.market_data import get_last_fx
from sqlalchemy import inspect

class CashService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def _add_cash_flow(self, cashflow: CashFlow):
        self.session.add(cashflow)
        await self.session.flush()
        await self.session.refresh(cashflow)


    async def _record_initial_portfolio_cash(self, Portfolio):
        # Ensure the portfolio is properly loaded
        await self.session.refresh(Portfolio)
        
        initial_deposit = CashFlow(
            portfolio_id=Portfolio.id,
            amount=Portfolio.initial_cash,
            flow_type=CashFlowType.DEPOSIT,
            currency=Portfolio.currency
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
                currency=closing_trade.currency
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
                currency=closing_trade.currency
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
            currency = trade.currency,
            converted_amount = converted_amount,
            fx_at_time_of_conversion = fx_mid_price
        )

        await self._add_cash_flow(cash_cost)

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
