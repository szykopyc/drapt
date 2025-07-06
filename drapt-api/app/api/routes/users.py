from fastapi import APIRouter, Depends, HTTPException, status
from fastapi_users import FastAPIUsers
from sqlalchemy.future import select
from app.db import get_async_session
from app.models.user import User
from app.users.manager import get_user_manager
from app.users.auth import auth_backend
from app.schemas.user import UserCreate, UserRead, UserUpdate
from app.users.deps import fastapi_users

router = APIRouter()

@router.get("/me")
async def read_current_user(user: User = Depends(fastapi_users.current_user())):
    return {
        "id": user.id,
        "email": user.email,
        "username": user.username,
        "fullname": user.fullname,
        "role": user.role,
        "team": user.team
    }