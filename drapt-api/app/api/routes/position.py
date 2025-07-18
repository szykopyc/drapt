# db
from fastapi import APIRouter, Depends, HTTPException, status
from app.db import get_async_session

# models and schemas
from app.schemas.position import PositionRead

# permissions and auth
from app.config.permissions import permission_check_util
from app.users.deps import fastapi_users
from app.models.user import User

# logging funcs
from app.utils.log import position_logger as logger

# services
from app.services.position_services.position_service import PositionService

router = APIRouter()

@router.get("/positions/getopenpositions/{portfolio_id}", response_model=list[PositionRead], tags=["position"])
async def get_open_positions_with_portfolio_id(
    portfolio_id: int,
    current_user: User = Depends(fastapi_users.current_user()),
    session = Depends(get_async_session)
):
    if not (permission_check_util(current_user, "can_fetch_all_positions") or current_user.portfolio_id == portfolio_id):
        logger.warning(f"({current_user.username}) tried to fetch all positions (disallowed)")
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Unauthorised to view positions for this portfolio.")

    PositionServiceObject = PositionService(session)

    return await PositionServiceObject._get_open_position_with_portfolio(portfolio_id)


@router.get("/positions/getclosedpositions/{portfolio_id}", response_model=list[PositionRead], tags=["position"])
async def get_closed_positions_with_portfolio_id(
    portfolio_id: int,
    current_user: User = Depends(fastapi_users.current_user()),
    session = Depends(get_async_session)
):
    if not (permission_check_util(current_user, "can_fetch_all_positions") or current_user.portfolio_id == portfolio_id):
        logger.warning(f"({current_user.username}) tried to fetch all positions (disallowed)")
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Unauthorised to view positions.")

    PositionServiceObject = PositionService(session)

    return await PositionServiceObject._get_closed_position_with_portfolio(portfolio_id)
