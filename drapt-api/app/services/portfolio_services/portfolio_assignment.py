from sqlalchemy.future import select
from app.models.user import User
from fastapi import HTTPException, Depends, status
from app.db import get_async_session

async def assign_user_to_portfolio(user_id: int, portfolio_id: int, session=Depends(get_async_session)):
    result = await session.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")
    user.portfolio_id = portfolio_id
    await session.commit()
    await session.refresh(user)
    return user

async def unassign_user_from_portfolio(user_id: int, session=Depends(get_async_session)):
    result = await session.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")
    user.portfolio_id = None
    await session.commit()
    await session.refresh(user)
    return user