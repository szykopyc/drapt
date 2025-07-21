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
