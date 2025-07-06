from typing import Optional, List
from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Integer, ForeignKey, DateTime, func
from app.db import Base

# this model addresses portfolio ownership
# it is not concerned with valuation, currency, or team members

class Portfolio(Base):
    __tablename__ = "portfolios"

    id: Mapped[int] = mapped_column(Integer, primary_key=True) # auto inserted
    portfolio_string_id: Mapped[str] = mapped_column(String(length=50), unique=True, nullable=False) # from user input
    name: Mapped[str] = mapped_column(String(length=100), nullable=False, unique=True) # from user input
    description: Mapped[Optional[str]] = mapped_column(String(length=255), nullable=True) # from user input
    pm_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False) # from user input
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, server_default=func.now()) # auto inserted
