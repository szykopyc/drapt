import { useParams } from "react-router-dom";
import { CardOne } from "../baseui/CustomCard";
import React, { useEffect } from "react";
import { roleMapperDict } from "../../helperfunctions/RoleMapper";

import { LoadingSpinner } from "../helperui/LoadingSpinnerHelper";
import TextWithLabelDescription from "../baseui/TextWithLabelDescription";

import { hookSearchPortfolioOverview } from "../../reactqueryhooks/usePortfolioHook";

export function OverviewPanel() {
  const { portfolioID } = useParams();

  const { data: portfolioOverviewData = [], isLoading } =
    hookSearchPortfolioOverview(portfolioID);

  useEffect(() => {
    console.log(portfolioOverviewData);
  }, [portfolioOverviewData]);


  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <CardOne
            title={portfolioOverviewData?.name ? `${portfolioOverviewData.name} Portfolio Overview` : "N/A"}
            size="full"
          >
            {portfolioOverviewData?.description &&
              (
                <>
                  <TextWithLabelDescription label={"Description"}>{portfolioOverviewData.description}</TextWithLabelDescription>
                  <div className="divider my-0"></div>
                </>

              )}
            <div className="flex flex-col md:flex-row justify-between gap-3">
              <div className="w-full md:w-1/2 flex flex-col gap-3">
                <TextWithLabelDescription label={"Type"}>
                  Equity
                </TextWithLabelDescription>
                <TextWithLabelDescription label={"Manager"}>
                  {portfolioOverviewData?.members &&
                    portfolioOverviewData.members.length > 0 ? portfolioOverviewData.members[0].fullname : "N/A"}
                </TextWithLabelDescription>
                <TextWithLabelDescription label={"Created On"}>
                  {portfolioOverviewData?.created_at ? (new Date(portfolioOverviewData?.created_at).toLocaleDateString('en-GB')) : "N/A"}
                </TextWithLabelDescription>
                <TextWithLabelDescription label={"Last Modified"}>
                  YTC
                </TextWithLabelDescription>
                <TextWithLabelDescription label={"Team Members"}>

                  {Array.isArray(
                    portfolioOverviewData?.members
                  ) &&
                    portfolioOverviewData.members
                      .length > 0
                    ? portfolioOverviewData.members.map(
                      (member, idx, arr) => (
                        <span key={member.id}>
                          {member.fullname}
                          {idx <
                            arr.length -
                            1 && ", "}
                        </span>
                      )
                    )
                    : "No team members"}
                </TextWithLabelDescription>
              </div>

              <div className="w-full md:w-1/2 flex flex-col gap-3">
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
                  <span >YTC</span>
                </TextWithLabelDescription><TextWithLabelDescription label={"Number of Trades"}>
                  YTC
                </TextWithLabelDescription>
              </div>
            </div>
          </CardOne>
        </>
      )}
    </>
  );
}
