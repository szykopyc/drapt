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
            setColourTheme: (colourTheme) => set({ colourTheme }),
            sessionExpired: false,
            setSessionExpired: (sessionExpired) => set({ sessionExpired }),
            logout: () =>
                set({
                    user: null,
                    currentPortfolioBeingAnalysed: null,
                    sessionExpired: false,
                }),
        }),
        {
            name: "user-storage",
        }
    )
);

export default useUserStore;
