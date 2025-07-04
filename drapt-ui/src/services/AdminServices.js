import ApiClient from "../../api/ApiClient";

export async function selectAllUsers(){
    try {
        const response = await ApiClient.get(
            "/user/all",
            {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            }
        );
        return response.data;
    }
    catch {
        return null;
    }
}