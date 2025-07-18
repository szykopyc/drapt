import { useQuery } from "@tanstack/react-query";
import { getOpenPositionsByPortfolioID, getClosedPositionsByPortfolioID } from "../lib/PositionService";

export function useHookGetOpenPositionsByPortfolioID(portfolio_id) {
  return useQuery({
    queryKey: ["open_positions_by_pid", portfolio_id],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return getOpenPositionsByPortfolioID(portfolio_id);
    },
    staleTime: 1000 * 60 * 15,
    retry: 1
  })
}

export function useHookGetClosedPositionsByPortfolioID(portfolio_id) {
  return useQuery({
    queryKey: ["closed_positions_by_pid", portfolio_id],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return getClosedPositionsByPortfolioID(portfolio_id);
    },
    staleTime: 1000 * 60 * 15,
    retry: 1
  })
}
