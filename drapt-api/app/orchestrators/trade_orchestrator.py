from app.services.cash_services.cash_service import CashService
from app.services.position_services.position_service import PositionService
from app.services.trade_services.trade_service import TradeService
from app.services.risk_services.risk_engine import RiskService, RuleError
from app.services.risk_services.risk_checks_cash import no_negative_free_cash_rule
from app.utils.log import risk_engine_logger, trade_logger, position_logger

from app.models.trade import Trade
from app.models.user import User
from app.exceptions.trade import TradeCreationError
from app.exceptions.position import PositionHandlingFailedError
from sqlalchemy.ext.asyncio import AsyncSession

from app.enums.trade_orchestrator import TradeIntentionEnum

class TradeOrchestrator:
    def __init__(self, session: AsyncSession, trade_service: TradeService, position_service: PositionService, cash_service: CashService, risk_engine: RiskService) -> None:
        self.session = session
        self.trade_service = trade_service
        self.position_service = position_service
        self.cash_service = cash_service
        self.risk_engine = risk_engine

        self.risk_engine.clear_rules()
        self.risk_engine.register_rule(no_negative_free_cash_rule)

    async def orchestrator_process_trade(self, trade, user: User):
        try:
            trade_obj = await self.trade_service._book_trade(trade, user)
            if not trade_obj:
                raise TradeCreationError("No trade object returned from trade booking")

            position_object = await self.position_service._handle_trade(trade_obj)
            if not position_object:
                raise PositionHandlingFailedError("No position object returned from handling trade")

            portfolio_id = position_object[0]["position"].portfolio_id

            for trade_action in position_object:
                await self._process_trade_action(trade_action, portfolio_id)

            trade_logger.info(f"({user.username}) booked trade for PORTFOLIO ID: {trade_obj.portfolio_id} / TICKER: {trade_obj.ticker} / DATE: {trade_obj.execution_date}")

            for pos in position_object:
                match pos["intent"]:
                    case TradeIntentionEnum.CREATE:
                        position_logger.info(f"({user.username} created position for PORTFOLIO ID: {trade_obj.portfolio_id} / POSITION ID: {pos["position"].position_id} / DATE: {trade_obj.execution_date}")

                    case TradeIntentionEnum.ADDTO:
                        position_logger.info(f"({user.username} added to position for PORTFOLIO ID: {trade_obj.portfolio_id} / POSITION ID: {pos["position"].position_id} / DATE: {trade_obj.execution_date}")

                    case TradeIntentionEnum.CLOSE:
                        position_logger.info(f"({user.username} closed position for PORTFOLIO ID: {trade_obj.portfolio_id} / POSITION ID: {pos["position"].position_id} / DATE: {trade_obj.execution_date}")

            return trade_obj

        except RuleError as e:
            risk_engine_logger.error(f"Risk rule failed for portfolio ID {portfolio_id}: {e}") # type: ignore
            risk_engine_logger.info("Rolling back the session...")
            await self.session.rollback()
            raise

        except Exception as e:
            print(f"Unexpected error during trade orchestration: {e}")
            await self.session.rollback()
            raise

    async def _process_trade_action(self, trade_action, portfolio_id):
        if trade_action["intent"] == TradeIntentionEnum.CLOSE:
            await self.cash_service._realise_position(trade_action["trade"], trade_action["position"])
            return None
        
        free_cash = await self.cash_service._get_free_cash(portfolio_id)
        cashflow_from_trade = await self.cash_service._cash_cost_from_trade(trade_action["trade"], trade_action["position"])
        cash_impact_from_trade = cashflow_from_trade.converted_amount

        try:
            await self.risk_engine.evaluate(
                position=trade_action["position"],
                trade=trade_action["trade"],
                free_cash=free_cash,
                cash_impact=cash_impact_from_trade,
            )
            
        except RuleError as e:
            raise