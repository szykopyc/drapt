import { CardOne } from "../../baseui/CustomCard";
import { roleMapperDict } from "../../../helperfunctions/RoleMapper";
import TextWithLabelDescription from "../../baseui/TextWithLabelDescription";
import RoleRankSorter from "../../../helperfunctions/RoleRankSorter";

export default function OverviewCard({ portfolioOverviewData }) {

  const portfolioManager = portfolioOverviewData?.members?.find((member) => member.role == "pm");

  return (
    <CardOne title={portfolioOverviewData?.name ? `${portfolioOverviewData.name} Portfolio Overview` : "N/A"}
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
                  <div key={member.id} className="flex justify-between">
                    <span>
                      {member.fullname}                  </span>
                    <span>{roleMapperDict[member.role]}
                    </span>
                  </div>
                ))
              ) : (
                "No team members"
              )}
            </div>
          </TextWithLabelDescription>
        </div>
      </div>
    </CardOne>
  );
}
