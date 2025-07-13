# core imports
from fastapi import FastAPI

# databse import
from app.db import engine, Base
from contextlib import asynccontextmanager

# route import
from app.api.routes.admin import router as admin_router
from app.api.routes.auth import router as auth_router
from app.api.routes.portfolio import router as portfolio_router
from app.api.routes.trade import router as trade_router

# fastapi_users required imports
from app.users.auth import auth_backend
from fastapi.middleware.cors import CORSMiddleware # CORS middleware
from app.users.deps import fastapi_users

# inspirational quote lib lol
import inspirational_quotes

# imports logger
from app.utils.log import general_logger as logger

# initialises asynccontext with a lifespan as long as the app is running
@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield

# sets up the FastAPI app
app = FastAPI(title="Drapt Backend", lifespan=lifespan)

logger.info("(Server) Started Backend Dev")

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
app.include_router(portfolio_router)
app.include_router(trade_router)

# root, good query to test if the backend is running.
@app.get("/")
async def root():
    return {"message": "Drapt backend running"}

# inspirational quote
@app.get("/inspiration")
async def inspirational_quote():
    quote = inspirational_quotes.quote()
    return quote
