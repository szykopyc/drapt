# portfolio imports
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.future import select # type: ignore
from sqlalchemy.exc import IntegrityError # type: ignore # this is for when a unique key is violated
from sqlalchemy import update, and_ # type: ignore

# db imports
from app.db import get_async_session

# models and schemas
from app.models.portfolio import Portfolio
from app.schemas.portfolio import PortfolioCreate, PortfolioRead, PortfolioUpdate, PortfolioReadOverview

# auth and permission imports
from app.models.user import User
from app.users.deps import fastapi_users
from app.config.permissions import permissions as role_permissions

# adding a portfolio ID to the PM after initialisation of portfolio logic
from app.utils.portfolio_assignment import assign_user_to_portfolio

# logging functionality
from app.utils.log import logger

# for grouping members and other things into dicts with a portfolio id
from collections import defaultdict

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
        
    except IntegrityError as e:
        print(e)
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Portfolio string ID already exists"
        )

    logger.info(f"({current_user.username}) initialised portfolio ID: {portfolio.id} / STRING ID: {portfolio.portfolio_string_id} / PM: {pm_id_assignment_result.username}")
    return PortfolioRead.model_validate(portfolio)

# READ PORTFOLIO ROUTE
@router.get("/portfolio/search/{portfolio_string_id}", response_model=PortfolioRead, tags=["portfolio"])
async def get_portfolio_by_string_id(
    portfolio_string_id: str,
    session=Depends(get_async_session),
    current_user: User = Depends(fastapi_users.current_user())
):
    role_perms = role_permissions.get(current_user.role)
    if not role_perms or not role_perms.get("can_search_portfolio"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You aren't authorised to search portfolios.")
    
    searched_portfolio_result = await session.execute(select(Portfolio).where(Portfolio.portfolio_string_id == portfolio_string_id))
    searched_portfolio = searched_portfolio_result.scalar_one_or_none()

    # if user doesn't have can_init_portfolio or isnt assigned to the portfolio (via portfolio_id) raise exception
    if not (role_perms.get("can_init_portfolio") or current_user.portfolio_id == searched_portfolio.id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You aren't authorised to view this portfolio.")
    
    if not searched_portfolio:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="We couldn't find the portfolio you requested.")
    
    return PortfolioRead.model_validate(searched_portfolio)

# OVERVIEW subroute will give a bigger picture of what it is, an overview
@router.get("/portfolio/search/{portfolio_string_id}/overview", response_model=PortfolioReadOverview, tags=["portfolio"])
async def get_portfolio_by_string_id_overview(
    portfolio_string_id: str,
    session=Depends(get_async_session),
    current_user: User = Depends(fastapi_users.current_user())
):
    role_perms = role_permissions.get(current_user.role)
    if not role_perms or not role_perms.get("can_search_portfolio"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You aren't authorised to search portfolios.")

    searched_portfolio_result = await session.execute(select(Portfolio).where(Portfolio.portfolio_string_id == portfolio_string_id))
    searched_portfolio = searched_portfolio_result.scalar_one_or_none()

    if not searched_portfolio:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="We couldn't find the portfolio you requested.")

    members_result = await session.execute(select(User).where(User.portfolio_id == searched_portfolio.id))
    members = members_result.scalars().all()

    # if user doesn't have can_init_portfolio or isnt assigned to the portfolio (via portfolio_id) raise exception
    if not (role_perms.get("can_init_portfolio") or current_user.portfolio_id == searched_portfolio.id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You aren't authorised to view this portfolio.")
    
    portfolio_read_data = PortfolioReadOverview.model_validate(searched_portfolio)
    portfolio_read_data.members = members
    return portfolio_read_data

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
    
    if not (role_perms.get("can_init_portfolio") or current_user.portfolio_id == fetched_portfolio.id):
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

# fetch all portfolios
@router.get("/portfolio/all", response_model=list[PortfolioReadOverview], tags=["portfolio"])
async def get_all_portfolios(
    session=Depends(get_async_session), current_user: User = Depends(fastapi_users.current_user())
):
    role_perms = role_permissions.get(current_user.role)
    if not role_perms or not role_perms.get("can_init_portfolio"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only executives can search all portfolios."
        )
    # Fetch all portfolios
    allPortfoliosResult = await session.execute(select(Portfolio))
    portfolios = allPortfoliosResult.scalars().all()

    if not portfolios:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Could not find any portfolios")

    # Fetch all PMs who are assigned to a portfolio
    allPmsResult = await session.execute(select(User).where(and_(User.portfolio_id != None ,User.role == "pm")))
    pms = allPmsResult.scalars().all()

    pms_by_portfolio = defaultdict(list)
    for pm in pms:
        pms_by_portfolio[pm.portfolio_id].append(pm)

    # Attach pms to each portfolio
    result = []
    for portfolio in portfolios:
        portfolio_data = PortfolioReadOverview.model_validate(portfolio)
        portfolio_data.members = pms_by_portfolio.get(portfolio.id, [])
        result.append(portfolio_data)

    return result
