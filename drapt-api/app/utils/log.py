import logging

logging.basicConfig(
    filename="app/logs/server_logs.log",
    encoding='utf-8',
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(filename)s - %(message)s',
    datefmt='%m/%d/%Y %I:%M:%S %p'
)
logger = logging.getLogger()