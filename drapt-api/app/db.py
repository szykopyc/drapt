from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase
from dotenv import load_dotenv
import os

# sets up the database and returns an async session

load_dotenv()
DATABASE_URL_FROM_SECRETS = os.getenv("POSTGRESQL_URL")
DATABASE_URL = f"{DATABASE_URL_FROM_SECRETS}"

engine = create_async_engine(DATABASE_URL, echo=False)
async_session_maker = async_sessionmaker(engine, expire_on_commit=False)

class Base(DeclarativeBase):
    pass

# Dependency for FastAPI to get an async session
async def get_async_session():
    async with async_session_maker() as session:
        yield session
