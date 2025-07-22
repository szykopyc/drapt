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
        print(f"{terminalcolours.OKGREEN}🚀 Running: {__name__} - Full Close Position Test {terminalcolours.ENDC}")

        # create a user so the FK constraint is satisfied
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
        # Create a portfolio so the FK constraint is also satisfied
        portfolio = Portfolio(id=1, portfolio_string_id="test", name="Test", created_at=datetime.now(), initial_cash=Decimal("1000"), currency="USD")

        session.add(portfolio)
        await session.commit()

        service = PositionService(session)

        # Open a short position
        open_trade = Trade(
            portfolio_id=1,
            ticker="AVAV",
            exchange="NDQ",
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

        await service.process_trade(open_trade)
        pos = await service._get_open_position_with_ticker(portfolio_id=1, ticker="AVAV")
        assert pos is not None
        assert pos.open_quantity == Decimal("10")
        assert pos.average_entry_price == Decimal("10")
        assert pos.is_closed is False

        pretty_print_position(
            PositionRead.model_validate(pos),
            "📈 Open Position State After Initial Short Trade",
            terminalcolours.OKCYAN
        )

        # Full close (BUY to close short)
        close_trade2 = Trade(
            portfolio_id=1,
            ticker="AVAV",
            exchange="NDQ",
            direction=TradeTypeEnum.BUY,
            currency="USD",
            price=Decimal("5"), 
            quantity=Decimal("10"),
            notional=Decimal("50"),
            execution_date=datetime.now(),
            venue="T212",
            trader_id=1,
            analyst_id=1
        )
        await service.process_trade(close_trade2)
        pos = await service._get_open_position_with_ticker(portfolio_id=1, ticker="AVAV")
        assert pos is None  # After full close, there should be no open position

        closed_pos = await service._get_closed_position_with_ticker(portfolio_id=1, ticker="AVAV")
        assert closed_pos is not None
        assert len(closed_pos) == 1  # Only one closed position expected

        closed_pos_schema_applied = [PositionRead.model_validate(closed_pos_ind) for closed_pos_ind in closed_pos]
        for i in closed_pos_schema_applied:
            pretty_print_position(
                i,
                "✅ Closed Position State After Full Close",
                terminalcolours.OKBLUE
            )
            # Additional asserts for closed position fields
            assert i.is_closed is True
            assert i.open_quantity == Decimal("0")
            assert i.ticker == "AVAV"
            assert i.portfolio_id == 1
            assert i.direction.name == "SHORT"
            assert i.initial_quantity == Decimal("10")
            assert i.entry_price == Decimal("10")
            assert i.exit_price == Decimal("5")
            assert i.close_date is not None

        print_test_end_banner(f"{__name__} TEST ENDED", width=80)

if __name__ == "__main__":
    asyncio.run(test_position_lifecycle())
