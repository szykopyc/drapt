from typing import Optional
from pydantic import BaseModel, ConfigDict

from decimal import Decimal
from datetime import datetime

class AssetMetadataRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    company_name: str
    ticker: str
    type: str
    exchange: Optional[str] = "UNKWN" # this is because sometimes the exchange isn't known from tiingo for whatever reason
    description: Optional[str] = None
    countryCode: str
    adjClose: Optional[Decimal] = None


class AssetLastCloseRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    ticker: str
    open: Decimal
    high: Decimal
    low: Decimal
    close: Decimal
    volume: Decimal
    adjOpen: Decimal
    adjHigh: Decimal
    adjLow: Decimal
    adjClose: Decimal
    adjVolume: Decimal
    divCash: Decimal
    date: datetime
