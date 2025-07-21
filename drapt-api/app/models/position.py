from datetime import datetime
from decimal import Decimal
from sqlalchemy import String, Numeric, ForeignKey, DateTime, func, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from app.db import Base
from app.enums.position import PositionDirection

class Position(Base):
    __tablename__ = "positions"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    portfolio_id: Mapped[int] = mapped_column(ForeignKey("portfolios.id"), nullable=False, index=True)

    ticker: Mapped[str] = mapped_column(String(length=6), nullable=False)
    exchange: Mapped[str] = mapped_column(String(length=10), nullable=False)
    direction: Mapped[PositionDirection] = mapped_column(String(length=10), nullable=False) # either LONG or SHORT
    currency: Mapped[str] = mapped_column(String(length=10), nullable=False)

    # position entry 
    initial_quantity: Mapped[Decimal] = mapped_column(Numeric(18,6), nullable=False) # init on pos creation
    entry_price: Mapped[Decimal] = mapped_column(Numeric(18,6), nullable=False)
    entry_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=func.now(), nullable=False)

    # Aggregated quantities
    open_quantity: Mapped[Decimal] = mapped_column(Numeric(18,6), nullable=False)  # net open qty
    average_entry_price: Mapped[Decimal] = mapped_column(Numeric(18,6), nullable=False)  # avg entry price

    realised_pnl: Mapped[Decimal] = mapped_column(Numeric(18,6), nullable=False, default=Decimal("0.0"))
    is_closed: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    close_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True)
    exit_price: Mapped[Decimal] = mapped_column(Numeric(18,6), nullable=True)

    # This is useful for performance metrics
    total_cost: Mapped[Decimal] = mapped_column(Numeric(18,6), nullable=False)

    # Optional timestamps
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=func.now(), onupdate=func.now())
