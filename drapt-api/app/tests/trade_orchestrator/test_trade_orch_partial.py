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
from app.tests.pretty_prints_for_testing_purposes import terminalcolours, print_test_end_banner, print_test_start_banner, print_zebra_table

from app.orchestrators.trade_orchestrator import TradeOrchestrator

from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from app.db import Base

password_helper = PasswordHelper()

TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"
test_engine = create_async_engine(TEST_DATABASE_URL, echo=False)
async_session = async_sessionmaker(bind=test_engine)

@pytest.mark.asyncio
async def test_trade_orch_partial_close():
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session() as session:
        print()
        print_test_start_banner(f"{__name__} Partial Close Trade Orchestrator Test")

        print(f"{terminalcolours.OKCYAN}Initialising services...{terminalcolours.ENDC}")
        position_service = PositionService(session)
        trade_service = TradeService(session)
        cash_service = CashService(session)

        print(f"{terminalcolours.OKCYAN}Initialising orchestrator...{terminalcolours.ENDC}")
        trade_orchestrator = TradeOrchestrator(session, trade_service, position_service, cash_service)

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
        assert test_user.id == 1
        assert test_user.username == "test_user"

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
        assert test_portfolio.id == 1
        assert test_portfolio.currency == "EUR"
        assert test_portfolio.initial_cash == Decimal("1000")

        # Record initial portfolio cash
        print(f"{terminalcolours.OKCYAN}Recording initial portfolio cash...{terminalcolours.ENDC}")
        await cash_service._record_initial_portfolio_cash(test_portfolio)
        initial_cash_balance = await cash_service._get_portfolio_balance_all_currency(test_portfolio.id)
        print(f"{terminalcolours.OKGREEN}Initial portfolio cash balance: {initial_cash_balance}{terminalcolours.ENDC}\n")
        assert initial_cash_balance["EUR"] == Decimal("1000.000000")

        # Create a buy trade
        print(f"{terminalcolours.OKCYAN}Setting up a buy trade...{terminalcolours.ENDC}")
        buy_trade = Trade(
            portfolio_id=test_portfolio.id,
            ticker="AVAV",
            exchange="NDQ",
            direction=TradeTypeEnum.BUY,
            currency="EUR",
            price=Decimal("10"),
            quantity=Decimal("10"),
            notional=Decimal("100"),
            execution_date=datetime.now(),
            venue="T212",
            trader_id=test_user.id,
            analyst_id=test_user.id
        )
        print(f"{terminalcolours.OKGREEN}Long trade set up: {buy_trade}{terminalcolours.ENDC}\n")
        await trade_orchestrator.orchestrator_process_trade(buy_trade, test_user)

        # Assert cash ledger after buy trade
        print(f"{terminalcolours.OKCYAN}Fetching the cash ledger after buy trade...{terminalcolours.ENDC}")
        cash_ledger_after_buy = await cash_service._get_cash_ledger_by_portfolio(test_portfolio.id)
        print(f"{terminalcolours.OKGREEN}Cash ledger after buy trade:{terminalcolours.ENDC}")
        print_zebra_table(cash_ledger_after_buy)
        
        print()
        assert len(cash_ledger_after_buy) == 2  # Initial deposit + buy trade
        assert cash_ledger_after_buy[1].amount == Decimal("-100.000000")  # Buy trade cost

        # Create a sell trade
        print(f"{terminalcolours.OKCYAN}Setting up a sell trade, PARTIAL LONG SELL...{terminalcolours.ENDC}")
        sell_trade = Trade(
            portfolio_id=test_portfolio.id,
            ticker="AVAV",
            exchange="NASDAQ",
            direction=TradeTypeEnum.SELL,
            currency="EUR",
            price=Decimal("12"),
            quantity=Decimal("5"),
            notional=Decimal("60"),
            execution_date=datetime.now(),
            venue="T212",
            trader_id=test_user.id,
            analyst_id=test_user.id
        )
        print(f"{terminalcolours.OKGREEN}Sell trade set up: {sell_trade}{terminalcolours.ENDC}\n")
        await trade_orchestrator.orchestrator_process_trade(sell_trade, test_user)

        # Assert cash ledger after sell trade
        print(f"{terminalcolours.OKCYAN}Fetching the cash ledger after sell trade...{terminalcolours.ENDC}")
        cash_ledger_after_sell = await cash_service._get_cash_ledger_by_portfolio(test_portfolio.id)
        print(f"{terminalcolours.OKGREEN}Cash ledger after sell trade:{terminalcolours.ENDC}")
        print_zebra_table(cash_ledger_after_sell)
        
        print()
        assert len(cash_ledger_after_sell) == 3  # Initial deposit + buy trade + sell trade
        assert cash_ledger_after_sell[2].amount == Decimal("60.000000")  # Sell trade proceeds

        # Create a sell trade
        print(f"{terminalcolours.OKCYAN}Setting up a FULL sell trade, FULL LONG SELL...{terminalcolours.ENDC}")
        full_sell_trade = Trade(
            portfolio_id=test_portfolio.id,
            ticker="AVAV",
            exchange="NASDAQ",
            direction=TradeTypeEnum.SELL,
            currency="EUR",
            price=Decimal("13"),
            quantity=Decimal("5"),
            notional=Decimal("65"),
            execution_date=datetime.now(),
            venue="T212",
            trader_id=test_user.id,
            analyst_id=test_user.id
        )
        print(f"{terminalcolours.OKGREEN}FULL Sell trade set up: {full_sell_trade}{terminalcolours.ENDC}\n")
        await trade_orchestrator.orchestrator_process_trade(full_sell_trade, test_user)

        # Assert cash ledger after sell trade
        print(f"{terminalcolours.OKCYAN}Fetching the cash ledger after FULL sell trade...{terminalcolours.ENDC}")
        cash_ledger_after_sell = await cash_service._get_cash_ledger_by_portfolio(test_portfolio.id)
        print(f"{terminalcolours.OKGREEN}Cash ledger after sell trade:{terminalcolours.ENDC}")
        print_zebra_table(cash_ledger_after_sell)
        
        print()

        # Create a sell trade
        print(f"{terminalcolours.OKCYAN}Setting up a new BUY trade, LONG BUY...{terminalcolours.ENDC}")
        new_long_buy = Trade(
            portfolio_id=test_portfolio.id,
            ticker="AVAV",
            exchange="NASDAQ",
            direction=TradeTypeEnum.BUY,
            currency="USD",
            price=Decimal("13"),
            quantity=Decimal("10"),
            notional=Decimal("130"),
            execution_date=datetime.now(),
            venue="T212",
            trader_id=test_user.id,
            analyst_id=test_user.id
        )
        print(f"{terminalcolours.OKGREEN}FULL Sell trade set up: {new_long_buy}{terminalcolours.ENDC}\n")
        await trade_orchestrator.orchestrator_process_trade(new_long_buy, test_user)

        # Assert cash ledger after sell trade
        print(f"{terminalcolours.OKCYAN}Fetching the cash ledger after FULL sell trade...{terminalcolours.ENDC}")
        cash_ledger_after_new_long = await cash_service._get_cash_ledger_by_portfolio(test_portfolio.id)
        print(f"{terminalcolours.OKGREEN}Cash ledger after sell trade:{terminalcolours.ENDC}")
        print_zebra_table(cash_ledger_after_new_long)
        
        print()

        # Final portfolio balance
        print(f"{terminalcolours.OKCYAN}Getting final portfolio balance...{terminalcolours.ENDC}")
        final_balance = await cash_service._get_portfolio_balance_all_currency(test_portfolio.id)
        print(f"{terminalcolours.OKGREEN}Final balance fetched: {final_balance}{terminalcolours.ENDC}")
        assert final_balance["EUR"] == Decimal("1025.000000")
        assert final_balance["USD"] == Decimal("-130.000000")
        
        # Currency-aware balance
        aware_balance = await cash_service._get_portfolio_balance_native(test_portfolio.id)
        print(f"{terminalcolours.OKGREEN}Currency-aware balance fetched: {aware_balance}{terminalcolours.ENDC}")

        print_test_end_banner(f"{__name__} TEST ENDED")