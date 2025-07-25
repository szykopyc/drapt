from sqlalchemy.future import select
from app.models.trade import Trade
from app.schemas.trade import TradeRead
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status
from app.exceptions.trade import TradeCreationError
from app.utils.log import trade_logger as logger

class TradeService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def _book_trade(self, trade, current_user, logger = logger) -> Trade | None:
        try:
            trade = Trade(
                portfolio_id = trade.portfolio_id,
                ticker = trade.ticker.upper(),
                exchange = trade.exchange.upper(),
                price = trade.price,
                direction = trade.direction,
                quantity = trade.quantity,
                execution_date = trade.execution_date,
                venue = trade.venue,
                trader_id = current_user.id,
                analyst_id = trade.analyst_id,
                notes = trade.notes,
                currency = trade.currency,
                notional = trade.quantity * trade.price
            )

            self.session.add(trade)
            await self.session.flush()
            await self.session.refresh(trade)

            return trade

        
        except Exception as e:
            logger.error(f"(Server) Error occurred while creating trade {trade.ticker}/{trade.portfolio_id}: {e}")
            logger.info("(Server) Initiating session rollback")
            await self.session.rollback()
            
            raise TradeCreationError(f"An error occurred while booking the trade for {trade.ticker}") from e


    async def _get_trades_by_portfolio_id(self, portfolio_id: int) -> list[TradeRead]:
        selected_trades = await self.session.execute(select(Trade).where(Trade.portfolio_id == portfolio_id))
        selected_trades = selected_trades.scalars().all()

        return [TradeRead.model_validate(trade) for trade in selected_trades]
