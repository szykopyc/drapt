import pytest
from decimal import Decimal
from datetime import datetime
import asyncio
from fastapi_users.password import PasswordHelper
from app.models.trade import Trade
from app.models.portfolio import Portfolio
from app.models.user import User
from app.enums.trade import TradeTypeEnum
from app.enums.trade_orchestrator import TradeIntentionEnum
from app.services.position_services.position_service import PositionService
from app.services.trade_services.trade_service import TradeService
from app.services.cash_services.cash_service import CashService
from app.schemas.position import PositionRead

from app.tests.pretty_prints_for_testing_purposes import terminalcolours, pretty_print_position, print_test_end_banner

from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from app.db import Base

password_helper = PasswordHelper()

TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"
test_engine = create_async_engine(TEST_DATABASE_URL, echo=False)
async_session = async_sessionmaker(bind=test_engine)


@pytest.mark.asyncio
async def test_partial_close_short_position():
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session() as session:
        print(f"{terminalcolours.OKGREEN}🚀 Running: {__name__} - Partial Close Short Position Test {terminalcolours.ENDC}\n")

        # Initialise services
        print(f"{terminalcolours.OKCYAN}Initialising services...{terminalcolours.ENDC}")
        position_service = PositionService(session)
        trade_service = TradeService(session)
        cash_service = CashService(session)
        print(f"{terminalcolours.OKGREEN}Services initialised successfully.{terminalcolours.ENDC}\n")

        # Create a user
        print(f"{terminalcolours.OKCYAN}Creating user...{terminalcolours.ENDC}")
        test_user = User(
            id=1,
            email="test@outlook.com",
            hashed_password=password_helper.hash("test123456"),
            fullname="Test User",
            username="test_user",
            role="portfolio_manager",
            team="industrial",
            is_active=True,
            is_superuser=True,
            is_verified=True,
        )
        print(f"{terminalcolours.OKGREEN}User created: {test_user}{terminalcolours.ENDC}\n")

        # Create a portfolio
        print(f"{terminalcolours.OKCYAN}Creating portfolio...{terminalcolours.ENDC}")
        test_portfolio = Portfolio(
            id=1,
            portfolio_string_id="industrial",
            name="Industrial Portfolio",
            created_at=datetime.now(),
            initial_cash=Decimal("1000"),
            currency="USD"
        )
        session.add(test_portfolio)
        await session.flush()
        await session.refresh(test_portfolio)
        print(f"{terminalcolours.OKGREEN}Portfolio created: {test_portfolio}{terminalcolours.ENDC}\n")

        # Record initial portfolio cash
        print(f"{terminalcolours.OKCYAN}Recording initial portfolio cash...{terminalcolours.ENDC}")
        await cash_service._record_initial_portfolio_cash(test_portfolio)
        initial_cash_balance = await cash_service._get_portfolio_cash_balance(test_portfolio.id)
        print(f"{terminalcolours.OKGREEN}Initial portfolio cash balance: {initial_cash_balance}{terminalcolours.ENDC}\n")

        # Create a short trade
        print(f"{terminalcolours.OKCYAN}Creating a short trade...{terminalcolours.ENDC}")
        short_trade = Trade(
            portfolio_id=test_portfolio.id,
            ticker="AVAV",
            exchange="NDQ",
            direction=TradeTypeEnum.SELL,
            currency="USD",
            price=Decimal("10"),
            quantity=Decimal("10"),
            notional=Decimal("100"),
            execution_date=datetime.now(),
            venue="T212",
            trader_id=test_user.id,
            analyst_id=test_user.id
        )
        print(f"{terminalcolours.OKGREEN}Short trade created: {short_trade}{terminalcolours.ENDC}\n")

        # Book the trade
        print(f"{terminalcolours.OKCYAN}Booking the short trade...{terminalcolours.ENDC}")
        booked_short_trade = await trade_service._book_trade(short_trade, test_user)
        print(f"{terminalcolours.OKGREEN}Trade booked: {booked_short_trade}{terminalcolours.ENDC}\n")

        # Handle the trade
        if booked_short_trade:
            print(f"{terminalcolours.OKCYAN}Handling the short trade in PositionService...{terminalcolours.ENDC}")
            short_trade_result = await position_service._handle_trade(booked_short_trade)
            print(f"{terminalcolours.OKGREEN}Result from _handle_trade (CREATE): {short_trade_result}{terminalcolours.ENDC}\n")

        # Create a partial close trade
        print(f"{terminalcolours.OKCYAN}Creating a partial close trade...{terminalcolours.ENDC}")
        partial_close_trade = Trade(
            portfolio_id=test_portfolio.id,
            ticker="AVAV",
            exchange="NDQ",
            direction=TradeTypeEnum.BUY,
            currency="USD",
            price=Decimal("12"),
            quantity=Decimal("5"),  # Partial close by 5
            notional=Decimal("60"),
            execution_date=datetime.now(),
            venue="T212",
            trader_id=test_user.id,
            analyst_id=test_user.id
        )
        print(f"{terminalcolours.OKGREEN}Partial close trade created: {partial_close_trade}{terminalcolours.ENDC}\n")

        # Book and handle the partial close trade
        print(f"{terminalcolours.OKCYAN}Booking the partial close trade...{terminalcolours.ENDC}")
        booked_partial_close_trade = await trade_service._book_trade(partial_close_trade, test_user)
        print(f"{terminalcolours.OKGREEN}Partial close trade booked: {booked_partial_close_trade}{terminalcolours.ENDC}\n")

        if booked_partial_close_trade:
            print(f"{terminalcolours.OKCYAN}Handling the partial close trade in PositionService...{terminalcolours.ENDC}")
            partial_close_trade_result = await position_service._handle_trade(booked_partial_close_trade)
            print(f"{terminalcolours.OKGREEN}Result from _handle_trade (PARTIALCLOSE): {partial_close_trade_result}{terminalcolours.ENDC}\n")

        # Assertions for partial close
        print(f"{terminalcolours.OKCYAN}Fetching the updated open position...{terminalcolours.ENDC}")
        updated_open_position = await position_service._get_open_position_with_ticker(portfolio_id=test_portfolio.id, ticker="AVAV")
        print(f"{terminalcolours.OKGREEN}Updated open position fetched: {updated_open_position}{terminalcolours.ENDC}\n")
        assert updated_open_position is not None
        assert updated_open_position.open_quantity == Decimal("5")  # Remaining 5 after partial close
        assert updated_open_position.average_entry_price == Decimal("10")  # Entry price remains the same

        print_test_end_banner(f"{terminalcolours.OKGREEN}{__name__} TEST ENDED{terminalcolours.ENDC}\n")