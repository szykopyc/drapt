from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.future import select
from app.db import get_async_session
from app.models.user import User
from app.schemas.user import UserUpdate, UserUpdateResponseModel, UserReadResponseModel
from app.users.deps import fastapi_users
from app.config.permissions import permissions as role_permissions

router = APIRouter()

# updates a user from the admin dashboard
@router.patch("/user/update/{user_id}", response_model=UserUpdateResponseModel, tags=["user"])
async def custom_update_user(
    user_id: int,
    user_update: UserUpdate,
    session=Depends(get_async_session),
    current_user: User = Depends(fastapi_users.current_user()),
):
    # Only allow execs to patch users
    role_perms = role_permissions.get(current_user.role)
    if not role_perms or not role_perms.get("can_manage_user"):
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
    for field, value in user_update.model_dump(exclude_unset=True).items():
        setattr(user, field, value) # this sets the attributes of an object which are affected by the patch.

    await session.commit()
    await session.refresh(user)
    return UserUpdateResponseModel.model_validate(user)

# searches a user. this is ideally for admins to use, might make a new one for regular users to use which will return less data (for instance no email address or ID)
@router.get("/user/search/{username}", response_model=UserReadResponseModel, tags=["user"])
async def get_user_by_username(
    username: str,
    session=Depends(get_async_session),
    current_user: User = Depends(fastapi_users.current_user())
):
    role_perms = role_permissions.get(current_user.role)
    if not role_perms or not role_perms.get("can_search_user"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="403: Only PMs and above can search for a user.",
        )
    result = await session.execute(select(User).where(User.username == username))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="404: We couldn't find the user you requested.")

    return UserReadResponseModel.model_validate(user)

# deletes a user (obviously), only the developer can do it. then again it wouldn't hurt for any exec to do it, since a user has no FK unless they're a PM
@router.delete("/user/delete/{user_id}", response_model=UserReadResponseModel, tags=["user"])
async def delete_user_by_id(
    user_id: int,
    session=Depends(get_async_session),
    current_user: User = Depends(fastapi_users.current_user())
):
    role_perms = role_permissions.get(current_user.role)
    if not role_perms or not role_perms.get("can_delete_user"):
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

# gets all users. again may make a new one which returns less data for non exec/pm users.
@router.get("/user/all", response_model=list[UserReadResponseModel], tags=["user"])
async def list_all_users(
    session=Depends(get_async_session),
    current_user: User = Depends(fastapi_users.current_user()),
):
    role_perms = role_permissions.get(current_user.role)
    if not role_perms or not role_perms.get("can_manage_user"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="403: Only executives can see all users.",
        )
    
    result = await session.execute(select(User))
    users = result.scalars().all()

    if not users: 
        raise HTTPException(status_code=404, detail="404: Failed to find users.")

    return [UserReadResponseModel.model_validate(user) for user in users] # returns a list

# searches user by role. honestly this can just stay as exec/pm only, an analyst would never need to see all other users with a certain role. unless leaderboards come in, i can worry about that later
@router.get("/user/searchbyrole/{role}", response_model=list[UserReadResponseModel], tags=["user"])
async def search_by_role(
    role: str,
    session=Depends(get_async_session),
    current_user: User = Depends(fastapi_users.current_user())
):
    role_perms = role_permissions.get(current_user.role)
    if not role_perms or not role_perms.get("can_manage_user"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="403: Only executive users can search users by role."
        )
    result = await session.execute(select(User).where(User.role==role))
    users = result.scalars().all()

    if not users:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="4O4: Failed to find users with the role you requested.")
    return [UserReadResponseModel.model_validate(user) for user in users] # returns a list