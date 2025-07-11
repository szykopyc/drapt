import { useParams } from "react-router-dom";
import InnerEmptyState from "../errorui/InnerEmptyState";
import { MdErrorOutline } from "react-icons/md";
import { LoadingSpinner } from "../helperui/LoadingSpinnerHelper";
import { useHookSearchPortfolioOverview } from "../../reactqueryhooks/usePortfolioHook";

//toasts
import { Toaster } from 'react-hot-toast';

import AdminManageTeamCard from "../portfolioui/PortfolioAdminUI/AdminManageTeam";
import AdminUpdatePortfolioDetails from "../portfolioui/PortfolioAdminUI/AdminUpdatePortfolioDetails";

export function PortfolioAdminPanel() {
  const { portfolioID } = useParams();

  const { isLoading, isError, error } = useHookSearchPortfolioOverview(portfolioID);

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : isError ? (
        <div className="flex flex-col items-center justify-center">
          <InnerEmptyState
            title={"An Error Occurred"}
            message={error?.response?.data?.detail || error?.message || "An unknown error occurred."}
            icon={<MdErrorOutline className="text-4xl text-error" />}
          />
        </div>
      ) : (
        <>
          <AdminUpdatePortfolioDetails />
          <AdminManageTeamCard />
        </>
      )}
      <Toaster />
    </>
  );
}
