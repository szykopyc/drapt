# portfolio imports
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.future import select
from sqlalchemy.exc import IntegrityError # this is for when a unique key is violated

# db imports
from app.db import get_async_session

# models and schemas
from app.models.portfolio import Portfolio
from app.schemas.portfolio import PortfolioCreate, PortfolioRead, PortfolioUpdate
from app.schemas.user import UserUpdate

# auth and permission imports
from app.models.user import User
from app.users.deps import fastapi_users
from app.config.permissions import permissions as role_permissions

# adding a portfolio ID to the PM after initialisation of portfolio logic
from app.utils.assign_user_to_portfolio import assign_user_to_portfolio

router = APIRouter()

@router.post("/portfolio/create", response_model=PortfolioRead, tags=["portfolio"])
async def create_portfolio(
    data: PortfolioCreate,
    current_user: User = Depends(fastapi_users.current_user()),
    session=Depends(get_async_session)
):
    role_perms = role_permissions.get(current_user.role)
    if not role_perms or not role_perms.get("can_init_portfolio"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="403: Only executives can initialise portfolios."
        )

    # Convert Pydantic schema to SQLAlchemy mode
    portfolio = Portfolio(portfolio_string_id=data.portfolio_string_id, name=data.name, description=data.description)
    try:
        session.add(portfolio)
        await session.commit()
        await session.refresh(portfolio)
        await assign_user_to_portfolio(data.pm_id, portfolio.id, session)
        
    except IntegrityError:
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="400: Portfolio string ID already exists"
        )

    return portfolio

@router.get("/portfolio/all", response_model=list[PortfolioRead], tags=["portfolio"])
async def get_all_portfolios(
    session=Depends(get_async_session), current_user: User = Depends(fastapi_users.current_user())
):
    role_perms = role_permissions.get(current_user.role)
    if not role_perms or not role_perms.get("can_init_portfolio"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="403: Only executives can search all portfolios."
        )
    allPortfoliosResult = await session.execute(select(Portfolio))
    portfolios = allPortfoliosResult.scalars().all()

    if not portfolios:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="404: Could not find any portfolios")
    return [PortfolioRead.model_validate(portfolio) for portfolio in portfolios]

# add search for a portfolio given a team or portfolio string ID