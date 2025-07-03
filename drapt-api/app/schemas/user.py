from fastapi_users import schemas
from typing import Optional

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
    fullname: str
    username: str
    role: str
    team: str
