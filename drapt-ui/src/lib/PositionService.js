import ApiClient from "../../api/ApiClient";

export async function getOpenPositionsByPortfolioID(portfolio_id) {
  const response = await ApiClient.get(
    `/positions/getopenpositions/${portfolio_id}`, {
    withCredentials: true
  }
  );
  return response.data;
}


export async function getClosedPositionsByPortfolioID(portfolio_id) {
  const response = await ApiClient.get(
    `/positions/getclosedpositions/${portfolio_id}`, {
    withCredentials: true
  }
  );
  return response.data;
}
