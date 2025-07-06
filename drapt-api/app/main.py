from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.api.routes.admin import router as admin_router
from app.api.routes.auth import router as auth_router
from app.api.routes.users import router as user_router
from app.api.routes.portfolio import router as portfolio_router
from app.users.auth import auth_backend
from app.users.manager import get_user_manager
from fastapi_users import FastAPIUsers
from app.models.user import User
from app.models.portfolio import Portfolio
from app.schemas.user import UserRead, UserCreate, UserUpdate
from app.db import engine, Base
from fastapi.middleware.cors import CORSMiddleware
from app.users.deps import fastapi_users

# inspirational quote lib lol
import inspirational_quotes

# creates db if it doesn't exist
@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield

app = FastAPI(title="Drapt Backend", lifespan=lifespan)

# Add CORS middleware (where the backend should allow requests from)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://192.168.0.21:5173"],  # frontend origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# setting up routes from other files
app.include_router(fastapi_users.get_auth_router(auth_backend), prefix="/auth/jwt", tags=["auth"])
app.include_router(auth_router)
app.include_router(admin_router)
app.include_router(user_router)
app.include_router(portfolio_router)

@app.get("/")
async def root():
    return {"message": "Drapt backend running"}

# inspirational quote
@app.get("/inspiration")
async def inspirational_quote():
    quote = inspirational_quotes.quote()
    return quote