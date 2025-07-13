from typing import Optional
from datetime import datetime # this is for setting the column to be a DT object
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Numeric, ForeignKey, DateTime, func
from app.db import Base

from decimal import Decimal

# this model addresses portfolio ownership
# it is not concerned with valuation, currency, or team members

class Portfolio(Base):
    __tablename__ = "portfolios"

    id: Mapped[int] = mapped_column(Integer, primary_key=True) # auto inserted
    portfolio_string_id: Mapped[str] = mapped_column(String(length=50), unique=True, nullable=False) # auto inserted
    name: Mapped[str] = mapped_column(String(length=100), nullable=False, unique=True) # from user input
    description: Mapped[Optional[str]] = mapped_column(String(length=1024), nullable=True) # from user input
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False,default=func.now(), server_default=func.now()) # auto inserted
    initial_cash: Mapped[Optional[Decimal]] = mapped_column(Numeric(18,2), nullable=False, default="0.00", server_default="0.00") # from PM admin input
    currency: Mapped[str] = mapped_column(String(length=3), nullable=False, default="GBP", server_default="GBP") # auto inserted, can be updated
