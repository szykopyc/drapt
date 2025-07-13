import logging
from logging.handlers import RotatingFileHandler
import os

LOG_DIR = "app/logs"
os.makedirs(LOG_DIR, exist_ok=True)

def setup_logger(name: str, file: str) -> logging.Logger:
    logger = logging.getLogger(name)
    logger.setLevel(logging.INFO)

    handler = RotatingFileHandler(
        os.path.join(LOG_DIR, file),
        maxBytes=1_000_000,  # 1MB per file before rotating
        backupCount=5,
        encoding='utf-8'
    )
    formatter = logging.Formatter(
        '%(asctime)s - %(levelname)s - %(filename)s - %(message)s',
        datefmt='%m/%d/%Y %I:%M:%S %p'
    )
    handler.setFormatter(formatter)
    logger.addHandler(handler)
    logger.propagate = False  # Prevent double logging

    return logger

# Define domain-specific loggers
auth_logger = setup_logger("auth", "auth.log")
portfolio_logger = setup_logger("portfolio", "portfolio.log")
trade_logger = setup_logger("trade", "trade.log")
admin_logger = setup_logger("admin", "admin.log")

# Optional: keep a general fallback logger
general_logger = setup_logger("general", "server_logs.log")
