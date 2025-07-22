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
        print(f"{terminalcolours.OKGREEN}🚀 Running: {__name__} - Full Portfolio Cash Initialisation Test {terminalcolours.ENDC}")

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

        service = CashService(session)

        await service._record_initial_portfolio_cash(portfolio)

        cash = await service._get_portfolio_cash_balance(1)
        assert cash is not None
        assert cash['USD'] == Decimal("1000")

        cash_ledger = await service._get_cash_ledger_by_portfolio(1)

        print(cash_ledger)