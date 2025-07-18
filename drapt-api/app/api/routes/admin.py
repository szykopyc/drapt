# core imports
from fastapi import APIRouter, Depends, HTTPException, status

# db imports
from sqlalchemy.future import select
from app.db import get_async_session

# schema imports
from app.models.user import User
from app.schemas.user import UserRead, UserUpdate, UserUpdateResponseModel, UserReadResponseModel

# permissions and dependencies
from app.users.deps import fastapi_users
from app.config.permissions import permission_check_util

# logger
from app.utils.log import admin_logger as logger

router = APIRouter()

# updates a user from the admin dashboard
@router.patch("/user/{user_id}/update", response_model=UserUpdateResponseModel, tags=["user"])
async def update_user_by_id(
    user_id: int,
    user_update: UserUpdate,
    session=Depends(get_async_session),
    current_user: User = Depends(fastapi_users.current_user()),
):
    # Only allow execs to patch users
    if not permission_check_util(current_user, "can_manage_user"):
        logger.warning(f"({current_user.username}) tried to update user USER ID: {user_id} (disallowed)")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only executives can update users.",
        )

    # Fetch the user to update
    result = await session.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="We couldn't find the user you requested.")

    # Update fields (only those present in the patch)
    for field, value in user_update.model_dump(exclude_unset=True).items():
        setattr(user, field, value) # this sets the attributes of an object which are affected by the patch.


    await session.commit()
    await session.refresh(user)
    changed_fields = ", ".join(user_update.model_dump(exclude_unset=True).keys())
    logger.info(
        f"({current_user.username}) updated user USERNAME: {user.username} / FULLNAME: {user.fullname} / ATTRIBUTES: {changed_fields}"
    )
    return UserUpdateResponseModel.model_validate(user)

# searches a user. this is ideally for admins to use, might make a new one for regular users to use which will return less data (for instance no email address or ID)
@router.get("/user/{username}/search", response_model=UserReadResponseModel, tags=["user"])
async def get_user_by_username(
    username: str,
    session=Depends(get_async_session),
    current_user: User = Depends(fastapi_users.current_user())
):
    if not permission_check_util(current_user, "can_search_user"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only PMs and above can search for a user.",
        )
    result = await session.execute(select(User).where(User.username == username))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="We couldn't find the user you requested.")

    return UserReadResponseModel.model_validate(user)

# deletes a user (obviously), only the developer can do it. then again it wouldn't hurt for any exec to do it, since a user has no FK unless they're a PM
@router.delete("/user/{user_id}/delete", response_model=UserReadResponseModel, tags=["user"])
async def delete_user_by_id(
    user_id: int,
    session=Depends(get_async_session),
    current_user: User = Depends(fastapi_users.current_user())
):
    if not permission_check_util(current_user, "can_manage_user"):
        logger.warning(f"({current_user.username}) tried to delete user USER ID: {user_id} (disallowed)")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only developer can delete users."
        )
    result = await session.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="The user that you wanted to delete was not found.")
    await session.delete(user)
    await session.commit()

    logger.info(f"({current_user.username}) deleted user USERNAME: {user.username} / FULLNAME: {user.fullname}")
    return UserReadResponseModel.model_validate(user)

# gets all users. again may make a new one which returns less data for non exec/pm users.
@router.get("/user/all", response_model=list[UserReadResponseModel], tags=["user"])
async def list_all_users(
    session=Depends(get_async_session),
    current_user: User = Depends(fastapi_users.current_user()),
):
    if not permission_check_util(current_user, "can_manage_user"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only executives can see all users.",
        )
    
    result = await session.execute(select(User))
    users = result.scalars().all()

    if not users: 
        raise HTTPException(status_code=404, detail="Failed to find users.")

    return [UserReadResponseModel.model_validate(user) for user in users] # returns a list

# searches user by role. honestly this can just stay as exec/pm only, an analyst would never need to see all other users with a certain role. unless leaderboards come in, i can worry about that later
@router.get("/user/{role}/searchbyrole", response_model=list[UserReadResponseModel], tags=["user"])
async def search_by_role(
    role: str,
    session=Depends(get_async_session),
    current_user: User = Depends(fastapi_users.current_user())
):
    if not permission_check_util(current_user, "can_manage_user"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only executive users can search users by role."
        )
    result = await session.execute(select(User).where(User.role==role))
    users = result.scalars().all()

    if not users:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="4O4: Failed to find users with the role you requested.")
    return [UserReadResponseModel.model_validate(user) for user in users]# returns a list

# search user by team
@router.get("/user/{team}/searchbyteam", response_model=list[UserReadResponseModel], tags=["user"])
async def search_by_team(
    team: str,
    session = Depends(get_async_session),
    current_user: User = Depends(fastapi_users.current_user())
): 
    if not permission_check_util(current_user, "can_search_user"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only PMs+ can search for users.")

    result = await session.execute(select(User).where(User.team == team))
    users = result.scalars().all()

    if not users:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Failed to find users with the team you requested.")

    return [UserReadResponseModel.model_validate(user) for user in users]

### unassign user from a portfolio
@router.patch("/user/{user_id}/unassign-user-from-portfolio", response_model=UserReadResponseModel, tags=["user"])
async def unassign_user_from_any_portfolio(
    user_id: int,
    session=Depends(get_async_session),
    current_user: User = Depends(fastapi_users.current_user())
):
    if not permission_check_util(current_user, "can_manage_portfolio"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only PMs and above can manage portfolio members.")

    result = await session.execute(select(User).where(User.id==user_id))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Failed to fetch the user you requested.")
    
    if user.portfolio_id is None:
        return UserReadResponseModel.model_validate(user)

    if not (current_user.portfolio_id == user.portfolio_id or permission_check_util(current_user, "can_manage_user")):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Unable to manage users assigned to other portfolios.")
    
    user_portfolio_id_for_logging = user.portfolio_id
    user.portfolio_id = None
    
    await session.commit()
    await session.refresh(user)

    logger.info(f"({current_user.username}) unassigned user USERNAME: {user.username} / FULLNAME: {user.fullname} from PORTFOLIO ID: {user_portfolio_id_for_logging}")
    
    return UserReadResponseModel.model_validate(user)

@router.patch("/user/{user_id}/assign-user-to-portfolio/{portfolio_id}", response_model=UserReadResponseModel, tags=["user"])
async def assign_user_to_portfolio(
    user_id: int,
    portfolio_id: int,
    session=Depends(get_async_session),
    current_user: User = Depends(fastapi_users.current_user())
):
    if not permission_check_util(current_user, "can_manage_portfolio"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only PMs and above can manage portfolio members.")

    result = await session.execute(select(User).where(User.id==user_id))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Failed to fetch the user you requested.")

    if not (current_user.portfolio_id == user.portfolio_id or permission_check_util(current_user, "can_manage_user")):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Unable to manage users assigned to other portfolios.")
    
    user.portfolio_id = portfolio_id
    
    await session.commit()
    await session.refresh(user)

    logger.info(f"({current_user.username}) assigned user USERNAME: {user.username} / FULLNAME: {user.fullname} to PORTFOLIO ID: {user.portfolio_id}")
    
    return UserReadResponseModel.model_validate(user)
