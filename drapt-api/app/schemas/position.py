from typing import Optional
from datetime import datetime
from decimal import Decimal
from app.enums.position import PositionDirection
from pydantic import BaseModel, ConfigDict

class PositionRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    portfolio_id: int
    ticker: str
    exchange: str
    direction: PositionDirection
    currency: str

    initial_quantity: Decimal
    entry_price: Decimal
    entry_date: datetime

    open_quantity: Decimal
    average_entry_price: Decimal
    
    realised_pnl: Decimal
    is_closed: bool
    close_date: Optional[datetime] = None
    exit_price: Optional[Decimal] = None

    total_cost: Decimal
    updated_at: datetime