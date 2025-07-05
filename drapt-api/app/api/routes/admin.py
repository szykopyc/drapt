from fastapi import APIRouter, Depends, HTTPException, status
from fastapi_users import FastAPIUsers
from sqlalchemy.future import select
from app.db import get_async_session
from app.models.user import User
from app.users.manager import get_user_manager
from app.users.auth import auth_backend
from app.schemas.user import UserUpdate, UserUpdateResponseModel, UserReadResponseModel

router = APIRouter()

fastapi_users = FastAPIUsers[User, int](get_user_manager, [auth_backend])

@router.patch("/user/update/{user_id}", response_model=UserUpdateResponseModel, tags=["user"])
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
            detail="403: Only executives can update users.",
        )

    # Fetch the user to update
    result = await session.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="404: We couldn't find the user you requested.")

    # Update fields (only those present in the patch)
    for field, value in user_update.dict(exclude_unset=True).items():
        setattr(user, field, value)

    await session.commit()
    await session.refresh(user)
    return UserUpdateResponseModel.model_validate(user)

@router.get("/user/search/{username}", response_model=UserReadResponseModel, tags=["user"])
async def get_user_by_username(
    username: str,
    session=Depends(get_async_session),
    current_user: User = Depends(fastapi_users.current_user())
):
    if current_user.team != "executive":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="403: Only users with team 'executive' can search for a user.",
        )
    result = await session.execute(select(User).where(User.username == username))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="404: We couldn't find the user you requested.")

    return UserReadResponseModel.model_validate(user)

@router.delete("/user/delete/{user_id}", response_model=UserReadResponseModel, tags=["user"])
async def delete_user_by_id(
    user_id: int,
    session=Depends(get_async_session),
    current_user: User = Depends(fastapi_users.current_user())
):
    if current_user.role != "developer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="403: Only developer can delete users."
        )
    result = await session.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="The user that you wanted to delete was not found.")
    await session.delete(user)
    await session.commit()
    return UserReadResponseModel.model_validate(user)


@router.get("/user/all", response_model=list[UserReadResponseModel], tags=["user"])
async def list_all_users(
    session=Depends(get_async_session),
    current_user: User = Depends(fastapi_users.current_user()),
):
    if current_user.team != "executive":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="403: Only executives can see all users.",
        )
    
    result = await session.execute(select(User))
    users = result.scalars().all()

    if not users: 
        raise HTTPException(status_code=404, detail="404: Failed to load users.")

    return [UserReadResponseModel.model_validate(user) for user in users]