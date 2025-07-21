import ApiClient from "../../api/ApiClient";

export async function login(username, password) {
  try {
    const params = new URLSearchParams();
    params.append("grant_type", "password");
    params.append("username", username);
    params.append("password", password);
    params.append("scope", "");
    params.append("client_id", "");
    params.append("client_secret", "");

    await ApiClient.post(
      "/auth/jwt/login",
      params,
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        withCredentials: true,
      }
    );
    // No need to return anything
  } catch {
    throw "Incorrect login credentials, please try again";
  }
}

export async function checkAuth() {
  try {
    const response = await ApiClient.get("/auth/me", { withCredentials: true });
    return response.data; 
  } catch {
    throw "User not authenticated"; 
  }
}

export async function logout() {
  await ApiClient.post("/auth/jwt/logout", {}, { withCredentials: true });
}
