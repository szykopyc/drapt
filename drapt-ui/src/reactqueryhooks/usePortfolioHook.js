import { useQuery } from "@tanstack/react-query";
import { indexOfAllPortfolios } from "../lib/PortfolioServices";

export function hookIndexOfAllPortfolios() {
    return useQuery({
        queryKey: ["allportfolios"],
        queryFn: async () => {
            await new Promise((resolve) => setTimeout(resolve, 500));
            return indexOfAllPortfolios();
        },
        staleTime: 1000 * 60 * 3,
    });
}