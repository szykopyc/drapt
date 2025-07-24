import pytest
from decimal import Decimal
from datetime import date, datetime
from fastapi_users.password import PasswordHelper
from app.models.portfolio import Portfolio
from app.models.user import User
from app.services.position_services.position_service import PositionService
from app.services.trade_services.trade_service import TradeService
from app.services.cash_services.cash_service import CashService
from app.enums.cash_ledger import CashFlowType
from app.models.cash_ledger import CashFlow
from app.enums.trade import CurrencyEnum
from app.tests.pretty_prints_for_testing_purposes import terminalcolours, print_test_end_banner, print_zebra_table

from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from app.db import Base

password_helper = PasswordHelper()

TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"
test_engine = create_async_engine(TEST_DATABASE_URL, echo=False)
async_session = async_sessionmaker(bind=test_engine)

@pytest.mark.asyncio
async def test_position_lifecycle():
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session() as session:
        print(f"{terminalcolours.OKGREEN}🚀 Running: {__name__} - Long Position Lifecycle Full Close Test {terminalcolours.ENDC}\n")

        
        print(f"{terminalcolours.OKCYAN}Initialising services...{terminalcolours.ENDC}")
        position_service = PositionService(session)
        trade_service = TradeService(session)
        cash_service = CashService(session)
        print(f"{terminalcolours.OKGREEN}Services initialised successfully.{terminalcolours.ENDC}\n")

        
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

        
        print(f"{terminalcolours.OKCYAN}Recording initial portfolio cash...{terminalcolours.ENDC}")
        await cash_service._record_initial_portfolio_cash(test_portfolio)
        initial_cash_balance = await cash_service._get_portfolio_balance_native(test_portfolio.id)
        print(f"{terminalcolours.OKGREEN}Initial portfolio cash balance: {initial_cash_balance}{terminalcolours.ENDC}\n")

        print(f"{terminalcolours.OKCYAN}Recording deposit{terminalcolours.ENDC}")
        
        deposit = CashFlow(
            portfolio_id = 1,
            currency = CurrencyEnum.USD,
            timestamp = datetime.now(),
            amount = Decimal("100"),
            flow_type = CashFlowType.DEPOSIT,
            fx_at_time_of_conversion = Decimal("1"),
            converted_amount = Decimal("100")
        )
        await cash_service._add_cash_flow(deposit)
        print(deposit)
        after_deposit_balance = await cash_service._get_portfolio_balance_native(test_portfolio.id)
        print(f"{terminalcolours.OKGREEN}After deposit portfolio cash balance: {after_deposit_balance}{terminalcolours.ENDC}\n")


        print(f"{terminalcolours.OKCYAN}Recording withdrawal{terminalcolours.ENDC}")
        
        withdrawal = CashFlow(
            portfolio_id = 1,
            currency = CurrencyEnum.USD,
            timestamp = datetime.now(),
            amount = Decimal("-200"),
            flow_type = CashFlowType.WITHDRAWAL,
            fx_at_time_of_conversion = Decimal("1"),
            converted_amount = Decimal("-200")
        )
        await cash_service._add_cash_flow(withdrawal)
        print(withdrawal)
        after_withdrawal_balance = await cash_service._get_portfolio_balance_native(test_portfolio.id)
        print(f"{terminalcolours.OKGREEN}After withdrawal portfolio cash balance: {after_withdrawal_balance}{terminalcolours.ENDC}\n")


        print(f"{terminalcolours.OKCYAN}Getting available cash{terminalcolours.ENDC}")
        cash_avail = await cash_service._get_ndv(1)

        print(f"{terminalcolours.OKGREEN}NDV: {cash_avail}{terminalcolours.ENDC}\n")
