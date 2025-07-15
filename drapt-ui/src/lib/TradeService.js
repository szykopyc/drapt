import ApiClient from "../../api/ApiClient";

export async function BookTrade(tradedata) {
  const response = await ApiClient.post(
    `/trade`, tradedata, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true
  }
  )
  return response.data;
}

export async function getTradesByPortfolioID(portfolio_id) {
  const response = await ApiClient.get(
    `/trade/${portfolio_id}/getbyportfolioid`, {
    withCredentials: true
  }
  );
  return response.data;
}
