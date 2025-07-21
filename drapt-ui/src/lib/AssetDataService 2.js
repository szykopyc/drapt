import ApiClient from "../../api/ApiClient";

export async function getAssetMetadataFuzzy(fuzzysearch){
    const response = await ApiClient.get(
        `/asset-data/${fuzzysearch}`, {
            withCredentials: true
        }
    )
    return response.data;
}