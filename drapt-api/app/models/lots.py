from typing import Optional
from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Numeric, ForeignKey, DateTime, func, Boolean
from app.db import Base
from decimal import Decimal

from app.enums.trade import CurrencyEnum
from app.enums.lot import LotDirectionEnum

class Lot(Base):
    __tablename__ = "lots"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    
    trade_id: Mapped[int] = mapped_column(ForeignKey("trades.id"), nullable=False)
    portfolio_id: Mapped[int] = mapped_column(ForeignKey("portfolios.id"), nullable=False)
    trader_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    analyst_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)

    ticker: Mapped[str] = mapped_column(String(length=6), nullable=False)
    exchange: Mapped[str] = mapped_column(String(length=10), nullable=False)

    price: Mapped[Decimal] = mapped_column(Numeric(18,6), nullable=False) # price per unit
    quantity: Mapped[Decimal] = mapped_column(Numeric(18,6), nullable=False) # total acquired
    notional: Mapped[Decimal] = mapped_column(Numeric(18,6), nullable=False) # total amount on entry
    currency: Mapped[CurrencyEnum] = mapped_column(String(length=10), nullable=False)

    direction: Mapped[LotDirectionEnum] = mapped_column(String(length=10), nullable=False)
    acquisition_date: Mapped[datetime] = mapped_column(DateTime, nullable=False, server_default=func.now(), default=func.now())
    venue: Mapped[str] = mapped_column(String(100), nullable=False)
    open_quantity: Mapped[Decimal] = mapped_column(Numeric(18,6), nullable=False) # remaining quantity
    is_closed: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default="false", default=False)

    notes: Mapped[Optional[str]] = mapped_column(String(length=1024), nullable=True)
