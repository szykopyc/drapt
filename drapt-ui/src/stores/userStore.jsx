import { create } from "zustand";
import { persist } from "zustand/middleware";

const useUserStore = create(
    persist(
        (set) => ({
            user: null,
            setUser: (user) => set({ user }),
            currentPortfolioBeingAnalysed: null,
            setCurrentPortfolioBeingAnalysed: (currentPortfolioBeingAnalysed) =>
                set({ currentPortfolioBeingAnalysed }),
            potentiallyShowSessionExpired: false,
            setPotentiallyShowSessionExpired: (potentiallyShowSessionExpired) =>
                set({ potentiallyShowSessionExpired }),
            logout: () =>
                set({ user: null, currentPortfolioBeingAnalysed: null }),
        }),
        {
            name: "user-storage",
        }
    )
);

export default useUserStore;
