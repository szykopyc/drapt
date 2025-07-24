from datetime import datetime
from decimal import Decimal
from sqlalchemy import String, Numeric, ForeignKey, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column
from app.db import Base
from app.enums.cash_ledger import CashFlowType
from typing import Optional
from app.enums.trade import CurrencyEnum

class CashFlow(Base):
    __tablename__ = "cash_ledger"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    portfolio_id: Mapped[int] = mapped_column(ForeignKey("portfolios.id"), nullable=False, index=True)
    currency: Mapped[CurrencyEnum] = mapped_column(String(length=4), nullable=False)
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=func.now(), server_default=func.now(), nullable=False)
    amount: Mapped[Decimal] = mapped_column(Numeric(18,6), nullable=False)
    converted_amount: Mapped[Decimal] = mapped_column(Numeric(18,6), nullable=True)
    fx_at_time_of_conversion: Mapped[Decimal] = mapped_column(Numeric(10,6), nullable = True)
    flow_type: Mapped[CashFlowType] = mapped_column(String(length=100), nullable=False)
    flow_description: Mapped[str] = mapped_column(String(length=1024), nullable=True)

    # optional links to source events
    trade_id: Mapped[int] = mapped_column(ForeignKey("trades.id"), nullable=True)
    position_id: Mapped[int] = mapped_column(ForeignKey("positions.id"), nullable=True)

    # root position id for partial closes
    root_position_id: Mapped[int] = mapped_column(ForeignKey("positions.id"), nullable=True)

    def __repr__(self) -> str:
        return (
            f"<CashFlow #{self.id} | Portfolio {self.portfolio_id} | Currency {self.currency} | "
            f"{self.flow_type}: {self.amount} @ {self.timestamp.isoformat()} | Converted Amount {self.converted_amount} | FX rate {self.fx_at_time_of_conversion} | "
            f"Trade ID: {self.trade_id} | Position ID: {self.position_id} | Root Pos ID: {self.root_position_id}>"
        )
