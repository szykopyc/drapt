from enum import Enum

class TradeIntentionEnum(str, Enum):
    CREATE = "CREATE"
    ADDTO = "ADDTO"
    CLOSE = "CLOSE"