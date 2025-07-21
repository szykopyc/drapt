from fastapi_users.authentication import CookieTransport, JWTStrategy, AuthenticationBackend
import os
from dotenv import load_dotenv

load_dotenv()
SECRET = os.getenv("FASTAPIUSERS_SECRET_KEY")

# this is the authentication bit. it is concerned with providing a cookie transport (HTTP only) as well as the strategy (JWT)

cookie_transport = CookieTransport(cookie_name="auth", cookie_max_age=3600, cookie_secure=False, cookie_httponly=True, cookie_samesite="lax")

def get_jwt_strategy() -> JWTStrategy:
    return JWTStrategy(secret=SECRET, lifetime_seconds=3600)

auth_backend = AuthenticationBackend(
    name="jwt",
    transport=cookie_transport,
    get_strategy=get_jwt_strategy,
)