from fastapi import APIRouter, Depends, HTTPException, status
from fastapi_users import FastAPIUsers
from sqlalchemy.future import select
from app.db import get_async_session
from app.models.user import User
from app.users.manager import get_user_manager
from app.users.auth import auth_backend
from app.schemas.user import UserCreate, UserRead, UserUpdate

router = APIRouter()

fastapi_users = FastAPIUsers[User, int](get_user_manager, [auth_backend])

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
    # Explicitly set sensitive fields
    user_create.is_verified = True
    user_create.is_superuser = user_create.role == "developer"
    user = await user_manager.create(user_create, safe=False, request=None)
    return user

@router.patch("/user/update/{user_id}", response_model=UserRead, tags=["user"])
async def custom_update_user(
    user_id: int,
    user_update: UserUpdate,
    session=Depends(get_async_session),
    current_user: User = Depends(fastapi_users.current_user()),
):
    # Only allow execs to patch users
    if current_user.team != "executive":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only users with team 'executive' can update users.",
        )

    # Fetch the user to update
    result = await session.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Update fields (only those present in the patch)
    for field, value in user_update.dict(exclude_unset=True).items():
        setattr(user, field, value)

    await session.commit()
    await session.refresh(user)
    return user

@router.get("/user/search/{username}", response_model=UserRead, tags=["user"])
async def get_user_by_username(
    username: str,
    session=Depends(get_async_session),
    current_user: User = Depends(fastapi_users.current_user())
):
    if current_user.team != "executive":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only users with team 'executive' can search for a user.",
        )
    result = await session.execute(select(User).where(User.username == username))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user

@router.delete("/user/delete/{user_id}", response_model=UserRead, tags=["user"])
async def delete_user_by_id(
    user_id: int,
    session=Depends(get_async_session),
    current_user: User = Depends(fastapi_users.current_user())
):
    if current_user.role != "developer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only developer can delete users."
        )
    result = await session.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="The user that you wanted to delete was not found")
    await session.delete(user)
    await session.commit()
    return user


@router.get("/user/all", response_model=list[UserRead], tags=["user"])
async def list_all_users(
    session=Depends(get_async_session),
    current_user: User = Depends(fastapi_users.current_user()),
):
    if current_user.team != "executive":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only users with team 'executive' can see all users.",
        )
    
    result = await session.execute(select(User))
    users = result.scalars().all()
    return users