import { MainBlock } from "../components/baseui/MainBlock";
import { BeginText } from "../components/baseui/BeginText";
import TabNav from "../components/baseui/TabNav";
import { Outlet, useParams, useLocation } from "react-router-dom";
import useUserStore from "../stores/userStore";

import { dummyGlobalPortfolios } from "../assets/dummy-data/tableData";

export default function Portfolio() {
    const user = useUserStore((state) => state.user);
    if (!user) return null;

    const { portfolioID } = useParams();
    const location = useLocation();

    const selectedPortfolioData = dummyGlobalPortfolios.filter((portfolio) =>
        portfolio.portfolioID.includes(portfolioID)
    )[0];

    const setCurrentPortfolioBeingAnalysed = useUserStore(
        (state) => state.setCurrentPortfolioBeingAnalysed
    );

    if (selectedPortfolioData) {
        console.log("Managing portfolio: ");
        console.log(selectedPortfolioData);
        setCurrentPortfolioBeingAnalysed(selectedPortfolioData);
    }

    const pathToTab = {
        overview: "overview",
        monitor: "monitor",
        tradebooker: "tradeBooker",
        administration: "portfolioAdmin",
    };

    const lastSegment = location.pathname.split("/").pop();
    const initialTab = pathToTab[lastSegment] || "overview";

    return (
        <MainBlock>
            <BeginText
                title={
                    selectedPortfolioData
                        ? `${selectedPortfolioData?.portfolioName} Portfolio`
                        : `Portfolio`
                }
            />
            <TabNav
                tabs={[
                    {
                        label: "Overview",
                        value: "overview",
                        to: `/portfolio/${portfolioID}/overview`,
                        keyShortcut: "o",
                    },
                    {
                        label: "Positions",
                        value: "monitor",
                        to: `/portfolio/${portfolioID}/monitor`,
                        keyShortcut: "p",
                    },
                    {
                        label: "Trade Booker",
                        value: "tradeBooker",
                        to: `/portfolio/${portfolioID}/tradebooker`,
                        keyShortcut: "t",
                    },
                    {
                        label: "Portfolio Admin",
                        value: "portfolioAdmin",
                        to: `/portfolio/${portfolioID}/administration`,
                        keyShortcut: "a",
                    },
                ]}
                initialTab={initialTab}
                showKeyboardShortcuts={true}
            />
            <Outlet />
        </MainBlock>
    );
}
