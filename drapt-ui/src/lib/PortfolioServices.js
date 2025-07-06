import ApiClient from "../../api/ApiClient"

export async function initialisePortfolio(attributes){
    try {
        const response = await ApiClient.post(
            '/portfolio/create', attributes, {
                headers: {"Content-Type" : "application/json"},
                withCredentials:true,
            }
        )
        return response.data;
    } catch (error) {
        throw error;
    }
}