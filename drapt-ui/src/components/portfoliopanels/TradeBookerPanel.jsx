import { useParams } from "react-router-dom";
import { useRef /*, useEffect*/ } from "react";
import SectionMaintenanceWarning from "../baseui/SectionMaintenanceWarning";
import BookTradeCard from "../portfolioui/PortfolioTradeUI/BookTradeCard";
import TradeHistoryCard from "../portfolioui/PortfolioTradeUI/TradeHistoryCard";
import { LoadingSpinner } from "../helperui/LoadingSpinnerHelper";
import { MdErrorOutline } from "react-icons/md";
import { useHookSearchPortfolioOverview } from "../../reactqueryhooks/usePortfolioHook";
import { useHookGetTradesByPortfolioID } from "../../reactqueryhooks/useTradeHook";
import InnerEmptyState from "../errorui/InnerEmptyState";
import { Toaster } from "react-hot-toast";

export function TradeBookerPanel() {
  const { portfolioID } = useParams();

  const { data: portfolioOverviewData, isLoading, isError, error } = useHookSearchPortfolioOverview(portfolioID);

  const bookTradeRef = useRef(null);
  return (
    <>
      {
        isLoading ? (
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
              icon={<MdErrorOutline className="text-4xl text-error" />}
            />
          </div>
        ) : (

          <>
            <BookTradeCard {...portfolioOverviewData} />
            <TradeHistoryCard {...portfolioOverviewData} />
            <Toaster />
          </>
        )
      }
    </>
  );
}
