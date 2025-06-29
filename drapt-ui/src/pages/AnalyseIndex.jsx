import { MainBlock } from "../components/baseui/MainBlock";
import { BeginText } from "../components/baseui/BeginText";
import GlobalAnalysisCard from "../components/analyseui/GlobalAnalysisCard";
import { CardNoTitle } from "../components/baseui/CustomCard";
import InnerEmptyState from "../components/errorui/InnerEmptyState";
import { FaBuffer } from "react-icons/fa";
import CustomButton from "../components/baseui/CustomButton";

import { dummyGlobalPortfolios } from "../assets/dummy-data/tableData";

export default function AnalyseIndex() {
    const dummyGlobalPortfoliosToRender = dummyGlobalPortfolios;

    return (
        <MainBlock>
            <BeginText title={"Global Portfolio Analysis"}>
                <p>
                    Analyse any of the portfolios being tracked by{" "}
                    <span className="text-accent font-semibold">Drapt</span>.
                </p>
            </BeginText>
            <div className="divider my-0"></div>
            {dummyGlobalPortfoliosToRender.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-3 w-full">
                    {dummyGlobalPortfoliosToRender.map((portfolio) => (
                        <GlobalAnalysisCard
                            key={portfolio.portfolioID}
                            {...portfolio}
                        />
                    ))}
                </div>
            ) : (
                <CardNoTitle>
                    <InnerEmptyState
                        icon={
                            <FaBuffer className="text-4xl text-base-content/40" />
                        }
                        title="No portfolios to analyse"
                        message="No portfolios have been created yet."
                    >
                        <CustomButton to={"/portfolio/create"} tabIndex={0}>
                            Create new portfolio
                        </CustomButton>
                    </InnerEmptyState>
                </CardNoTitle>
            )}
        </MainBlock>
    );
}
