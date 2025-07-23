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

    async def get_ticker_base_data(
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
                    "countryCode":item["countryCode"]
                }
                for item in response
            ]
            return formatted_response
        
    
    async def get_ticker_meta(
            self,
            ticker: str
    ):
        url = f"{self.base_url}tiingo/daily/{ticker.strip().upper()}"

        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=self.headers)
            response.raise_for_status()
            response = response.json()
            formatted_response = {
                    "ticker":response["ticker"],
                    "company_name":response["name"],
                    "exchange":response["exchangeCode"],
                    "description":response["description"]
            }
            
            return formatted_response
        

    async def get_ticker_last_close(
        self,
        ticker: str
    ):
        url = f"{self.base_url}tiingo/daily/{ticker.strip().upper()}/prices"

        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=self.headers)
            response.raise_for_status()
            response = response.json()

            if not response or not isinstance(response, list):
                raise ValueError("No price data returned from Tiingo")

            price = response[0]

            formatted_response = {
                "ticker": ticker.strip().upper(),
                "open": price["open"],
                "high": price["high"],
                "low": price["low"],
                "close": price["close"],
                "volume": price["volume"],
                "adjOpen": price["adjOpen"],
                "adjHigh": price["adjHigh"],
                "adjLow": price["adjLow"],
                "adjClose": price["adjClose"],
                "adjVolume": price["adjVolume"],
                "divCash": price["divCash"],
                "date": price.get("date"),
            }

            return formatted_response


    async def get_last_fx_rate(
        self,
        fx_pair: str
    ):
        url = f"{self.base_url}tiingo/fx/{fx_pair.strip().upper()}/top"

        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=self.headers)
            response.raise_for_status()
            response = response.json()

            if not response or not isinstance(response, list):
                raise ValueError("No FX data returned from Tiingo")

            last_fx = response[0]

            return last_fx
