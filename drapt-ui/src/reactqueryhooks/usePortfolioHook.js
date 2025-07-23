import { useQuery } from "@tanstack/react-query";
import { indexOfAllPortfolios, getPortfolioByStringIdOverview } from "../lib/PortfolioServices";

export function useHookIndexOfAllPortfolios() {
  return useQuery({
    queryKey: ["allportfolios"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return indexOfAllPortfolios();
    },
    staleTime: 1000 * 60 * 10,
    retry: 1,
  });
}

export function useHookSearchPortfolioOverview(portfolio_string_id) {
  return useQuery({
    queryKey: ["portfolio", portfolio_string_id],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return getPortfolioByStringIdOverview(portfolio_string_id);
    },
    staleTime: 1000 * 60 * 10,
    retry: 1,
  })
}
