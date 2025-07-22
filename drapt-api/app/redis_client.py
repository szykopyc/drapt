import redis
import json
from dotenv import load_dotenv
import os

load_dotenv()

REDIS_URL = os.getenv("REDIS_URL")

if not REDIS_URL:
    raise ValueError("Missing REDIS_URL from .env")

redis_client = redis.Redis.from_url(REDIS_URL, decode_responses=True)

def cache_set(key: str, value: dict, ttle: int = 86400):
    redis_client.setex(key, ttle, json.dumps(value))

def cache_set_short_exp(key: str, value: dict, ttle:int = 14400): # 4 hour exp
    redis_client.setex(key, ttle, json.dumps(value))

def cache_get(key: str):
    value = redis_client.get(key)

    if value is None:
        return None

    if isinstance(value, bytes):
        value = value.decode('utf-8')

    return json.loads(value)

