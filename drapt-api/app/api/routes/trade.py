# fastapi and db imports

from fastapi import APIRouter, Depends, HTTPException, status # type: ignore
from sqlalchemy.future import select # type: ignore
from sqlalchemy.exc import IntegrityError # type: ignore
from sqlalchemy import update, and_ # type: ignore
from app.db import get_async_session

# models, schemas and enum
from app.models.trade import Trade
from app.schemas.trade import TradeCreate, TradeRead
from app.enums.trade import TradeTypeEnum, CurrencyEnum

# auth and permissions
from app.models.user import User
from app.users.deps import fastapi_users
from app.config.permissions import permissions as role_permissions_dict

# logging functionality
from app.utils.log import trade_logger as logger

router = APIRouter()

# CREATE TRADE ROUTE
# this does allow shorting. warnings for going short will be visible on the frontend, yes. but you can go short if you wanna

@router.post("/trade", response_model=TradeRead, tags=["trade"])
async def book_trade(
    trade: TradeCreate,
    current_user: User = Depends(fastapi_users.current_user()),
    session = Depends(get_async_session)
):
    role_perms = role_permissions_dict.get(current_user.role)
    if not role_perms or not role_perms.get("can_book_trades"):
        logger.warning(f"({current_user.username}) tried to book trade (disallowed)")
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only PMs+ can book trades.")

    if not (role_perms.get("developer") or current_user.portfolio_id == trade.portfolio_id):
        logger.warning(f"({current_user.username}) tried to book a trade on a different portfolio PORTFOLIO ID: {trade.portfolio_id}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Unauthorised to book trades on this portfolio."
        )

    tradeToExecute = None

    ### ADD DATE CANNOT BE PLACED ON WEEKENDS/MORE THAN A WEEK IN THE PAST VALIDATION AT SOME POINT
    try:
        tradeToExecute = Trade(
            portfolio_id=trade.portfolio_id,
            ticker = trade.ticker.upper(),
            exchange = trade.exchange.upper(),
            price = trade.price,
            direction = trade.direction,
            quantity = trade.quantity,
            execution_date=trade.execution_date,
            venue = trade.venue,
            trader_id = current_user.id,
            analyst_id = trade.analyst_id,
            notes = trade.notes,
            currency=trade.currency,
            notional = trade.quantity * trade.price
        )
        session.add(tradeToExecute)
        await session.commit()
        await session.refresh(tradeToExecute)

    except Exception as e:
        logger.error(f"(Server) Error Occurred while creating trade: {e}")
        await session.rollback()

    logger.info(f"({current_user.username}) created trade TICKER: {trade.ticker} / DATE: {trade.execution_date}")

    return TradeRead.model_validate(tradeToExecute)

# get trades by portfolio id
@router.get("/trade/{portfolio_id}/getbyportfolioid", response_model=list[TradeRead], tags=["trade"])
async def get_trade_by_portfolio_id(
    portfolio_id: int,
    session=Depends(get_async_session),
    current_user: User = Depends(fastapi_users.current_user())
):
    role_perms = role_permissions_dict.get(current_user.role)
    if not role_perms or not role_perms.get("can_search_trades"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You aren't authorised to search trades.")
    
    searched_trades_result = await session.execute(select(Trade).where(Trade.portfolio_id == portfolio_id))
    searched_trades = searched_trades_result.scalars().all()

    # if user doesn't have can_init_portfolio or isnt assigned to the portfolio (via portfolio_id) raise exception
    if not (role_perms.get("developer") or current_user.portfolio_id == portfolio_id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Unauthorised to view this portfolio's trades.")
    
    if not searched_trades:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="We couldn't find any trades for your portfolio.")
    
    return [TradeRead.model_validate(trade) for trade in searched_trades]
