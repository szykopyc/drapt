from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.api.routes import router
from app.users.auth import auth_backend
from app.users.manager import get_user_manager
from fastapi_users import FastAPIUsers
from app.models.user import User
from app.schemas.user import UserRead, UserCreate, UserUpdate
from app.db import engine, Base
from fastapi.middleware.cors import CORSMiddleware

@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield

app = FastAPI(title="Drapt Backend", lifespan=lifespan)

# Add CORS middleware here
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://192.168.0.21:5173"],  # frontend origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

fastapi_users = FastAPIUsers[User, int](get_user_manager, [auth_backend])

app.include_router(fastapi_users.get_auth_router(auth_backend), prefix="/auth/jwt", tags=["auth"])
app.include_router(fastapi_users.get_users_router(UserRead, UserUpdate), prefix="/users", tags=["users"])
app.include_router(router)

@app.get("/")
async def root():
    return {"message": "Drapt backend running"}