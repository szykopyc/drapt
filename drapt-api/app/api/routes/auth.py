# core import
from fastapi import APIRouter, Depends, HTTPException, status
from app.users.manager import get_user_manager
from fastapi_users.exceptions import UserAlreadyExists
from sqlalchemy.exc import IntegrityError
from sqlalchemy.future import select
from app.config.permissions import permission_check_util
# utils
from app.utils.log import admin_logger as logger

# models and schemas
from app.models.user import User
from app.schemas.user import UserCreate, UserRead, UserReadResponseModel
# custom permssions and imports fastapi_users to make all routes not be circular if that makes sense
from app.users.deps import fastapi_users

router = APIRouter()

# register a user (obvious i know). only allows you to register users if you are an exec.
# if no users have been created yet, use the create_first_user.py script
@router.post("/auth/register", response_model=UserReadResponseModel, tags=["auth"])
async def register_user(
    user_create: UserCreate,
    user_manager=Depends(get_user_manager),
    current_user: User = Depends(fastapi_users.current_user()),
):
    if not permission_check_util(current_user, "can_manage_user"):
        logger.warning(f"({current_user.username}) tried to register a new user (disallowed)")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only executives can register new users.",
        )
    
    # Explicitly set sensitive fields
    user_create.is_verified = True # this is always true. verification will never be used tbh.
    user_create.is_superuser = user_create.role == "developer" # only developer can be a superuser. don't see why anyone else would need to be a superuser
    try: 
        user = await user_manager.create(user_create, safe=False, request=None)

    except UserAlreadyExists: # if unique value is violated as a result of trying to create a new user
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already exists in the users table.")
    except IntegrityError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already exists in the users table.")

    logger.info(f"({current_user.username}) registered user USERNAME: {user_create.username} / FULLNAME: {user_create.fullname} / ROLE: {user_create.role} / TEAM: {user_create.team}")
    return UserReadResponseModel.model_validate(user)

# this is for checking auth pretty much. gets the logged in user.
# if user isn't logged in, the depends will throw exception anyway. that's good, don't need to overcomplicate this one with custom exceptions
@router.get("/auth/me", tags=["auth"])
async def read_current_user(user: User = Depends(fastapi_users.current_user())):
    return {
        "id": user.id,
        "email": user.email,
        "username": user.username,
        "fullname": user.fullname,
        "role": user.role,
        "team": user.team,
    }
