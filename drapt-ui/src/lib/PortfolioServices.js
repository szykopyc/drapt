import ApiClient from "../../api/ApiClient"

export async function initialisePortfolio(attributes) {
  try {
    const response = await ApiClient.post(
      '/portfolios', attributes, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    }
    )
    return response.data;
  } catch (error) {
    throw error;
  }
}

// in terms of members, this only returns the pm
export async function indexOfAllPortfolios() {
  try {
    const response = await ApiClient.get(
      '/portfolios', {
      withCredentials: true,
    }
    )
    return response.data;
  } catch (error) {
    throw error;
  }
}

// in terms of members, this returns all members
export async function getPortfolioByStringIdOverview(portfolio_string_id) {
  try {
    const response = await ApiClient.get(
      `/portfolios/${portfolio_string_id}/overview`, {
      withCredentials: true,
    }
    )
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function updatePortfolioMetadata(portfolio_id, attributes) {
  const response = await ApiClient.patch(
    `/portfolio/${portfolio_id}`, attributes, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  }
  )
  return response.data;
}


export async function deletePortfolio(portfolio_id) {
  try {
    const response = await ApiClient.delete(
      `/portfolio/${portfolio_id}`, {
      withCredentials: true,
    }
    )
    return response.data;
  } catch (error) {
    throw error;
  }
}
