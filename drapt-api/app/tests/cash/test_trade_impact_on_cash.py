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

        # Create a portfolio so the FK constraint is also satisfied
        portfolio = Portfolio(id=1, portfolio_string_id="test", name="Test", created_at=datetime.now(), initial_cash=Decimal("1000"), currency="USD")

        session.add(portfolio)
        await session.commit()

        cash_service = CashService(session)
        position_service = PositionService(session)

        # Portfolio cash init

        print(f"{terminalcolours.OKGREEN}Setting Initial Portfolio Cash{terminalcolours.ENDC}")
        await cash_service._record_initial_portfolio_cash(portfolio)

        initial_cash_flow = await cash_service._get_cash_ledger_by_portfolio(1)

        print(f"{terminalcolours.OKCYAN}{initial_cash_flow}{terminalcolours.ENDC}\n")

        print(f"{terminalcolours.OKGREEN}Adding Trade...{terminalcolours.ENDC}")

        trade = Trade(
            portfolio_id=1,
            ticker="AVAV",
            exchange="NASDAQ",
            direction=TradeTypeEnum.BUY,
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
        pos = await position_service._get_open_position_with_ticker(1,"AVAV")

        print(f"{terminalcolours.OKCYAN}{pos}{terminalcolours.ENDC}\n")

        print(f"{terminalcolours.OKGREEN}Adding cash entry for the trade...{terminalcolours.ENDC}")

        await cash_service._cash_cost_from_trade(trade)
    
        after_trade_cash_flow = await cash_service._get_cash_ledger_by_portfolio(1)

        print(f"{terminalcolours.OKCYAN}{after_trade_cash_flow}{terminalcolours.ENDC}\n")

        print(f"{terminalcolours.OKGREEN}Verifying that cash balance is 900.00 ...{terminalcolours.ENDC}")
        portfolio_cash_balance = await cash_service._get_portfolio_cash_balance(1)

        assert portfolio_cash_balance["USD"] == Decimal("900")
        assert len(after_trade_cash_flow) == 2  # Initial deposit + trade cost
        assert after_trade_cash_flow[1].flow_type == CashFlowType.LONG_BUY
        assert after_trade_cash_flow[1].amount == Decimal("-100")
        print(f"{terminalcolours.OKGREEN}Test succeeeded{terminalcolours.ENDC}")
        print(f"{terminalcolours.OKCYAN}{portfolio_cash_balance}{terminalcolours.ENDC}")