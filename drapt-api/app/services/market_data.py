from app.external.tiingo import TiingoClient
from app.redis_client import cache_get, cache_set
import asyncio
import json
from app.schemas.asset_data import AssetMetadataRead

from app.utils.log import external_api_logger as logger

def get_client():
    return TiingoClient()

async def get_ticker_search(ticker: str):
    cache_key = f"ticker_base_data:{ticker.upper()}"

    cached = cache_get(cache_key)
    if cached: 
        return cached

    fresh_fetch = []

    try: 
        client = get_client()
        fresh_fetch = await client.get_ticker_base_data(ticker, exact_ticker_match=True, response_limit=1)

        cache_set(cache_key, fresh_fetch[0])
    
    except Exception as e:
        logger.error(f"(Server) {e}")

    return AssetMetadataRead(**fresh_fetch[0])


async def get_multiticker_search_fuzzy(query: str):
    cache_key = f"ticker_base_data:{query.upper()}"
    cache_base_key = f"ticker_base_data:"

    cached = cache_get(cache_key)
    if cached:
        return cached
    
    fresh_fetch = []
    enriched_results = []

    try:
        client = get_client()
        fresh_fetch = await client.get_ticker_base_data(query, exact_ticker_match=False, response_limit=5)

        for fetched_search_result in fresh_fetch:
            fetched_metadata_result = await client.get_ticker_meta(fetched_search_result["ticker"])
            data_to_cache_and_send = {
                "ticker": fetched_search_result["ticker"],
                "company_name": fetched_search_result.get("company_name") or fetched_search_result.get("name"),
                "exchange": fetched_metadata_result["exchange"],
                "description": fetched_metadata_result["description"],
                "type": fetched_search_result["type"],
                "countryCode": fetched_search_result["countryCode"]
            }
            enriched_results.append(data_to_cache_and_send)
            cache_set(str(cache_base_key + fetched_search_result["ticker"]), data_to_cache_and_send)
    
    except Exception as e:
        logger.error(f"(Server) {e}")

    return enriched_results