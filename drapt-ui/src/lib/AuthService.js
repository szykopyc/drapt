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
    } catch (error) {
        throw error.response?.data?.detail || "Login failed";
    }
}

// Check if user is logged in by pinging a protected endpoint
export async function checkAuth() {
    try {
        // This endpoint should require authentication and return user info if logged in
        const response = await ApiClient.get("/me", { withCredentials: true });
        return response.data; // user info if authenticated
    } catch {
        throw "User not authenticated"; // not authenticated
    }
}

// Logout: backend should clear the cookie
export async function logout() {
    try {
        await ApiClient.post("/auth/jwt/logout", {}, { withCredentials: true });
    } catch {
        // ignore errors
    }
}