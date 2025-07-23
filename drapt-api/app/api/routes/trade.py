# fastapi and db imports

from fastapi import APIRouter, Depends, HTTPException, status # type: ignore
from sqlalchemy.future import select
from app.db import get_async_session

# models, schemas and enum
from app.models.trade import Trade
from app.schemas.trade import TradeCreate, TradeRead

# auth and permissions
from app.models.user import User
from app.users.deps import fastapi_users
from app.config.permissions import permission_check_util

# logging functionality
from app.utils.log import trade_logger as logger

# trade tradeservice
from app.services.trade_services.trade_service import TradeService
from app.services.position_services.position_service import PositionService

router = APIRouter()

# CREATE TRADE ROUTE
# this does allow shorting. warnings for going short will be visible on the frontend, yes. but you can go short if you wanna

@router.post("/trades", response_model=TradeRead, tags=["trade"])
async def book_trade(
    trade: TradeCreate,
    current_user: User = Depends(fastapi_users.current_user()),
    session = Depends(get_async_session)
):
    if not permission_check_util(current_user, "can_book_trades"):
        logger.warning(f"({current_user.username}) tried to book trade (disallowed)")
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only PMs+ can book trades.")

    if not (permission_check_util(current_user, "developer") or current_user.portfolio_id == trade.portfolio_id):
        logger.warning(f"({current_user.username}) tried to book a trade on a different portfolio PORTFOLIO ID: {trade.portfolio_id}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Unauthorised to book trades on this portfolio."
        )

    TradeServiceObject = TradeService(session)
    PositionServiceObject = PositionService(session)

    try:
        trade_obj = await TradeServiceObject._book_trade(trade, current_user, logger)

        if trade_obj:
            await PositionServiceObject._handle_trade(trade_obj)
            await session.commit() ## commit all db changes.
            #this is only for now until the trade orchestrator is set up

    except Exception:
        await session.rollback()
        logger.error(f"(Server) Position creation failed for trade {trade.ticker}/{trade.portfolio_id}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to create position for trade.")


    return TradeRead.model_validate(trade_obj)

# get trades by portfolio id
@router.get("/portfolios/{portfolio_id}/trades", response_model=list[TradeRead], tags=["trade"])
async def get_trade_by_portfolio_id(
    portfolio_id: int,
    session=Depends(get_async_session),
    current_user: User = Depends(fastapi_users.current_user())
):
    if not permission_check_util(current_user,"can_search_trades"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You aren't authorised to search trades.")
    
    TradeServiceObject = TradeService(session)
    
    # if user doesn't have can_init_portfolio or isnt assigned to the portfolio (via portfolio_id) raise exception
    if not (permission_check_util(current_user, "developer") or current_user.portfolio_id == portfolio_id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Unauthorised to view this portfolio's trades.")
    
    return await TradeServiceObject._get_trades_by_portfolio_id(portfolio_id)


# development only service, DELETE IN PROD #############
@router.delete("/trades/{portfolio_id}", tags=["trade"])
async def delete_trade_by_portfolio_id(
        portfolio_id: int,
        session = Depends(get_async_session),
        current_user: User = Depends(fastapi_users.current_user())
):
    if not permission_check_util(current_user, "can_delete_trades"):
        logger.warning(f"({current_user.username}) tried to delete trades from PORTFOLIO ID: {portfolio_id} (disallowed)")
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only developer can delete trades.")
    
    result = await session.execute(select(Trade).where(Trade.portfolio_id == portfolio_id))
    trades = result.scalars().all()

    if not trades:
        raise HTTPException(status_code=404, detail="The trades that you requested to delete was not found.")
    
    for trade in trades:
        await session.delete(trade)
    
    await session.commit()

    logger.info(f"({current_user.username}) deleted trades for portfolio ID: {portfolio_id}")
    return {"message":"All trades deleted"}
