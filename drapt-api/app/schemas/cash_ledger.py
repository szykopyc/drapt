from typing import Optional, List
from pydantic import BaseModel, ConfigDict
from datetime import datetime
from decimal import Decimal
from app.enums.cash_ledger import CashFlowType
from app.enums.trade import CurrencyEnum

class CashFlowRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    portfolio_id: int
    currency: CurrencyEnum
    timestamp: datetime
    amount: Decimal
    converted_amount: Decimal
    fx_at_time_of_conversion: Decimal
    flow_type: CashFlowType
    flow_description: Optional[str] = None
    trade_id: Optional[int] = None
    position_id: Optional[int] = None
