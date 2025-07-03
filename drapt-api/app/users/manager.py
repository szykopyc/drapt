from fastapi_users import BaseUserManager, IntegerIDMixin, InvalidPasswordException
from fastapi_users.db import SQLAlchemyUserDatabase
from fastapi import Depends
from app.models.user import User
from app.db import async_session_maker
from typing import Union

SECRET = "SUPER_SECRET"  # Replace with env var for production!

class UserManager(IntegerIDMixin, BaseUserManager[User, int]):
    reset_password_token_secret = SECRET
    verification_token_secret = SECRET

async def validate_password(self, password: str) -> None:
    if len(password) < 8:
        raise InvalidPasswordException(reason="Password should be at least 8 characters")

async def get_user_db():
    async with async_session_maker() as session:
        yield SQLAlchemyUserDatabase(session, User)

async def get_user_manager(user_db=Depends(get_user_db)):
    yield UserManager(user_db)