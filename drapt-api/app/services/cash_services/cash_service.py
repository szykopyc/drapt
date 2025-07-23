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

        await self._add_cash_flow(initial_deposit)
    
    async def _realise_position(self, closing_trade: Trade, position: Position):
        if not position.is_closed:
            raise ValueError("Position must be closed")

        if position.direction == PositionDirection.SHORT:
            buyback_cash = CashFlow(
                portfolio_id=position.portfolio_id,
                amount=Decimal("-1.0") * closing_trade.price * Decimal(closing_trade.quantity),
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
                flow_type=CashFlowType.LONG_SELL,
                position_id=position.id,
                trade_id=closing_trade.id,
                currency=closing_trade.currency
            )
            self.session.add(sale_proceeds)

        await self.session.flush()

    async def _cash_cost_from_trade(self, trade: Trade, position: Position):
        if trade.direction == TradeTypeEnum.BUY:
            amount = -trade.notional
            flow_type = CashFlowType.LONG_BUY
        else:
            amount = trade.notional
            flow_type = CashFlowType.SHORT_SELL

        cash_cost = CashFlow(
            portfolio_id=trade.portfolio_id,
            amount=amount,
            flow_type=flow_type,
            trade_id=trade.id,
            position_id = position.id,
            currency = trade.currency
        )

        await self._add_cash_flow(cash_cost)

    async def _get_portfolio_cash_balance(self, portfolio_id: int) -> dict:
        result = await self.session.execute(
            select(CashFlow.currency, func.sum(CashFlow.amount))
            .where(CashFlow.portfolio_id == portfolio_id)
            .group_by(CashFlow.currency)
        )
        
        # Return a dict, e.g., {"USD":1000.50}
        rows = result.all()
        
        return {row[0]: Decimal(str(row[1])) for row in rows}
    
    async def _get_cash_ledger_by_portfolio(self, portfolio_id: int) -> list[CashFlow]:
        cash_ledger_result = await self.session.execute(
            select(CashFlow).where(CashFlow.portfolio_id == portfolio_id)
        )

        return list(cash_ledger_result.scalars().all())