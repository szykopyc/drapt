import pytest
from decimal import Decimal
from datetime import datetime
from fastapi_users.password import PasswordHelper
from app.models.trade import Trade
from app.models.portfolio import Portfolio  
from app.models.user import User
from app.enums.trade import TradeTypeEnum
from app.services.position_services.position_service import PositionService
from app.services.cash_services.cash_service import CashService
from app.services.position_services.position_service import PositionService
from app.services.trade_services.trade_service import TradeService
from app.models.cash_ledger import CashFlow
from app.enums.cash_ledger import CashFlowType
from app.schemas.cash_ledger import CashFlowRead

from app.tests.pretty_prints_for_testing_purposes import terminalcolours, pretty_print_position, print_test_end_banner

from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from app.db import Base

password_helper = PasswordHelper()

TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"
test_engine = create_async_engine(TEST_DATABASE_URL, echo=False)
async_session = async_sessionmaker(bind=test_engine)

@pytest.mark.asyncio
async def test_portfolio_cash_init():
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session() as session:
        print(f"{terminalcolours.OKGREEN}🚀 Running: {__name__} - Position Impact on Cash Test {terminalcolours.ENDC}")

        
        print(f"{terminalcolours.OKGREEN}Creating a test user...{terminalcolours.ENDC}")
        user = User(
            email="test@outlook.com",
            hashed_password=password_helper.hash("test123456"),
            fullname="Test",
            username="test",
            role="pm",
            team="test",
            is_active=True,
            is_superuser=True,
            is_verified=True,
        )
        session.add(user)
        await session.commit()
        print(f"{terminalcolours.OKCYAN}User created{terminalcolours.ENDC}\n")

        
        print(f"{terminalcolours.OKGREEN}Creating a test portfolio...{terminalcolours.ENDC}")
        portfolio = Portfolio(
            id=1,
            portfolio_string_id="test",
            name="Test",
            created_at=datetime.now(),
            initial_cash=Decimal("1000"),
            currency="USD"
        )
        session.add(portfolio)
        print(f"{terminalcolours.OKCYAN}Portfolio created: {portfolio}{terminalcolours.ENDC}\n")
        await session.commit()

        
        cash_service = CashService(session)
        position_service = PositionService(session)
        trade_service = TradeService(session)

        
        print(f"{terminalcolours.OKGREEN}Recording initial cash for the portfolio...{terminalcolours.ENDC}")
        await cash_service._record_initial_portfolio_cash(portfolio)
        initial_balance = await cash_service._get_portfolio_cash_balance(1)
        print(f"{terminalcolours.OKCYAN}Initial cash balance: {initial_balance}{terminalcolours.ENDC}\n")

        
        print(f"{terminalcolours.OKGREEN}Adding an opening trade (SHORT_SELL)...{terminalcolours.ENDC}")
        trade = Trade(
            portfolio_id=1,
            ticker="AVAV",
            exchange="NASDAQ",
            direction=TradeTypeEnum.SELL,
            currency="USD",
            price=Decimal("10"),
            quantity=Decimal("10"),
            notional=Decimal("100"),
            execution_date=datetime.now(),
            venue="T212",
            trader_id=1,
            analyst_id=1
        )
        await position_service.process_trade(trade)
        pos = await position_service._get_open_position_with_ticker(1, "AVAV")
        print(f"{terminalcolours.OKCYAN}Position after opening trade: {pos}{terminalcolours.ENDC}\n")

        print(f"{terminalcolours.OKGREEN}Adding cash entry for the opening trade...{terminalcolours.ENDC}")
        await cash_service._cash_cost_from_trade(trade)
        after_opening_trade_cash_flow = await cash_service._get_cash_ledger_by_portfolio(1)
        print(f"{terminalcolours.OKCYAN}Cash ledger after opening trade: {after_opening_trade_cash_flow}{terminalcolours.ENDC}\n")

        
        print(f"{terminalcolours.OKGREEN}Adding a closing trade (SHORT_COVER)...{terminalcolours.ENDC}")
        closing_trade = Trade(
            portfolio_id=1,
            ticker="AVAV",
            exchange="NASDAQ",
            direction=TradeTypeEnum.BUY,
            currency="USD",
            price=Decimal("8"),
            quantity=Decimal("10"),
            notional=Decimal("80"),
            execution_date=datetime.now(),
            venue="T212",
            trader_id=1,
            analyst_id=1
        )
        await position_service.process_trade(closing_trade)
        position = await position_service._get_closed_position_with_ticker(1, "AVAV")
        print(f"{terminalcolours.OKCYAN}Position after closing trade: {position}{terminalcolours.ENDC}\n")

        if position and closing_trade:
            print(f"{terminalcolours.OKGREEN}Recording cash impact of the closing trade...{terminalcolours.ENDC}")
            await cash_service._cash_from_realised_position(position[0], closing_trade)
        else:
            print(f"{terminalcolours.FAIL}Failed to process closing trade or position not found.{terminalcolours.ENDC}")

        
        print(f"{terminalcolours.OKGREEN}Final cash ledger for the portfolio...{terminalcolours.ENDC}")
        final_ledger = await cash_service._get_cash_ledger_by_portfolio(1)
        for lg in final_ledger:
            print(f"{terminalcolours.OKCYAN}{lg}{terminalcolours.ENDC}")

        print(f"{terminalcolours.OKGREEN}Final cash balance for the portfolio...{terminalcolours.ENDC}")
        final_balance = await cash_service._get_portfolio_cash_balance(1)
        print(f"{terminalcolours.OKCYAN}Final cash balance: {final_balance}{terminalcolours.ENDC}\n")

        print(f"{terminalcolours.OKGREEN}✅ Test completed successfully!{terminalcolours.ENDC}")