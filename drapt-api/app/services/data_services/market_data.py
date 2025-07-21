from app.external.tiingo import TiingoClient
from app.redis_client import cache_get, cache_set, cache_set_short_exp
from app.schemas.asset_data import AssetMetadataRead

from app.utils.log import external_api_logger as logger

def get_client():
    return TiingoClient()

async def get_ticker_last_close(ticker: str):
    cache_key = f"ticker_last_close:{ticker.strip().upper()}"

    cached = cache_get(cache_key)
    if cached:
        return cached
    
    fresh_fetch = []

    try:
        client = get_client()
        fresh_fetch = await client.get_ticker_last_close(ticker)
        cache_set_short_exp(cache_key, fresh_fetch)

    except Exception as e:
        logger.error(f"(Server) {e}")

    return fresh_fetch

async def get_ticker_search(ticker: str):
    cache_key = f"ticker_base_data:{ticker.upper()}"

    cached = cache_get(cache_key)
    if cached: 
        return cached

    fresh_fetch = []
    enriched_result = []

    try: 
        client = get_client()
        fresh_fetch = await client.get_ticker_base_data(ticker, exact_ticker_match=True, response_limit=1)

        fresh_fetch = fresh_fetch[0]
        enriched_result = []

        fetched_metadata_result = await client.get_ticker_meta(fresh_fetch["ticker"])
        fetched_last_close_result = await get_ticker_last_close(fresh_fetch["ticker"])

        data_to_cache_and_send = {
            "ticker": fresh_fetch["ticker"],
            "company_name": fresh_fetch.get("company_name") or fresh_fetch.get("name"),
            "exchange": fetched_metadata_result["exchange"],
            "description": fetched_metadata_result["description"],
            "type": fresh_fetch["type"],
            "countryCode": fresh_fetch["countryCode"],
            "adjClose":fetched_last_close_result["adjClose"]
        }
        enriched_result.append(data_to_cache_and_send)

        cache_set_short_exp(cache_key, data_to_cache_and_send)
    
    except Exception as e:
        logger.error(f"(Server) {e}")

    return enriched_result


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
            fetched_last_close_result = await get_ticker_last_close(fetched_search_result["ticker"])

            data_to_cache_and_send = {
                "ticker": fetched_search_result["ticker"],
                "company_name": fetched_search_result.get("company_name") or fetched_search_result.get("name"),
                "exchange": fetched_metadata_result["exchange"],
                "description": fetched_metadata_result["description"],
                "type": fetched_search_result["type"],
                "countryCode": fetched_search_result["countryCode"],
                "adjClose":fetched_last_close_result["adjClose"]
            }
            enriched_results.append(data_to_cache_and_send)
            cache_set_short_exp(str(cache_base_key + fetched_search_result["ticker"]), data_to_cache_and_send)
    
    except Exception as e:
        logger.error(f"(Server) {e}")

    return enriched_results