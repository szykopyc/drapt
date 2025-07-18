from decimal import Decimal
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import and_
from app.models.position import Position
from app.models.trade import Trade
from app.enums.trade import TradeTypeEnum
from app.enums.position import PositionDirection
from app.schemas.trade import TradeRead

class PositionService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    def convert_trade_dir_to_position_dir(self, trade_dir: TradeTypeEnum) -> PositionDirection:
        if trade_dir == TradeTypeEnum.BUY:
            return PositionDirection.LONG
        
        elif trade_dir == TradeTypeEnum.SELL:
            return PositionDirection.SHORT


    async def process_trade(self, trade: Trade) -> None:
        if trade.direction == TradeTypeEnum.BUY or trade.direction == TradeTypeEnum.SELL:
            await self._handle_trade(trade)

        else:
            raise ValueError(f"Invalid trade direction: {trade.direction}")

    def is_same_direction(self, trade: Trade, position: Position) -> bool:
        return self.convert_trade_dir_to_position_dir(trade.direction) == position.direction


    def _calculate_realised_pnl(self, trade: Trade, position: Position) -> Decimal:
        entry_cost = position.average_entry_price * trade.quantity
        exit_value = trade.price * trade.quantity

        pnl = Decimal("0")

        if position.direction == PositionDirection.LONG:
            pnl = exit_value - entry_cost

        if position.direction == PositionDirection.SHORT:
            pnl = entry_cost - exit_value

        return Decimal(pnl)


    async def _create_position(self, trade: Trade):
        position = Position(
            portfolio_id = trade.portfolio_id,
            ticker = trade.ticker,
            exchange = trade.exchange,
            direction = self.convert_trade_dir_to_position_dir(trade.direction),
            currency = trade.currency,
            initial_quantity = trade.quantity,
            entry_price = trade.price,
            entry_date = trade.execution_date,
            open_quantity = trade.quantity,
            average_entry_price = trade.price,
            realised_pnl = Decimal("0"),
            is_closed = False,
            close_date = None,
            exit_price = None,
            total_cost = trade.price * trade.quantity,
            updated_at = trade.execution_date
        )

        self.session.add(position)
        await self.session.commit()
        await self.session.refresh(position)

    def _close_position(self, position: Position, trade: Trade):
        position.realised_pnl += self._calculate_realised_pnl(trade, position)
        position.is_closed = True
        position.close_date = trade.execution_date
        position.exit_price = trade.price
        position.average_entry_price = Decimal("0")
        position.open_quantity = Decimal("0")
        position.total_cost = Decimal("0")

    async def _handle_trade(self, trade: Trade):
        position = await self._get_open_position(trade.portfolio_id, trade.ticker)

        if position is None:  # no position exists, create a new one
            await self._create_position(trade)
        else:
            position.updated_at = trade.execution_date

            if self.is_same_direction(trade, position):
                old_quantity = position.open_quantity
                new_quantity = trade.quantity
                total_quantity = old_quantity + new_quantity

                position.open_quantity = total_quantity

                old_avg_price = position.average_entry_price
                new_price = trade.price

                position.average_entry_price = (
                    (old_quantity * old_avg_price + new_quantity * new_price) / total_quantity
                )

                position.total_cost += trade.price * trade.quantity

            else:
                # Full close
                if trade.quantity == position.open_quantity:
                    self._close_position(position, trade)

                # Partial close
                elif trade.quantity < position.open_quantity:
                    position.realised_pnl += self._calculate_realised_pnl(trade, position)
                    proportion = trade.quantity / position.open_quantity
                    position.total_cost -= position.total_cost * proportion
                    position.open_quantity -= trade.quantity

                # Overclose
                elif trade.quantity > position.open_quantity:
                    closing_trade = Trade(
                        quantity=position.open_quantity,
                        price=trade.price,
                        direction=trade.direction,
                        execution_date=trade.execution_date,
                        portfolio_id=trade.portfolio_id,
                        ticker=trade.ticker,
                        exchange=trade.exchange,
                        notional=trade.notional,
                        currency=trade.currency,
                        venue=trade.venue,
                        trader_id=trade.trader_id,
                        analyst_id=trade.analyst_id
                    )
                    self._close_position(position, closing_trade)

                    over_quantity = trade.quantity - closing_trade.quantity
                    await self._create_position(
                        Trade(
                            portfolio_id=trade.portfolio_id,
                            ticker=trade.ticker,
                            exchange=trade.exchange,
                            price=trade.price,
                            quantity=over_quantity,
                            notional=trade.price * over_quantity,
                            currency=trade.currency,
                            direction=trade.direction,
                            execution_date=trade.execution_date,
                            venue=trade.venue,
                            trader_id=trade.trader_id,
                            analyst_id=trade.analyst_id
                        )
                    )

        await self.session.commit()
        if position is not None:
            await self.session.refresh(position)

    async def _get_open_position(self, portfolio_id: int, ticker: str) -> Position | None:
        position_result = await self.session.execute(select(Position).where(and_(
            Position.portfolio_id == portfolio_id,
            Position.ticker == ticker,
            Position.is_closed == False
        )))
        
        return position_result.scalar_one_or_none()
    
    async def _get_closed_position(self, portfolio_id: int, ticker: str) -> list[Position] | None:
        positions_result = await self.session.execute(select(Position).where(and_(
            Position.portfolio_id == portfolio_id,
            Position.ticker == ticker,
            Position.is_closed == True
        )))
        
        return list(positions_result.scalars().all())
