from fastapi_users import schemas
from typing import Optional

class UserRead(schemas.BaseUser[int]):
    full_name: str
    username: str
    role: str
    team: str

class UserCreate(schemas.BaseUserCreate):
    full_name: str
    username: str
    role: str
    team: str

class UserUpdate(schemas.BaseUserUpdate):
    full_name: str
    username: str
    role: str
    team: str
