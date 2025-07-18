import { MainBlock } from "../components/baseui/MainBlock";
import { BeginText } from "../components/baseui/BeginText";
import TabNav from "../components/baseui/TabNav";
import { Outlet, useParams, useLocation } from "react-router-dom";
import useUserStore from "../stores/userStore";

import InnerEmptyState from "../components/errorui/InnerEmptyState";
import { MdErrorOutline } from "react-icons/md";
import { LoadingSpinner } from "../components/helperui/LoadingSpinnerHelper";
import CustomButton from "../components/baseui/CustomButton";
import { useHookSearchPortfolioOverview } from "../reactqueryhooks/usePortfolioHook";

export default function Portfolio() {
    const { portfolioID } = useParams();
    const location = useLocation();

    const {
        data: portfolioOverviewData = [],
        isLoading,
        isError,
        error,
    } = useHookSearchPortfolioOverview(portfolioID);

    const user = useUserStore((state) => state.user);
    if (!user) return null;

    const showPortfolioAdmin =
        user && ["developer", "vd", "director", "pm"].includes(user?.role);

    const showTradeBooker =
        user && ["developer", "vd", "director", "pm"].includes(user?.role);

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
            {isLoading ? (
                <LoadingSpinner />
            ) : isError ? (
                <>
                    <InnerEmptyState
                        title={"An Error Occurred"}
                        message={
                            error?.response?.data?.detail ||
                            error?.message ||
                            "An unknown error occurred."
                        }
                        icon={
                            <MdErrorOutline className="text-4xl text-error" />
                        }
                    >
                        <CustomButton to="/" colour="error">
                            Go to Home Page
                        </CustomButton>
                    </InnerEmptyState>
                </>
            ) : (
                <>
                    <BeginText
                        title={
                            portfolioOverviewData
                                ? `${portfolioOverviewData?.name}`
                                : `Undefined Portfolio`
                        }
                    />
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
                </>
            )}
        </MainBlock>
    );
}
