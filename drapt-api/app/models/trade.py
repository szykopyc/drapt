from typing import Optional
from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Numeric, ForeignKey, DateTime, func
from app.db import Base
from decimal import Decimal

from app.enums.trade import TradeTypeEnum, CurrencyEnum

class Trade(Base):
    __tablename__ = "trades"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True) # auto inserted
    portfolio_id: Mapped[int] = mapped_column(ForeignKey("portfolios.id"), nullable=False, index=True)

    ticker: Mapped[str] = mapped_column(String(length=6), nullable=False) # from input
    exchange: Mapped[str] = mapped_column(String(length=10), nullable=False) # from input
    price: Mapped[Decimal] = mapped_column(Numeric(18,6), nullable=False) # from input
    quantity: Mapped[Decimal] = mapped_column(Numeric(18,6), nullable=False) # from input
    notional: Mapped[Decimal] = mapped_column(Numeric(18,6), nullable=False)
    currency: Mapped[CurrencyEnum] = mapped_column(String(length=10), nullable=False) # from input
    
    direction: Mapped[TradeTypeEnum] = mapped_column(String(length=10), nullable=False)
    execution_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=func.now(), server_default=func.now()) # auto inserted
    venue: Mapped[str] = mapped_column(String(length=100), nullable=False, default="t212", server_default="t212") # by default its trading 212 for this example
    
    trader_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False) # person who executed the trade
    analyst_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False) # person who recommended the trade
    notes: Mapped[Optional[str]] = mapped_column(String(length=1024), nullable=True) # trade notes, optional
