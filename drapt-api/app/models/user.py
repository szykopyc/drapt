from fastapi_users_db_sqlalchemy import SQLAlchemyBaseUserTable
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Integer, String
from app.db import Base

class User(SQLAlchemyBaseUserTable[int], Base):
    id: Mapped[int] = mapped_column(Integer, primary_key=True) # type: ignore[override]
    fullname: Mapped[str] = mapped_column(String(length=100), nullable=False)
    username: Mapped[str] = mapped_column(String(length=50), nullable=False, unique=True)
    role: Mapped[str] = mapped_column(String(length=20), nullable=False)
    team: Mapped[str] = mapped_column(String(length=50), nullable=False)