import { create } from "zustand";
import { persist } from "zustand/middleware";

const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      sessionExpired: false,
      setSessionExpired: (sessionExpired) => set({ sessionExpired }),
      logout: () =>
        set({
          sessionExpired: false,
          user: null,
        }),
    }),
    {
      name: "user-storage",
    }
  )
);

export default useUserStore;
