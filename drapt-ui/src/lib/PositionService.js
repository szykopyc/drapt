import ApiClient from "../../api/ApiClient";

export async function getPositionsByPortfolioID(portfolio_id, status) {
  const response = await ApiClient.get(
    `/portfolios/${portfolio_id}/positions?status=${status}`, {
    withCredentials: true
  }
  );
  return response.data;
}
