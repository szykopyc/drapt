import os
from dotenv import load_dotenv
from typing import Optional

import httpx

load_dotenv()

class TiingoClient:
    def __init__(self) -> None:
        self.api_key = os.getenv("TIINGO_API_KEY")
        self.base_url = "https://api.tiingo.com/"
        self.headers = {
            'Content-Type':'application/json',
            'Authorization':f'Token {self.api_key}'
        }

    async def get_ticker_metadata(
        self,
        ticker: str,
        exact_ticker_match: Optional[bool] = False,
        response_limit: Optional[int] = 5
    ):
        url=f"{self.base_url}tiingo/utilities/search"
        params = {
            "query":ticker.strip().upper(),
            "exactTickerMatch":str(exact_ticker_match).lower(),
            "limit":str(response_limit)
        }

        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=self.headers, params=params)
            response.raise_for_status()
            response = response.json()
            formatted_response = [
                {
                    "company_name":item["name"],
                    "ticker":item["ticker"],
                    "type":item["assetType"],
                    "exchange":item["countryCode"]
                }
                for item in response
            ]
            return formatted_response
