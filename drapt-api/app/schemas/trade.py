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
    exchange: str
    price: Decimal
    quantity: Decimal
    notional: Decimal
    currency: CurrencyEnum

    direction: TradeTypeEnum
    execution_date: datetime
    venue: str
    trader_id: int
    analyst_id: int
    notes: Optional[str] = None

class TradeCreate(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    portfolio_id: int
    ticker: str
    exchange: str # user has no control regarding what the exhange is, it's autoinserted
    price: Decimal
    quantity: Decimal
    currency: CurrencyEnum
    direction: TradeTypeEnum
    execution_date: datetime
    venue: str
    analyst_id: int
    notes: Optional[str] = None