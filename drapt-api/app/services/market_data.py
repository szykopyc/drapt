from app.external.tiingo import TiingoClient
from app.redis_client import cache_get, cache_set
import asyncio
import json
from app.schemas.asset_data import AssetMetadataRead

from app.utils.log import external_api_logger as logger

def get_client():
    return TiingoClient()

async def get_ticker_metadata(ticker: str):
    cache_key = f"ticker_metadata:{ticker.upper()}"

    cached = cache_get(cache_key)
    if cached: 
        return cached

    fresh_fetch = []

    try: 
        client = get_client()
        fresh_fetch = await client.get_ticker_metadata(ticker, exact_ticker_match=True, response_limit=1)

        cache_set(cache_key, fresh_fetch[0])
    
    except Exception as e:
        logger.error(f"(Server) {e}")

    return AssetMetadataRead(**fresh_fetch[0])


async def get_multiticker_metadata_fuzzy(query: str):
    cache_key = f"ticker_metadata:{query.upper()}"
    cache_base_key = f"ticker_metadata:"

    cached = cache_get(cache_key)
    if cached:
        return cached
    
    fresh_fetch = []

    try:
        client = get_client()
        fresh_fetch = await client.get_ticker_metadata(query, exact_ticker_match=False, response_limit=10) # adjust as needed
        print(type(fresh_fetch))

        for fetched_result in fresh_fetch:
            cache_set(str(cache_base_key+fetched_result["ticker"]), fetched_result)
    
    except Exception as e:
        logger.error(f"(Server) {e}")

    return fresh_fetch