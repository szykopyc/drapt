import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { LoadingSpinner } from "../helperui/LoadingSpinnerHelper";
import { MdErrorOutline } from "react-icons/md";
import { useHookSearchPortfolioOverview } from "../../reactqueryhooks/usePortfolioHook";
import InnerEmptyState from "../errorui/InnerEmptyState";
import { Toaster } from "react-hot-toast";
import { useMemo } from "react";
import OpenPositionCard from "../portfolioui/PortfolioPositionUI/OpenPositionCard";
import ClosedPositionCard from "../portfolioui/PortfolioPositionUI/ClosedPositionCard";

export default function PositionMonitoringPanel() {
    const { portfolioID } = useParams();

    const {
        data: portfolioOverviewData,
        isLoading,
        isError,
        error,
    } = useHookSearchPortfolioOverview(portfolioID);

    // Log the closed positions data for verification
    {
        /*
    useEffect(() => {
        if (closed_position_data) {
            console.log("Closed positions:", closed_position_data);
        }
        if (open_position_data) {
            console.log("Open positions:", open_position_data);
        }
    }, [closed_position_data, open_position_data]);

    useEffect(() => {
        if (errorForClosedPositions) {
            console.log("Error for closed:", errorForClosedPositions);
        }
        if (errorForOpenPositions) {
            console.log("Error for open:", errorForOpenPositions);
        }
    }, [errorForClosedPositions, errorForOpenPositions]);
*/
    }
    const portfolio_members = Array.isArray(portfolioOverviewData?.members)
        ? portfolioOverviewData?.members
        : [];

    const memberNameMap = useMemo(() => {
        const map = {};
        portfolio_members.forEach((m) => (map[m.id] = m.fullname));
        return map;
    }, [portfolio_members]);

    const portfolioMemberFullnameFinder = (id) =>
        memberNameMap[id] || `User ID ${id}`;

    return (
        <>
            {isLoading ? (
                <LoadingSpinner />
            ) : isError ? (
                <div className="flex flex-col items-center justify-center">
                    <InnerEmptyState
                        title="Error"
                        message={
                            error?.response?.data?.detail ||
                            error?.message ||
                            "An unknown error occurred."
                        }
                        icon={
                            <MdErrorOutline className="text-4xl text-error" />
                        }
                    />
                </div>
            ) : (
                <>
                    <OpenPositionCard {...portfolioOverviewData} />
                    <ClosedPositionCard {...portfolioOverviewData} />
                    <Toaster />
                </>
            )}
        </>
    );
}
