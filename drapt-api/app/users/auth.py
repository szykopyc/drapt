from fastapi_users.authentication import CookieTransport, JWTStrategy, AuthenticationBackend

SECRET = "SUPER_SECRET"  # use env vars in prod

cookie_transport = CookieTransport(cookie_name="auth", cookie_max_age=3600, cookie_secure=False, cookie_httponly=True, cookie_samesite="lax")

def get_jwt_strategy() -> JWTStrategy:
    return JWTStrategy(secret=SECRET, lifetime_seconds=3600)

auth_backend = AuthenticationBackend(
    name="jwt",
    transport=cookie_transport,
    get_strategy=get_jwt_strategy,
)