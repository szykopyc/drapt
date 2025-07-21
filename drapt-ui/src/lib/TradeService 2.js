import ApiClient from "../../api/ApiClient";

export async function BookTrade(tradedata) {
  const response = await ApiClient.post(
    `/trades`, tradedata, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true
  }
  )
  return response.data;
}

export async function getTradesByPortfolioID(portfolio_id) {
  const response = await ApiClient.get(
    `/portfolios/${portfolio_id}/trades`, {
    withCredentials: true
  }
  );
  return response.data;
}
