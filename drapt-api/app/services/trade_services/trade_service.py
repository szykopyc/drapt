from sqlalchemy.future import select
from app.models.trade import Trade
from app.schemas.trade import TradeRead
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status

class TradeService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def _book_trade(self, trade, current_user, logger) -> Trade | None:
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
            await self.session.commit()
            await self.session.refresh(trade)

            logger.info(f"({current_user.username}) created trade TICKER: {trade.ticker} / DATE: {trade.execution_date}")

            return trade

        
        except Exception as e:
            logger.error(f"(Server) Error occurred while creating trade {trade.ticker}/{trade.portfolio_id}: {e}")
            logger.info("(Server) Initiating session rollback")
            await self.session.rollback()

            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"An error occurred while booking the trade for {trade.ticker}")


    async def _get_trades_by_portfolio_id(self, portfolio_id: int) -> list[TradeRead]:
        selected_trades = await self.session.execute(select(Trade).where(Trade.portfolio_id == portfolio_id))
        selected_trades = selected_trades.scalars().all()

        if not selected_trades:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="We couldn't find any trades for the portfolio ID requested.")

        return [TradeRead.model_validate(trade) for trade in selected_trades]
