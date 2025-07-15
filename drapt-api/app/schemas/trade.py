from typing import Optional
from pydantic import BaseModel, ConfigDict
from datetime import datetime

from decimal import Decimal

from app.enums.trade import TradeTypeEnum, CurrencyEnum

class TradeRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    portfolio_id: int
    ticker: str
    price: Decimal
    direction: TradeTypeEnum
    quantity: Decimal
    execution_date: datetime
    notional: Decimal
    currency: CurrencyEnum
    venue: str
    trader_id: int
    analyst_id: int
    notes: Optional[str] = None

class TradeCreate(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    portfolio_id: int
    ticker: str
    price: Decimal
    direction: TradeTypeEnum
    quantity: Decimal
    execution_date: datetime
    venue: str
    analyst_id: int
    notes: Optional[str] = None
    currency: CurrencyEnum
