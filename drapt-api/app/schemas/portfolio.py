from typing import Optional, List
from pydantic import BaseModel, ConfigDict
from datetime import datetime

from decimal import Decimal

class UserSummary(BaseModel):
    id: int
    fullname: str
    username: str
    role: str
    email: str

# pydantic schemas for fetching/updating/creating portfolios
class PortfolioRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    portfolio_string_id: str
    name: str
    description: Optional[str] = None
    created_at: datetime
    initial_cash: Decimal
    currency: str

class PortfolioCreate(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    portfolio_string_id: str
    name: str
    description: Optional[str] = None
    pm_id: int

class PortfolioUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    initial_cash: Optional[Decimal] = None
    currency: Optional[str] = None

# pydantic schema for more in depth fetches like for overview
class PortfolioReadOverview(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    portfolio_string_id: str
    name: str
    description: Optional[str] = None
    created_at: datetime
    members: Optional[List[UserSummary]] = None
    initial_cash: Decimal
    currency: str
