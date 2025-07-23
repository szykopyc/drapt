import pytest
from decimal import Decimal
from datetime import datetime
from fastapi_users.password import PasswordHelper
from app.models.trade import Trade
from app.models.portfolio import Portfolio
from app.models.user import User
from app.enums.trade import TradeTypeEnum
from app.enums.trade_orchestrator import TradeIntentionEnum
from app.services.position_services.position_service import PositionService
from app.services.trade_services.trade_service import TradeService
from app.services.cash_services.cash_service import CashService
from app.redis_client import cache_get
from app.tests.pretty_prints_for_testing_purposes import terminalcolours, print_test_end_banner

from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from app.db import Base

password_helper = PasswordHelper()

TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"
test_engine = create_async_engine(TEST_DATABASE_URL, echo=False)
async_session = async_sessionmaker(bind=test_engine)

@pytest.mark.asyncio
async def test_multicurrency_position_lifecycle():
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session() as session:
        print(f"{terminalcolours.OKGREEN}🚀 Running: {__name__} - Multicurrency Portfolio/Position Test {terminalcolours.ENDC}")

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
        print(f"{terminalcolours.OKCYAN}Creating portfolio base currency EUR...{terminalcolours.ENDC}")
        test_portfolio = Portfolio(
            id=1,
            portfolio_string_id="industrial",
            name="Industrial Portfolio",
            created_at=datetime.now(),
            initial_cash=Decimal("1000"),
            currency="EUR"
        )
        session.add(test_portfolio)
        await session.flush()
        await session.refresh(test_portfolio)
        print(f"{terminalcolours.OKGREEN}Portfolio created: {test_portfolio}{terminalcolours.ENDC}\n")

        # Record initial portfolio cash
        print(f"{terminalcolours.OKCYAN}Recording initial portfolio cash...{terminalcolours.ENDC}")
        await cash_service._record_initial_portfolio_cash(test_portfolio)
        initial_cash_balance = await cash_service._get_portfolio_balance_all_currency(test_portfolio.id)
        print(f"{terminalcolours.OKGREEN}Initial portfolio cash balance: {initial_cash_balance}{terminalcolours.ENDC}\n")
        assert initial_cash_balance["EUR"] == Decimal("1000.000000")

        # Create a long trade
        print(f"{terminalcolours.OKCYAN}Creating a long trade...{terminalcolours.ENDC}")
        long_trade = Trade(
            portfolio_id=test_portfolio.id,
            ticker="AVAV",
            exchange="NDQ",
            direction=TradeTypeEnum.BUY,
            currency="USD",
            price=Decimal("10"),
            quantity=Decimal("10"),
            notional=Decimal("100"),
            execution_date=datetime.now(),
            venue="T212",
            trader_id=test_user.id,
            analyst_id=test_user.id
        )
        print(f"{terminalcolours.OKGREEN}Long trade created: {long_trade}{terminalcolours.ENDC}\n")

        # Book the trade
        print(f"{terminalcolours.OKCYAN}Booking the long trade...{terminalcolours.ENDC}")
        booked_long_trade = await trade_service._book_trade(long_trade, test_user)
        print(f"{terminalcolours.OKGREEN}Trade booked: {booked_long_trade}{terminalcolours.ENDC}\n")

        # Handle the trade
        if booked_long_trade:
            print(f"{terminalcolours.OKCYAN}Handling the long trade in PositionService...{terminalcolours.ENDC}")
            long_trade_result = await position_service._handle_trade(booked_long_trade)
            print(f"{terminalcolours.OKGREEN}Result from _handle_trade (CREATE): {long_trade_result}{terminalcolours.ENDC}\n")

            print(f"{terminalcolours.OKCYAN}Updating cash ledger for the long trade...{terminalcolours.ENDC}")
            for action in long_trade_result:
                await cash_service._cash_cost_from_trade(action["trade"], action["position"])
            print(f"{terminalcolours.OKGREEN}Cash ledger updated for the long trade.{terminalcolours.ENDC}\n")

        # Create an overclose trade
        print(f"{terminalcolours.OKCYAN}Creating an overclose trade...{terminalcolours.ENDC}")
        overclose_trade = Trade(
            portfolio_id=test_portfolio.id,
            ticker="AVAV",
            exchange="NDQ",
            direction=TradeTypeEnum.SELL,
            currency="USD",
            price=Decimal("12"),
            quantity=Decimal("15"),  # Overclose by 5
            notional=Decimal("180"),
            execution_date=datetime.now(),
            venue="T212",
            trader_id=test_user.id,
            analyst_id=test_user.id
        )
        print(f"{terminalcolours.OKGREEN}Overclose trade created: {overclose_trade}{terminalcolours.ENDC}\n")

        # Book and handle the overclose trade
        print(f"{terminalcolours.OKCYAN}Booking the overclose trade...{terminalcolours.ENDC}")
        booked_overclose_trade = await trade_service._book_trade(overclose_trade, test_user)
        print(f"{terminalcolours.OKGREEN}Overclose trade booked: {booked_overclose_trade}{terminalcolours.ENDC}\n")

        if booked_overclose_trade:
            print(f"{terminalcolours.OKCYAN}Handling the overclose trade in PositionService...{terminalcolours.ENDC}")
            overclose_trade_result = await position_service._handle_trade(booked_overclose_trade)
            print(f"{terminalcolours.OKGREEN}Result from _handle_trade (OVERCLOSE): {overclose_trade_result}{terminalcolours.ENDC}\n")

            print(f"{terminalcolours.OKCYAN}Updating cash ledger for the overclose trade...{terminalcolours.ENDC}")
            for action in overclose_trade_result:
                if action["intent"] == TradeIntentionEnum.CLOSE:
                    await cash_service._realise_position(action["trade"], action["position"])
                elif action["intent"] == TradeIntentionEnum.CREATE:
                    await cash_service._cash_cost_from_trade(action["trade"], action["position"])
                    
            print(f"{terminalcolours.OKGREEN}Cash ledger updated for the overclose trade.{terminalcolours.ENDC}\n")

        # Assertions for cash ledger
        print(f"{terminalcolours.OKCYAN}Fetching the cash ledger...{terminalcolours.ENDC}")
        cash_ledger = await cash_service._get_cash_ledger_by_portfolio(test_portfolio.id)
        print(f"{terminalcolours.OKGREEN}Cash ledger fetched: {cash_ledger}{terminalcolours.ENDC}\n")
        assert len(cash_ledger) == 4  # Initial deposit, long buy, overclose sell
        assert cash_ledger[3].amount == Decimal("60.000000")  # Overclose sell amount

        # final portfolio balance
        print(f"{terminalcolours.OKCYAN}Getting final portfolio balance...{terminalcolours.ENDC}")
        balance = await cash_service._get_portfolio_balance_all_currency(test_portfolio.id)
        print(f"{terminalcolours.OKGREEN}Balance fetched: {balance}{terminalcolours.ENDC}")
        aware_balance = await cash_service._get_portfolio_balance_native(test_portfolio.id)
        print(f"{terminalcolours.OKGREEN}Aware balance fetched: {aware_balance}{terminalcolours.ENDC}")
        print_test_end_banner(f"{terminalcolours.OKGREEN}{__name__} TEST ENDED{terminalcolours.ENDC}\n")
