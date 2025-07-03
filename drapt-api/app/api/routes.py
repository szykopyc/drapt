from fastapi import APIRouter, Depends, HTTPException, status
from fastapi_users import FastAPIUsers
from app.models.user import User
from app.users.manager import get_user_manager
from app.users.auth import auth_backend
from app.schemas.user import UserCreate, UserRead

router = APIRouter()

fastapi_users = FastAPIUsers[User, int](get_user_manager, [auth_backend])

@router.get("/me")
async def read_current_user(user: User = Depends(fastapi_users.current_user())):
    return {
        "id": user.id,
        "email": user.email,
        "username": user.username,
        "full_name": user.full_name,
        "role": user.role,
        "team": user.team
    }

@router.post("/auth/register", response_model=UserRead, tags=["auth"])
async def custom_register(
    user_create: UserCreate,
    user_manager=Depends(get_user_manager),
    current_user: User = Depends(fastapi_users.current_user()),
):
    if current_user.team != "executive":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only users with team 'executive' can register new users.",
        )
    user = await user_manager.create(user_create, safe=True, request=None)
    return user