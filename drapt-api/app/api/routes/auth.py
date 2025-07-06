from fastapi import APIRouter, Depends, HTTPException, status
from fastapi_users import FastAPIUsers
from app.models.user import User
from app.users.manager import get_user_manager
from app.users.auth import auth_backend
from app.schemas.user import UserCreate, UserRead
from app.users.deps import fastapi_users

router = APIRouter()

@router.post("/auth/register", response_model=UserRead, tags=["auth"])
async def custom_register(
    user_create: UserCreate,
    user_manager=Depends(get_user_manager),
    current_user: User = Depends(fastapi_users.current_user()),
):
    if current_user.team != "executive":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="403: Only executives can register new users.",
        )
    # Explicitly set sensitive fields
    user_create.is_verified = True
    user_create.is_superuser = user_create.role == "developer"
    user = await user_manager.create(user_create, safe=False, request=None)
    return user