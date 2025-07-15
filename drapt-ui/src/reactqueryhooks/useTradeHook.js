import { useQuery } from "@tanstack/react-query";
import { getTradesByPortfolioID } from "../lib/TradeService";

export function useHookGetTradesByPortfolioID(portfolio_id) {
  return useQuery({
    queryKey: ["trade_history_by_pid", portfolio_id],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return getTradesByPortfolioID(portfolio_id);
    },
    staleTime: 1000 * 60 * 15,
    retry: 3,
    retryDelay: 500
  })
}
