from typing import Optional, List
from pydantic import BaseModel, ConfigDict
from datetime import datetime

class UserSummary(BaseModel):
    id: int
    fullname: str
    username: str
    role: str

# pydantic schemas for fetching/updating/creating portfolios
class PortfolioRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    portfolio_string_id: str
    name: str
    description: Optional[str] = None
    created_at: datetime
    members: Optional[List[UserSummary]] = None

class PortfolioCreate(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    portfolio_string_id: str
    name: str
    description: Optional[str] = None
    pm_id: int

class PortfolioUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None