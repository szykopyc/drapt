from typing import Optional
from pydantic import BaseModel, ConfigDict

from decimal import Decimal

class AssetMetadataRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    company_name: str
    ticker: str
    type: str
    exchange: str
