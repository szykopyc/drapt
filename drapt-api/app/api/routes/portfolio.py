# portfolio imports
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.future import select
from sqlalchemy.exc import IntegrityError # this is for when a unique key is violated
from sqlalchemy import update

# db imports
from app.db import get_async_session

# models and schemas
from app.models.portfolio import Portfolio
from app.schemas.portfolio import PortfolioCreate, PortfolioRead, PortfolioUpdate

# auth and permission imports
from app.models.user import User
from app.users.deps import fastapi_users
from app.config.permissions import permissions as role_permissions

# adding a portfolio ID to the PM after initialisation of portfolio logic
from app.utils.portfolio_assignment import assign_user_to_portfolio

# logging functionality
from app.utils.log import logger

router = APIRouter()

# CREATE PORTFOLIO ROUTE
@router.post("/portfolio/create", response_model=PortfolioRead, tags=["portfolio"])
async def create_portfolio(
    data: PortfolioCreate,
    current_user: User = Depends(fastapi_users.current_user()),
    session=Depends(get_async_session)
):
    role_perms = role_permissions.get(current_user.role)
    if not role_perms or not role_perms.get("can_init_portfolio"):
        logger.warning(f"({current_user.username}) tried to initialise portfolio (disallowed)")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only executives can initialise portfolios."
        )

    # Convert Pydantic schema to SQLAlchemy mode
    portfolio = Portfolio(portfolio_string_id=data.portfolio_string_id, name=data.name, description=data.description)
    try:
        session.add(portfolio)
        await session.commit()
        await session.refresh(portfolio)
        pm_id_assignment_result = await assign_user_to_portfolio(data.pm_id, portfolio.id, session)
        
    except IntegrityError:
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Portfolio string ID already exists"
        )

    logger.info(f"({current_user.username}) initialised portfolio ID: {portfolio.id} / STRING ID: {portfolio.portfolio_string_id} / PM: {pm_id_assignment_result.username}")
    return portfolio

# UPDATE PORTFOLIO ROUTE
@router.patch("/portfolio/update/{portfolio_id}", response_model=PortfolioRead, tags=["portfolio"])
async def update_portfolio_by_id(
    portfolio_id: int,
    portfolio_update: PortfolioUpdate,
    session=Depends(get_async_session),
    current_user: User = Depends(fastapi_users.current_user())
):
    role_perms = role_permissions.get(current_user.role)
    if not role_perms or not role_perms.get("can_manage_portfolio"):
        logger.warning(f"({current_user.username}) tried to update portfolio PORTFOLIO ID: {portfolio_id}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Unauthorised to update portfolios."
        )
    
    fetch_portfolio_result = await session.execute(select(Portfolio).where(Portfolio.id == portfolio_id))
    fetched_portfolio = fetch_portfolio_result.scalar_one_or_none()

    if not fetched_portfolio:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Unable to find requested portfolio")
    
    if not (role_perms.get("can_init_portfolio") or current_user.team == fetched_portfolio.portfolio_string_id):
        logger.warning(f"({current_user.username}) tried to update different unassigned portfolio PORTFOLIO ID: {portfolio_id} / PORTFOLIO STRING ID: {fetched_portfolio.portfolio_string_id}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Unauthorised to update portfolios."
        )
    
    for field, value in portfolio_update.model_dump(exclude_unset=True).items():
        setattr(fetched_portfolio, field, value)

    await session.commit()
    await session.refresh(fetched_portfolio)
    changed_fields = ", ".join(portfolio_update.model_dump(exclude_unset=True).keys())
    logger.info(f"({current_user.username}) updated portfolio PORTFOLIO ID: {fetched_portfolio.id} / PORTFOLIO STRING ID: {fetched_portfolio.portfolio_string_id} / ATTRIBUTES: {changed_fields}")
    return PortfolioRead.model_validate(fetched_portfolio)

# DELETE PORTFOLIO ROUTE
@router.delete("/portfolio/delete/{portfolio_id}", response_model=PortfolioRead, tags=["portfolio"])
async def delete_portfolio_by_id(
    portfolio_id: int,
    session=Depends(get_async_session),
    current_user: User = Depends(fastapi_users.current_user())
):
    role_perms = role_permissions.get(current_user.role)
    if not role_perms or not role_perms.get("can_init_portfolio"):
        logger.warning(f"({current_user.username}) tried to delete portfolio PORTFOLIO ID: {portfolio_id} (disallowed)")
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only executives can delete portfolios.")
    
    result = await session.execute(select(Portfolio).where(Portfolio.id == portfolio_id))
    portfolio = result.scalar_one_or_none()

    # this unassigns all users associated with that portfolio
    log_if_unassign = False
    try:
        await session.execute(
            update(User).where(User.portfolio_id == portfolio.id).values(portfolio_id=None)
        )
        log_if_unassign = True
    except:
        pass

    if not portfolio:
        raise HTTPException(status_code=404, detail="The portfolio that you requested to delete was not found.")
    
    await session.delete(portfolio)
    await session.commit()

    logger.info(f"({current_user.username}) deleted portfolio ID: {portfolio.id} / STRING ID: {portfolio.portfolio_string_id}")
    if (log_if_unassign):
        logger.info(f"(Server) unassigned all users from portfolio ID: {portfolio.id} / STRING ID: {portfolio.portfolio_string_id}")

    return PortfolioRead.model_validate(portfolio)

@router.get("/portfolio/all", response_model=list[PortfolioRead], tags=["portfolio"])
async def get_all_portfolios(
    session=Depends(get_async_session), current_user: User = Depends(fastapi_users.current_user())
):
    role_perms = role_permissions.get(current_user.role)
    if not role_perms or not role_perms.get("can_init_portfolio"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only executives can search all portfolios."
        )
    allPortfoliosResult = await session.execute(select(Portfolio))
    portfolios = allPortfoliosResult.scalars().all()

    if not portfolios:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Could not find any portfolios")
    return [PortfolioRead.model_validate(portfolio) for portfolio in portfolios]

# add search for a portfolio given a team or portfolio string ID