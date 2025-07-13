import { useParams } from "react-router-dom";
import { LoadingSpinner } from "../helperui/LoadingSpinnerHelper";

import InnerEmptyState from "../errorui/InnerEmptyState";
import { MdErrorOutline } from "react-icons/md";

import OverviewCard from "../portfolioui/PortfolioOverviewUI/OverviewCard";
import { useHookSearchPortfolioOverview } from "../../reactqueryhooks/usePortfolioHook";

export function OverviewPanel() {
  const { portfolioID } = useParams();

  const { data: portfolioOverviewData, isLoading, isError, error } =
    useHookSearchPortfolioOverview(portfolioID);


  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : isError ? (
        <div className="flex flex-col items-center justify-center">
          <InnerEmptyState
            title={"Error"}
            message={
              error?.response?.data?.detail ||
              error?.message ||
              "An unknown error occurred."
            }
            icon={<MdErrorOutline className="text-4xl text-error" />}
          />
        </div>
      ) : (
        <OverviewCard portfolioOverviewData={portfolioOverviewData} />
      )}
    </>
  );
}
