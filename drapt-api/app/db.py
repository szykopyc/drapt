from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase

# sets up the database and returns an async session

DATABASE_URL = "sqlite+aiosqlite:///./drapt.db"

engine = create_async_engine(DATABASE_URL, echo=False)
async_session_maker = async_sessionmaker(engine, expire_on_commit=False)

class Base(DeclarativeBase):
    pass

# Dependency for FastAPI to get an async session
async def get_async_session():
    async with async_session_maker() as session:
        yield session
