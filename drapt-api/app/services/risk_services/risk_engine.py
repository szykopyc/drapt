from sqlalchemy.ext.asyncio import AsyncSession
from typing import Protocol
from app.models.position import Position
from dataclasses import dataclass

from typing import Protocol, Awaitable, Callable
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.position import Position

class RuleError(Exception):
    pass

class RiskContext:
    def __init__(self, session: AsyncSession, position: list, **metrics):
        self.session = session
        self.position = position
        self.metrics = metrics

class RiskRule(Protocol):
    async def __call__(self, ctx: "RiskContext") -> None: ...

class RiskService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.rules: list[RiskRule] = []

    def register_rule(self, rule_fn: RiskRule) -> None:
        self.rules.append(rule_fn)

    def clear_rules(self) -> None:
        self.rules = []

    async def evaluate(self, position: list, **metrics) -> None:
        ctx = RiskContext(self.session, position, **metrics)
        for rule in self.rules:
            await rule(ctx)