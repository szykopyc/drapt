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
async def test_position_lifecycle():
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session() as session:
        print(f"{terminalcolours.OKGREEN}🚀 Running: {__name__} - Short Position Lifecycle Full Close Test {terminalcolours.ENDC}\n")

        
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
        initial_cash_balance = await cash_service._get_portfolio_cash_balance(test_portfolio.id)
        print(f"{terminalcolours.OKGREEN}Initial portfolio cash balance: {initial_cash_balance}{terminalcolours.ENDC}\n")

        
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

        
        print(f"{terminalcolours.OKCYAN}Booking the short trade...{terminalcolours.ENDC}")
        booked_short_trade = await trade_service._book_trade(short_trade, test_user)
        print(f"{terminalcolours.OKGREEN}Trade booked: {booked_short_trade}{terminalcolours.ENDC}\n")

        
        if booked_short_trade:
            print(f"{terminalcolours.OKCYAN}Handling the short trade in PositionService...{terminalcolours.ENDC}")
            short_trade_result = await position_service._handle_trade(booked_short_trade)
            print(f"{terminalcolours.OKGREEN}Result from _handle_trade (CREATE): {short_trade_result}{terminalcolours.ENDC}\n")

            print(f"{terminalcolours.OKCYAN}Updating cash ledger for the short trade...{terminalcolours.ENDC}")
            for action in short_trade_result:
                match action["intent"]:
                    case TradeIntentionEnum.CREATE:
                        await cash_service._cash_cost_from_trade(action["trade"], action["position"])
                    case TradeIntentionEnum.ADDTO:
                        await cash_service._cash_cost_from_trade(action["trade"], action["position"])
                    case TradeIntentionEnum.CLOSE:
                        await cash_service._realise_position(action["trade"], action["position"])
            print(f"{terminalcolours.OKGREEN}Cash ledger updated for the short trade.{terminalcolours.ENDC}")
            cash_ledger = await cash_service._get_cash_ledger_by_portfolio(1)
            print(f"{terminalcolours.OKGREEN}{cash_ledger}{terminalcolours.ENDC}\n")

        
        print(f"{terminalcolours.OKCYAN}Fetching the open position...{terminalcolours.ENDC}")
        open_position = await position_service._get_open_position_with_ticker(portfolio_id=test_portfolio.id, ticker="AVAV")
        print(f"{terminalcolours.OKGREEN}Open position fetched: {open_position}{terminalcolours.ENDC}\n")
        assert open_position is not None
        assert open_position.open_quantity == Decimal("10")
        assert open_position.average_entry_price == Decimal("10")
        assert open_position.is_closed is False

        pretty_print_position(
            PositionRead.model_validate(open_position),
            f"{terminalcolours.OKCYAN}Open Position State After Initial Short Trade{terminalcolours.ENDC}",
            terminalcolours.OKGREEN
        )

        
        print(f"{terminalcolours.OKCYAN}Creating a full close trade...{terminalcolours.ENDC}")
        full_close_trade = Trade(
            id=2,
            portfolio_id=test_portfolio.id,
            ticker="AVAV",
            exchange="NDQ",
            direction=TradeTypeEnum.BUY,
            currency="USD",
            price=Decimal("12"),
            quantity=Decimal("10"),
            notional=Decimal("120"),
            execution_date=datetime.now(),
            venue="T212",
            trader_id=test_user.id,
            analyst_id=test_user.id
        )
        print(f"{terminalcolours.OKGREEN}Full close trade created: {full_close_trade}{terminalcolours.ENDC}\n")

        
        print(f"{terminalcolours.OKCYAN}Booking the full close trade...{terminalcolours.ENDC}")
        booked_close_trade = await trade_service._book_trade(full_close_trade, test_user)
        print(f"{terminalcolours.OKGREEN}Full close trade booked: {booked_close_trade}{terminalcolours.ENDC}\n")

        if booked_close_trade:
            print(f"{terminalcolours.OKCYAN}Handling the full close trade in PositionService...{terminalcolours.ENDC}")
            close_trade_result = await position_service._handle_trade(booked_close_trade)
            print(f"{terminalcolours.OKGREEN}Result from _handle_trade (CLOSE): {close_trade_result}{terminalcolours.ENDC}\n")

            print(f"{terminalcolours.OKCYAN}Updating cash ledger for the full close trade...{terminalcolours.ENDC}")
            for action in close_trade_result:
                match action["intent"]:
                    case TradeIntentionEnum.CREATE:
                        await cash_service._cash_cost_from_trade(action["trade"], action["position"])
                    case TradeIntentionEnum.ADDTO:
                        await cash_service._cash_cost_from_trade(action["trade"], action["position"])
                    case TradeIntentionEnum.CLOSE:
                        await cash_service._realise_position(action["trade"], action["position"])
            print(f"{terminalcolours.OKGREEN}Cash ledger updated for the full close trade.{terminalcolours.ENDC}")
            cash_ledger = await cash_service._get_cash_ledger_by_portfolio(1)
            print(f"{terminalcolours.OKGREEN}{cash_ledger}{terminalcolours.ENDC}\n")

        
        print(f"{terminalcolours.OKCYAN}Fetching the closed position...{terminalcolours.ENDC}")
        closed_positions = await position_service._get_closed_position_with_ticker(portfolio_id=test_portfolio.id, ticker="AVAV")
        print(f"{terminalcolours.OKGREEN}Closed positions fetched: {closed_positions}{terminalcolours.ENDC}\n")

        if not closed_positions:
            raise ValueError("No cosed position")
            
        for closed_position in closed_positions:
            assert closed_position is not None
            assert closed_position.open_quantity == Decimal("0")
            assert closed_position.is_closed is True

        pretty_print_position(
            PositionRead.model_validate(closed_positions[0]),
            f"{terminalcolours.WARNING}Closed Position State After Full Close{terminalcolours.ENDC}",
            terminalcolours.WARNING
        )

        print_test_end_banner(f"{terminalcolours.OKGREEN}{__name__} TEST ENDED{terminalcolours.ENDC}\n")


if __name__ == "__main__":
    asyncio.run(test_position_lifecycle())
