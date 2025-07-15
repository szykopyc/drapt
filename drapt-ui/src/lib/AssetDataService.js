import ApiClient from "../../api/ApiClient";

export async function getAssetMetadataFuzzy(fuzzysearch){
    const response = await ApiClient.get(
        `/asset-data/fuzzy-search/${fuzzysearch}`, {
            withCredentials: true
        }
    )
    return response.data;
}