import { useQuery } from "@tanstack/react-query";
import { getAssetMetadataFuzzy } from "../lib/AssetDataService";

export function useHookGetAssetMetadataFuzzy(fuzzysearch) {
  return useQuery({
    queryKey: ["asset_metadata_fuzzy", fuzzysearch],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return getAssetMetadataFuzzy(fuzzysearch);
    },
    staleTime: 1000 * 60 * 60 * 24,
    retry: 1
  })
}
