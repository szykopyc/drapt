import { useNavigate } from "react-router-dom";
import { MainBlock } from "../components/baseui/MainBlock";
import { BeginText } from "../components/baseui/BeginText";
import GlobalPortfolioCard from "../components/portfolioui/GlobalPortfolioCard";
import { CardNoTitle, CardOne } from "../components/baseui/CustomCard";
import { FaPlus, FaBuffer } from "react-icons/fa";
import { dummyGlobalPortfolios } from "../assets/dummy-data/tableData";
import InnerEmptyState from "../components/errorui/InnerEmptyState";

export default function PortfolioIndex() {
    // API call to fetch portfolios here
    const dummyGlobalPortfoliosToRender = dummyGlobalPortfolios;

    const navigate = useNavigate();

    const handleNavigateToCreate = (e) => {
        if (e.key === "Enter" || e.key == " ") {
            navigate("/portfolio/create");
        }
    };

    return (
        <MainBlock>
            <BeginText title={"Global Portfolio Management"}>
                <p>
                    View all of the portfolios currently being tracked by{" "}
                    <span className="text-accent font-semibold">Drapt</span>,
                    then navigate between them.
                </p>
            </BeginText>
            <div className="divider my-0"></div>
            <CardNoTitle
                additionalStyle="cursor-pointer hover:underline hover:bg-info/10 focus:underline focus:bg-info/10 decoration-info transition"
                onClick={() => navigate("/portfolio/create")}
                tabIndex={0}
                onKeyDown={handleNavigateToCreate}
            >
                <div className="flex flex-row justify-center items-center gap-3">
                    <FaPlus className="text-info text-lg" />
                    <span className="text-lg text-info">Add New Portfolio</span>
                </div>
            </CardNoTitle>
            {dummyGlobalPortfoliosToRender.length > 0 ? (
                dummyGlobalPortfoliosToRender.map((portfolio) => (
                    <GlobalPortfolioCard
                        key={portfolio.portfolioID}
                        {...portfolio}
                    />
                ))
            ) : (
                <CardNoTitle>
                    <InnerEmptyState
                        icon={
                            <FaBuffer className="text-4xl text-base-content/40" />
                        }
                        title="No portfolios to display"
                        message="No portfolios have been created yet."
                    />
                </CardNoTitle>
            )}
        </MainBlock>
    );
}
