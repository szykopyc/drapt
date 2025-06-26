import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "../stores/userStore";

export default function LogoutHandler() {
    const logout = useUserStore((state) => state.logout);
    const navigate = useNavigate();

    useEffect(() => {
        logout();
        navigate("/", { replace: true });
    }, [logout, navigate]);

    return null;
}
