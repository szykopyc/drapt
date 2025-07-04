from fastapi_users import schemas
from typing import Optional
from pydantic import BaseModel, EmailStr

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
