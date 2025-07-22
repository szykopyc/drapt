import pytest
from decimal import Decimal
from datetime import datetime
import asyncio
from fastapi_users.password import PasswordHelper
from app.models.trade import Trade
from app.models.portfolio import Portfolio
from app.models.user import User
from app.enums.trade import TradeTypeEnum
from app.services.position_services.position_service import PositionService
from app.schemas.position import PositionRead

from app.tests.pretty_prints_for_testing_purposes import terminalcolours, pretty_print_position, print_test_end_banner

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
        print(f"{terminalcolours.OKGREEN}🚀 Running: {__name__} - Partial Close Position Test {terminalcolours.ENDC}")

        user = User(
            email="test@outlook.com",
            hashed_password=password_helper.hash("test123456"),
            fullname="Test",
            username="test",
            role="pm",
            team="industrial",
            is_active=True,
            is_superuser=True,
            is_verified=True,
        )
        portfolio = Portfolio(id=1, portfolio_string_id="industrial", name="Test", created_at=datetime.now(), initial_cash=Decimal("1000"), currency="USD")

        session.add(portfolio)
        await session.commit()

        service = PositionService(session)

        # Open a long position
        open_trade = Trade(
            portfolio_id=1,
            ticker="AVAV",
            exchange="NDQ",
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
        await service.process_trade(open_trade)
        pos = await service._get_open_position_with_ticker(portfolio_id=1, ticker="AVAV")
        assert pos is not None
        assert pos.open_quantity == Decimal("10")
        assert pos.average_entry_price == Decimal("10")
        assert pos.is_closed is False

        pretty_print_position(
            PositionRead.model_validate(pos),
            "📈 Open Position State After Initial Long Trade",
            terminalcolours.OKCYAN
        )

        # Partial close (sell 5)
        close_trade = Trade(
            portfolio_id=1,
            ticker="AVAV",
            exchange="NDQ",
            direction=TradeTypeEnum.SELL,
            currency="USD",
            price=Decimal("12"),
            quantity=Decimal("5"),
            notional=Decimal("60"),
            execution_date=datetime.now(),
            venue="T212",
            trader_id=1,
            analyst_id=1
        )
        await service.process_trade(close_trade)
        pos = await service._get_open_position_with_ticker(portfolio_id=1, ticker="AVAV")
        assert pos is not None
        assert pos.open_quantity == Decimal("5")
        assert pos.is_closed is False

        pretty_print_position(
            PositionRead.model_validate(pos),
            "✂️ Open Position State After Partial Close",
            terminalcolours.WARNING
        )

        # Full close (sell remaining 5)
        close_trade2 = Trade(
            portfolio_id=1,
            ticker="AVAV",
            exchange="NDQ",
            direction=TradeTypeEnum.SELL,
            currency="USD",
            price=Decimal("11"),
            quantity=Decimal("5"),
            notional=Decimal("55"),
            execution_date=datetime.now(),
            venue="T212",
            trader_id=1,
            analyst_id=1
        )
        await service.process_trade(close_trade2)
        pos = await service._get_open_position_with_ticker(portfolio_id=1, ticker="AVAV")
        assert pos is None  # Position should be closed

        print(f"{terminalcolours.OKBLUE}🔒 Position fully closed, no open positions remain.{terminalcolours.ENDC}")

        print_test_end_banner(f"{__name__} TEST ENDED")


if __name__ == "__main__":
    asyncio.run(test_position_lifecycle())
