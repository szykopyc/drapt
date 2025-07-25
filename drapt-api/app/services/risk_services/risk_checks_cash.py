from app.services.risk_services.risk_engine import RiskContext, RuleError
from app.services.data_services.market_data import get_last_fx
from decimal import Decimal
from app.enums.trade import TradeTypeEnum

async def no_negative_free_cash_rule(ctx: RiskContext) -> None:
    trade_obj = ctx.metrics["trade"]
    free_cash = ctx.metrics["free_cash"]

    cash_impact = -ctx.metrics["cash_impact"] if trade_obj.direction == TradeTypeEnum.BUY else ctx.metrics["cash_impact"]

    if free_cash - cash_impact < 0:
        raise RuleError(
            f"Trade would drive free cash below zero by {free_cash - cash_impact}"
        )