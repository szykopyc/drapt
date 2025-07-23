from decimal import Decimal
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import and_
from app.enums import position
from app.models.position import Position
from app.models.trade import Trade
from app.enums.trade import TradeTypeEnum
from app.enums.position import PositionDirection
from app.schemas.trade import TradeRead
from app.services.position_services.unrealised_pnl_service import calculate_open_position_unrealised_pnl
from app.schemas.position import EnhancedPosition
from app.enums.trade_orchestrator import TradeIntentionEnum

class PositionService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    def convert_trade_dir_to_position_dir(self, trade_dir: TradeTypeEnum) -> PositionDirection:
        if trade_dir == TradeTypeEnum.BUY:
            return PositionDirection.LONG
        
        elif trade_dir == TradeTypeEnum.SELL:
            return PositionDirection.SHORT

    ### the below func is unneccessary. delete later

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


    async def _create_position(self, trade: Trade) -> Position:
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
        await self.session.flush()
        return position

    async def _close_position(self, position: Position, trade: Trade) -> Position:
        position.realised_pnl += self._calculate_realised_pnl(trade, position)
        position.is_closed = True
        position.close_date = trade.execution_date
        position.exit_price = trade.price
        position.average_entry_price = Decimal("0")
        position.open_quantity = Decimal("0")
        position.total_cost = Decimal("0")

        await self.session.flush()
        # returns a synthetic trade for cash flow logging downsteam
        return position

    async def _handle_trade(self, trade: Trade) -> list:
        if not (trade.direction == TradeTypeEnum.BUY or trade.direction == TradeTypeEnum.SELL):
            raise ValueError(f"Invalid trade direction: {trade.direction}")

        trade_intention = []

        position = await self._get_open_position_with_ticker(trade.portfolio_id, trade.ticker)

        if position is None:  # no position exists, create a new one
            new_pos = await self._create_position(trade)
            trade_intention = [
                {
                    "intent": TradeIntentionEnum.CREATE,
                    "position": new_pos,
                    "trade": trade
                }
            ]
            return trade_intention

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

                trade_intention = [
                    {
                        "intent": TradeIntentionEnum.ADDTO,
                        "position": position,
                        "trade": trade
                    }
                ]

            else:
                # Full close
                if trade.quantity == position.open_quantity:
                    close_pos = await self._close_position(position, trade)
                    trade_intention = [
                        {
                            "intent": TradeIntentionEnum.CLOSE,
                            "position": close_pos,
                            "trade": trade
                        }
                    ]

                # Partial close
                elif trade.quantity < position.open_quantity:
                    closed_position = Position(
                        portfolio_id=position.portfolio_id,
                        ticker=position.ticker,
                        exchange=position.exchange,
                        direction=position.direction,
                        currency=position.currency,
                        initial_quantity=trade.quantity,
                        entry_price=position.average_entry_price,
                        entry_date=position.entry_date,
                        open_quantity=Decimal("0"),
                        average_entry_price=position.average_entry_price,
                        realised_pnl=Decimal("0"),
                        is_closed=False,
                        close_date=None,
                        exit_price=None,
                        total_cost=position.average_entry_price * trade.quantity,
                        updated_at=trade.execution_date
                    )
                    self.session.add(closed_position)
                    await self.session.flush()

                    close_pos = await self._close_position(closed_position, trade)

                    position.total_cost -= position.average_entry_price * trade.quantity
                    position.open_quantity -= trade.quantity

                    trade_intention = [
                        {
                            "intent": TradeIntentionEnum.CLOSE,
                            "position": close_pos,
                            "trade": trade
                        }
                    ]

                # Overclose
                elif trade.quantity > position.open_quantity:
                    closing_trade = Trade(
                        id = trade.id,
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
                    closing_portion = await self._close_position(position, closing_trade)

                    over_quantity = trade.quantity - closing_trade.quantity

                    create_trade = Trade(
                            id = trade.id,
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

                    create_portion = await self._create_position(create_trade)

                    trade_intention = [
                        {
                            "intent": "CLOSE",
                            "position": closing_portion,
                            "trade": closing_trade,
                        },
                        {
                            "intent": "CREATE",
                            "position": create_portion,
                            "trade": create_trade
                        }
                    ]

            return trade_intention

    async def _get_open_position_with_ticker(self, portfolio_id: int, ticker: str) -> Position | None:
        position_result = await self.session.execute(select(Position).where(and_(
            Position.portfolio_id == portfolio_id,
            Position.ticker == ticker,
            Position.is_closed == False
        )))
        
        position = position_result.scalar_one_or_none()
    
        if position:
            await self.session.refresh(position)

        return position
    
    async def _get_closed_position_with_ticker(self, portfolio_id: int, ticker: str) -> list[Position] | None:
        positions_result = await self.session.execute(select(Position).where(and_(
            Position.portfolio_id == portfolio_id,
            Position.ticker == ticker,
            Position.is_closed == True
        )))
        
        return list(positions_result.scalars().all())


    async def _get_open_position_with_portfolio(self, portfolio_id: int) -> list[EnhancedPosition] | None:
        positions_result = await self.session.execute(select(Position).where(and_(Position.portfolio_id == portfolio_id, Position.is_closed == False)))
        
        positions = list(positions_result.scalars().all())

        enhanced_positions = await calculate_open_position_unrealised_pnl(positions)

        return enhanced_positions

    
    async def _get_closed_position_with_portfolio(self, portfolio_id: int) -> list[Position] | None:
        positions_result = await self.session.execute(select(Position).where(and_(Position.portfolio_id == portfolio_id, Position.is_closed == True)))
        return list(positions_result.scalars().all())