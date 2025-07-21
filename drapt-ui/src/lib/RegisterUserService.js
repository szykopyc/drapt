import ApiClient from "../../api/ApiClient"

export async function register(email, password, fullname, username, role, team) {
    try {
        let sendSuperUser = false;
        if (team === "executive") {
            sendSuperUser = true;
        }

        const response = await ApiClient.post(
            "/auth/register", {
                email: email,
                password: password,
                fullname: fullname,
                username: username,
                role: role,
                team: team,
                is_active: true,
                is_superuser: sendSuperUser,
                is_verified: true
            }, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
}