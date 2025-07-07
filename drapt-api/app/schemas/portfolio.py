from typing import Optional
from pydantic import BaseModel, ConfigDict
from datetime import datetime

# pydantic schemas for fetching/updating/creating portfolios
class PortfolioRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    portfolio_string_id: str
    name: str
    description: Optional[str] = None
    pm_id: int
    created_at: datetime

class PortfolioCreate(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    portfolio_string_id: str
    name: str
    description: Optional[str] = None
    pm_id: int

class PortfolioUpdate(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    portfolio_string_id: str
    name: str
    description: Optional[str] = None
    pm_id: int