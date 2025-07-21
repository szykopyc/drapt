from app.services.data_services.market_data import get_ticker_last_close
from app.models.position import Position
from app.schemas.position import EnhancedPosition
from app.enums.position import PositionDirection
from decimal import Decimal
from typing import List, Any
from datetime import datetime

async def calculate_open_position_unrealised_pnl(open_positions: List) -> List[EnhancedPosition]:
    enhanced_positions = []

    for position in open_positions:
        ticker = position.ticker

        last_close_data = await get_ticker_last_close(ticker)

        if not last_close_data:
            return []

        adj_close = Decimal(str(last_close_data["adjClose"]))

        last_price_date = datetime.fromisoformat(last_close_data["date"])

        open_qty = Decimal(str(position.open_quantity))
        avg_entry = Decimal(str(position.average_entry_price))

        unrealised_pnl_calc = (open_qty * adj_close) - (avg_entry * open_qty)
        unrealised_pnl_final = Decimal("0")

        if position.direction == PositionDirection.LONG:
            unrealised_pnl_final += unrealised_pnl_calc
        else:  # SHORT
            unrealised_pnl_final -= unrealised_pnl_calc

        enhanced_position_dict = {
            "id": position.id,
            "portfolio_id": position.portfolio_id,
            "ticker": position.ticker,
            "exchange": position.exchange,
            "direction": position.direction,
            "currency": position.currency,
            "initial_quantity": position.initial_quantity,
            "entry_price": position.entry_price,
            "entry_date": position.entry_date,
            "average_entry_price": avg_entry,
            "open_quantity": open_qty,
            "realised_pnl": position.realised_pnl,
            "is_closed": position.is_closed,
            "close_date": position.close_date,
            "exit_price": position.exit_price,
            "total_cost": position.total_cost,
            "updated_at": position.updated_at,
            "unrealised_pnl": unrealised_pnl_final,
            "last_asset_price": adj_close,
            "valid_price_date":  last_price_date
        }

        # Parse to EnhancedPosition
        enhanced_position = EnhancedPosition(**enhanced_position_dict)
        enhanced_positions.append(enhanced_position)

    return enhanced_positions
