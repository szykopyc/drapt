import enum

class TradeTypeEnum(str, enum.Enum):
    BUY="BUY"
    SELL="SELL"

class CurrencyEnum(str, enum.Enum):
    GBP="GBP"
    EUR="EUR"
    USD="USD"
