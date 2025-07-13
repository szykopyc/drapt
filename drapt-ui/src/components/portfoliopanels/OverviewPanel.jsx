import { useParams } from "react-router-dom";
import { CardOne } from "../baseui/CustomCard";
import { roleMapperDict } from "../../helperfunctions/RoleMapper"; // for mapping user roles to something more useful
import { LoadingSpinner } from "../helperui/LoadingSpinnerHelper";
import TextWithLabelDescription from "../baseui/TextWithLabelDescription"; // could probably just use a function to map out all of the things. oh well, not very DRY but it'll do for now

import InnerEmptyState from "../errorui/InnerEmptyState";
import { MdErrorOutline } from "react-icons/md";

import RoleRankSorter from "../../helperfunctions/RoleRankSorter";

import { useHookSearchPortfolioOverview } from "../../reactqueryhooks/usePortfolioHook";

export function OverviewPanel() {
  const { portfolioID } = useParams();

  const { data: portfolioOverviewData = [], isLoading, isError, error } =
    useHookSearchPortfolioOverview(portfolioID);

  const portfolioManager = portfolioOverviewData?.members?.find((member) => member.role == "pm");

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
        <CardOne
          title={
            portfolioOverviewData?.name
              ? `${portfolioOverviewData.name} Portfolio Overview`
              : "N/A"
          }
          size="full"
        >
          {portfolioOverviewData?.description && (
            <>
              <TextWithLabelDescription label={"Description"}>
                {portfolioOverviewData.description}
              </TextWithLabelDescription>
              <div className="divider my-0"></div>
            </>
          )}
          <div className="flex flex-col md:flex-row justify-between gap-3">
            <div className="w-full md:w-1/3 flex flex-col gap-3">
              <TextWithLabelDescription label={"Type"}>
                Equity
              </TextWithLabelDescription>
              <TextWithLabelDescription label={"Manager"}>
                {portfolioManager
                  ? portfolioManager.fullname
                  : "N/A"}
              </TextWithLabelDescription>
              <TextWithLabelDescription label={"Created On"}>
                {portfolioOverviewData?.created_at
                  ? new Date(portfolioOverviewData.created_at).toLocaleDateString(
                    "en-GB"
                  )
                  : "N/A"}
              </TextWithLabelDescription>
              <TextWithLabelDescription label={"Last Modified"}>
                YTC
              </TextWithLabelDescription>
            </div>

            <div className="w-full md:w-1/3 flex flex-col gap-3">
              <TextWithLabelDescription label={"Current Value"}>
                YTC
              </TextWithLabelDescription>
              <TextWithLabelDescription label={"1M Return"}>
                <span className="text-success">YTC</span>
              </TextWithLabelDescription>
              <TextWithLabelDescription label={"1M Volatility"}>
                <span>YTC</span>
              </TextWithLabelDescription>
              <TextWithLabelDescription label={"Number of Holdings"}>
                <span>YTC</span>
              </TextWithLabelDescription>
            </div>

            <div className="w-full md:w-1/3 flex flex-col gap-3">
              <TextWithLabelDescription label={"Team Members"}>
                <div className="flex flex-col gap-1">
                  {portfolioOverviewData?.members?.length > 0 ? (
                    RoleRankSorter(portfolioOverviewData.members).map((member) => (
                      <span key={member.id}>
                        {member.fullname} - {roleMapperDict[member.role]}
                      </span>
                    ))
                  ) : (
                    "No team members"
                  )}
                </div>
              </TextWithLabelDescription>
            </div>
          </div>
        </CardOne>
      )}
    </>
  );
}
