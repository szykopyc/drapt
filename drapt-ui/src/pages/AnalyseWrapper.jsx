import { Outlet, useLocation, useParams } from "react-router-dom";
import { MainBlock } from "../components/baseui/MainBlock";
import { BeginText } from "../components/baseui/BeginText";
import TabNav from "../components/baseui/TabNav";
import useUserStore from "../stores/userStore";

import { dummyGlobalPortfolios } from "../assets/dummy-data/tableData";

export default function Analyse() {
    const user = useUserStore((state) => state.user);
    if (!user) return null;

    const { portfolioID } = useParams();

    const selectedPortfolioData = dummyGlobalPortfolios.filter((portfolio) =>
        portfolio.portfolioID.includes(portfolioID)
    )[0];

    const setCurrentPortfolioBeingAnalysed = useUserStore(
        (state) => state.setCurrentPortfolioBeingAnalysed
    );

    if (selectedPortfolioData) {
        console.log("Analysing portfolio: ");
        console.log(selectedPortfolioData);
        setCurrentPortfolioBeingAnalysed(selectedPortfolioData);
    }

    const location = useLocation();

    const pathToTab = {
        performance: "performance",
        risk: "risk",
    };

    const lastSegment = location.pathname.split("/").pop();
    const initialTab = pathToTab[lastSegment] || "performance";

    return (
        <MainBlock>
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
                        to: `/analyse/${portfolioID}/performance`,
                        keyShortcut: "p",
                    },
                    {
                        label: "Risk",
                        value: "risk",
                        to: `/analyse/${portfolioID}/risk`,
                        keyShortcut: "r",
                    },
                ]}
                initialTab={initialTab}
            />
            <Outlet />
        </MainBlock>
    );
}
