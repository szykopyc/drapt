from fastapi_users_db_sqlalchemy import SQLAlchemyBaseUserTable
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Integer, String, ForeignKey
from app.db import Base
from typing import Optional

class User(SQLAlchemyBaseUserTable[int], Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True) # type: ignore[override]
    fullname: Mapped[str] = mapped_column(String(length=100), nullable=False)
    username: Mapped[str] = mapped_column(String(length=50), nullable=False, unique=True)
    role: Mapped[str] = mapped_column(String(length=20), nullable=False)
    team: Mapped[str] = mapped_column(String(length=50), nullable=False)
    portfolio_id: Mapped[Optional[int]] = mapped_column(ForeignKey("portfolios.id"), nullable=True) # optional portfolio ID, maps the user to a portfolio. handle this on creation/update

    def __repr__(self) -> str:
        return (
            f"<User id={self.id} username={self.username} fullname={self.fullname} "
            f"role={self.role} team={self.team} portfolio_id={self.portfolio_id}>"
        )