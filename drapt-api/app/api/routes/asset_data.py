from fastapi import APIRouter, Depends, HTTPException, status 
from typing import List
from app.config.permissions import permissions as role_permissions_dict
from app.users.deps import fastapi_users
from app.schemas.asset_data import AssetMetadataRead
from app.services.market_data import get_ticker_metadata, get_multiticker_metadata_fuzzy
from app.utils.log import external_api_logger as logger
from app.models.user import User

router = APIRouter()

@router.get("/asset-data/search/{ticker}", response_model=AssetMetadataRead, tags=["asset-data"])
async def get_ticker_metadata_route(
    ticker: str,
    current_user: User = Depends(fastapi_users.current_user())
):
    role_perms = role_permissions_dict.get(current_user.role)
    if not role_perms or not role_perms.get("can_query_ticker"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You are not authorised to query ticker metadata.")
    
    try:
        searched_ticker_metadata = await get_ticker_metadata(ticker)
    
    except Exception:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="The ticker you queried does not exist.")
    
    return searched_ticker_metadata

@router.get("/asset-data/fuzzy-search/{fuzzyquery}", response_model=List[AssetMetadataRead], tags=["asset-data"])
async def get_multiticker_metadata_fuzzy_route(
    fuzzyquery: str,
    current_user: User = Depends(fastapi_users.current_user())
):
    role_perms = role_permissions_dict.get(current_user.role)
    if not role_perms or not role_perms.get("can_query_ticker"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You are not authorised to query ticker metadata.")
    
    try:
        fuzzy_searched_metadata = await get_multiticker_metadata_fuzzy(fuzzyquery)

    except Exception:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Your query did not find any assets.")
    
    return fuzzy_searched_metadata