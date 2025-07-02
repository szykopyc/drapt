import { MainBlock } from "../components/baseui/MainBlock";
import { BeginText } from "../components/baseui/BeginText";
import TabNav from "../components/baseui/TabNav";
import { Outlet, useParams, useLocation } from "react-router-dom";
import useUserStore from "../stores/userStore";
import CardEmptyState from "../components/errorui/CardEmptyState";

import { dummyGlobalPortfolios } from "../assets/dummy-data/tableData";

export default function Portfolio() {
    const user = useUserStore((state) => state.user);
    if (!user) return null;

    const showPortfolioAdmin =
        user && ["developer", "vd", "director"].includes(user?.role);

    const showTradeBooker =
        user && ["developer", "vd", "director", "pm"].includes(user?.role);

    const { portfolioID } = useParams();
    const location = useLocation();

    const selectedPortfolioData = dummyGlobalPortfolios.find((portfolio) =>
        portfolio.portfolioID.includes(portfolioID)
    );

    const setCurrentPortfolioBeingAnalysed = useUserStore(
        (state) => state.setCurrentPortfolioBeingAnalysed
    );

    if (selectedPortfolioData) {
        setCurrentPortfolioBeingAnalysed(selectedPortfolioData);
    } else {
        setCurrentPortfolioBeingAnalysed(undefined);
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
            {selectedPortfolioData ? (
                <>
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
                            ...(showTradeBooker
                                ? [
                                      {
                                          label: "Trade Booker",
                                          value: "tradeBooker",
                                          to: `/portfolio/${portfolioID}/tradebooker`,
                                          keyShortcut: "t",
                                      },
                                  ]
                                : []),
                            ...(showPortfolioAdmin
                                ? [
                                      {
                                          label: "Portfolio Admin",
                                          value: "portfolioAdmin",
                                          to: `/portfolio/${portfolioID}/administration`,
                                          keyShortcut: "a",
                                      },
                                  ]
                                : []),
                        ]}
                        initialTab={initialTab}
                        showKeyboardShortcuts={true}
                    />
                    <Outlet />
                </>
            ) : (
                <>
                    <div className="divider my-0"></div>
                    <CardEmptyState
                        title={"404: Portfolio Not Found"}
                        message={
                            "We couldn't find the portfolio you were looking for. Please try again, or come back later."
                        }
                    ></CardEmptyState>
                </>
            )}
        </MainBlock>
    );
}
