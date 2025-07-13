import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "../stores/userStore";
import { logout as logoutApi } from "../lib/AuthService";
import { useQueryClient } from "@tanstack/react-query";

export default function LogoutHandler() {
  const user = useUserStore((state) => state.user);
  const queryClient = useQueryClient();
  const logoutStore = useUserStore((state) => state.logout);
  const setSessionExpired = useUserStore((state) => state.setSessionExpired);
  const navigate = useNavigate();

  useEffect(() => {
    // Call backend logout, then clear store and navigate
    logoutApi().finally(() => {
      queryClient.invalidateQueries(["portfolio"], user.team);
      logoutStore();
      setSessionExpired(false);
      navigate("/", { replace: true });
    });
  }, [logoutStore, navigate]);

  return null;
}
