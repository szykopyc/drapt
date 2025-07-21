import { Outlet } from "react-router-dom";
import WidenedMainBlock from "../components/baseui/WidenedMainBlock";
import { BeginText } from "../components/baseui/BeginText";
import TabNav from "../components/baseui/TabNav";
import useUserStore from "../stores/userStore";

import { dummyGlobalPortfolios } from "../assets/dummy-data/tableData";
import { useEffect } from "react";

export default function Analyse() {
    const user = useUserStore((state) => state.user);
    if (!user) return null;

    const selectedPortfolioData = dummyGlobalPortfolios.filter((portfolio) =>
        portfolio.portfolioID.includes("industrial")
    )[0];

    const pathToTab = {
        performance: "performance",
        risk: "risk",
    };

    const lastSegment = location.pathname.split("/").pop();
    const initialTab = pathToTab[lastSegment] || "performance";

    return (
        <WidenedMainBlock>
            <BeginText
                title={
                    selectedPortfolioData
                        ? `Analyse ${selectedPortfolioData?.portfolioName} Portfolio`
                        : "Analyse"
                }
            />
            <TabNav
                tabs={[
                    {
                        label: "Performance",
                        value: "performance",
                        to: `/analyse/industrial/performance`,
                        keyShortcut: "p",
                    },
                    {
                        label: "Risk",
                        value: "risk",
                        to: `/analyse/industrial/risk`,
                        keyShortcut: "r",
                    },
                ]}
                initialTab={initialTab}
            />
            <Outlet />
        </WidenedMainBlock>
    );
}
