from fastapi_users import schemas
from typing import Optional
from pydantic import BaseModel, EmailStr, ConfigDict

# FASTAPI Users required schemas, don't delete

class UserRead(schemas.BaseUser[int]):
    fullname: str
    username: str
    role: str
    team: str

class UserCreate(schemas.BaseUserCreate):
    fullname: str
    username: str
    role: str
    team: str
    portfolio_id: Optional[int] = None

class UserUpdate(schemas.BaseUserUpdate):
    password: Optional[str] = None
    email: Optional[EmailStr] = None
    is_active: Optional[bool] = None
    is_superuser: Optional[bool] = None
    is_verified: Optional[bool] = None
    fullname: Optional[str] = None
    username: Optional[str] = None
    role: Optional[str] = None
    team: Optional[str] = None
    portfolio_id: Optional[int] = None
    
# Custom Pydantic schemas for response_model's 

class UserReadResponseModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    email: EmailStr
    fullname: str
    username: str
    role: str
    team: str
    portfolio_id: Optional[int] = None

class UserUpdateResponseModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    email: EmailStr
    fullname: str
    username: str
    role: str
    team: str
    portfolio_id: Optional[int] = None