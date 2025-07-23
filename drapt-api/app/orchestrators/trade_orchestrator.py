from app.services.cash_services.cash_service import CashService
from app.services.position_services.position_service import PositionService
from app.services.trade_services.trade_service import TradeService

class TradeOrchestrator:
    def __init__(self, trade_service : TradeService, position_service : PositionService, cash_service : CashService) -> None:
        self.trade_service = trade_service
        self.position_service = position_service
        self.cash_service = cash_service
        ...