from fastapi import APIRouter, Depends, HTTPException, status 
from typing import List
from app.config.permissions import permission_check_util
from app.users.deps import fastapi_users
from app.schemas.asset_data import AssetMetadataRead
from app.services.data_services.market_data import get_ticker_search, get_multiticker_search_fuzzy
from app.utils.log import external_api_logger as logger
from app.models.user import User

router = APIRouter()

@router.get("/asset-data/search/{ticker}", response_model=AssetMetadataRead, tags=["asset-data"])
async def get_ticker_metadata_route(
    ticker: str,
    current_user: User = Depends(fastapi_users.current_user())
):
    if not permission_check_util(current_user, "can_query_ticker"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You are not authorised to query ticker metadata.")
    
    try:
        searched_ticker_metadata = await get_ticker_search(ticker)
    
    except Exception:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="The ticker you queried does not exist.")
    
    return searched_ticker_metadata

@router.get("/asset-data/fuzzy-search/{fuzzyquery}", response_model=list[AssetMetadataRead], tags=["asset-data"])
async def get_multiticker_metadata_fuzzy_route(
    fuzzyquery: str,
    current_user: User = Depends(fastapi_users.current_user())
):
    if not permission_check_util(current_user, "can_query_ticker"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You are not authorised to query ticker metadata.")
    
    try:
        fuzzy_searched_metadata = await get_multiticker_search_fuzzy(fuzzyquery)

    except Exception:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Your query did not find any assets.")

    if isinstance(fuzzy_searched_metadata, dict):
        # if it returns a single dict, wrap it in a list
        fuzzy_searched_metadata = [AssetMetadataRead.model_validate(fuzzy_searched_metadata)]

    if isinstance(fuzzy_searched_metadata, list):
        # then return the proper object after checking/forcing it to be a list

        return [AssetMetadataRead.model_validate(asset) for asset in fuzzy_searched_metadata]
    
    raise HTTPException(status_code=500, detail="Unexpected data format from service")
