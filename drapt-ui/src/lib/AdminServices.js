import ApiClient from "../../api/ApiClient";

// this has a RQ hook
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

// this doesn't need a RQ Hook
export async function updateUser(user_id, fieldsToPatch){
    try {
        const response = await ApiClient.patch(
            `/user/update/${user_id}`, fieldsToPatch, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
}

// this doesn't need a RQ hook
export async function searchUserByUsername(username){
    try {
        const response = await ApiClient.get(
            `/user/search/${username}`, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
}

// this has a RQ hook
export async function searchUserByRole(role){
    try {
        const response = await ApiClient.get(
            `/user/searchbyrole/${role}`, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            }
        )
        return response.data;
    }
    catch (error){
        throw error;
    }
}

// exec only service
// this doesn't need a RQ hook
export async function deleteUserByID(user_id){
    try {
        const response = await ApiClient.delete(
            `/user/delete/${user_id}`, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            }
        );
        return response.data;
    } catch (error){
        throw error;
    }
}