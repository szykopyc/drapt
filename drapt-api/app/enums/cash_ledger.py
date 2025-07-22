import enum

class CashFlowType(str, enum.Enum):
    DEPOSIT = "DEPOSIT"
    WITHDRAWAL = "WITHDRAWAL"
    
    # Trading
    LONG_BUY = "LONG_BUY"        # open long
    LONG_SELL = "LONG_SELL"      # close long
    SHORT_SELL = "SHORT_SELL"    # open short
    SHORT_COVER = "SHORT_COVER"  # close short
    
    # Income
    DIVIDEND = "DIVIDEND"
    INTEREST = "INTEREST"
    
    # Position closures
    REALISED = "REALISED"
    
    # Costs
    FEE = "FEE"
    TAX = "TAX"