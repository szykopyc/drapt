from fastapi_users import FastAPIUsers
from app.models.user import User
from app.users.manager import get_user_manager
from app.users.auth import auth_backend

# returns a fastapi_users object, this mitigates circular imports

fastapi_users = FastAPIUsers[User, int](get_user_manager, [auth_backend])