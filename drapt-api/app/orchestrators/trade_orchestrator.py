from app.services.cash_services.cash_service import CashService
from app.services.position_services.position_service import PositionService
from app.services.trade_services.trade_service import TradeService
from app.models.trade import Trade
from app.models.user import User
from app.exceptions.trade import TradeCreationError
from app.exceptions.position import PositionHandlingFailedError
from sqlalchemy.ext.asyncio import AsyncSession

from app.enums.trade_orchestrator import TradeIntentionEnum

class TradeOrchestrator:
    def __init__(self, session: AsyncSession, trade_service : TradeService, position_service : PositionService, cash_service : CashService) -> None:
        self.session = session
        self.trade_service = trade_service
        self.position_service = position_service
        self.cash_service = cash_service
        
    async def orchestrator_process_trade(self, trade: Trade, user: User):
        trade_obj = await self.trade_service._book_trade(trade, user)
        if not trade_obj:
            raise TradeCreationError("No trade object returned from trade booking")
        
        position_object = await self.position_service._handle_trade(trade_obj)
        if not position_object:
            raise PositionHandlingFailedError("No position object returned from handling trade")
        
        for trade_action in position_object:
            match trade_action["intent"]:
                case TradeIntentionEnum.CREATE:
                    await self.cash_service._cash_cost_from_trade(trade_action["trade"], trade_action["position"])

                case TradeIntentionEnum.ADDTO:
                    await self.cash_service._cash_cost_from_trade(trade_action["trade"], trade_action["position"])

                case TradeIntentionEnum.CLOSE:
                    await self.cash_service._realise_position(trade_action["trade"], trade_action["position"])

        return True