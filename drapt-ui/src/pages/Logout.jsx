import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "../stores/userStore";
import { logout as logoutApi } from "../lib/AuthService";

export default function LogoutHandler() {
    const logoutStore = useUserStore((state) => state.logout);
    const navigate = useNavigate();

    useEffect(() => {
        // Call backend logout, then clear store and navigate
        logoutApi().finally(() => {
            logoutStore();
            navigate("/", { replace: true });
        });
    }, [logoutStore, navigate]);

    return null;
}
