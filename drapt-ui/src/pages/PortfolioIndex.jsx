import { useNavigate } from "react-router-dom";
import MainBlock from "../components/layout/MainBlock";
import { BeginText } from "../components/baseui/BeginText";
import GlobalPortfolioCard from "../components/portfolioui/GlobalPortfolioCard";
import {
    CardNoTitleChildrenCentred,
    CardNoTitle,
} from "../components/baseui/CustomCard";
import { FaPlus, FaBuffer } from "react-icons/fa";
import { dummyGlobalPortfolios } from "../assets/dummy-data/tableData";
import InnerEmptyState from "../components/errorui/InnerEmptyState";
import { useState, useEffect } from "react";

import { LoadingSpinner } from "../components/helperui/LoadingSpinnerHelper";

import { useHookIndexOfAllPortfolios } from "../reactqueryhooks/usePortfolioHook";

export default function PortfolioIndex() {
    const dummyGlobalPortfoliosToRender = dummyGlobalPortfolios;

    const [sortingOption, setSortingOption] = useState("alphabetical");
    const [sortedPortfolios, setSortedPortfolios] = useState([]);
    {
        /**
const getSortedPortfolios = (portfoliosToSort, sortOption) => {
    if (!portfoliosToSort || portfoliosToSort.length === 0) return [];

    switch (sortOption) {
        case "alphabetical":
            return [...portfoliosToSort].sort((a, b) =>
                a.portfolioName.localeCompare(b.portfolioName)
            );
        case "monthReturn":
            return [...portfoliosToSort].sort(
                (a, b) => b.portfolio1MonthChange - a.portfolio1MonthChange
            );
        case "currentValue":
            return [...portfoliosToSort].sort(
                (a, b) => b.portfolioCurrentValue - a.portfolioCurrentValue
            );
        default:
            return portfoliosToSort;
    }
};
 */
    }

    const {
        data: allPortfoliosToRender = [],
        isLoading,
        error,
    } = useHookIndexOfAllPortfolios();

    {
        /*
useEffect(() => {
    const sorted = getSortedPortfolios(
        dummyGlobalPortfoliosToRender,
        sortingOption
    );
    setSortedPortfolios(sorted);
}, [sortingOption, dummyGlobalPortfoliosToRender]);
 */
    }

    const navigate = useNavigate();

    const handleNavigateToCreate = (e) => {
        if (e.key === "Enter" || e.key === " ") {
            navigate("/portfolio/create");
        }
    };

    return (
        <MainBlock>
            <BeginText title={"NEFSIF Fund Scope"}>
                <p>
                    View all of the portfolios currently being tracked by
                    <span className="text-accent font-semibold"> Drapt</span>,
                    then navigate between them.
                </p>
            </BeginText>
            <div className="divider my-0"></div>
            <div className="flex flex-col md:flex-row gap-3 w-full">
                <CardNoTitleChildrenCentred
                    additionalStyle="cursor-pointer hover:underline hover:bg-info/10 focus:underline focus:bg-info/10 decoration-info transition"
                    onClick={() => navigate("/portfolio/create")}
                    tabIndex={0}
                    onKeyDown={handleNavigateToCreate}
                >
                    <div className="flex flex-row justify-center items-center gap-3">
                        <FaPlus className="text-info text-lg" />
                        <span className="text-lg text-info">
                            Initialise New Portfolio
                        </span>
                    </div>
                </CardNoTitleChildrenCentred>
                <CardNoTitleChildrenCentred>
                    <div className="flex justify-center">
                        <div className="flex flex-row gap-3">
                            <label className="label">
                                <span className="label-text">
                                    Order portfolios by:
                                </span>
                            </label>
                            <select
                                className="select select-bordered cursor-pointer"
                                value={sortingOption}
                                onChange={(e) =>
                                    setSortingOption(e.target.value)
                                }
                            >
                                <option value="alphabetical">
                                    Alphabetical
                                </option>
                                <option value="monthReturn">
                                    Month Return
                                </option>
                                <option value="currentValue">
                                    Current Value
                                </option>
                            </select>
                        </div>
                    </div>
                </CardNoTitleChildrenCentred>
            </div>
            {isLoading && <LoadingSpinner />}
            {!isLoading && allPortfoliosToRender.length > 0
                ? allPortfoliosToRender.map((portfolio) => (
                      <GlobalPortfolioCard key={portfolio.id} {...portfolio} />
                  ))
                : !isLoading && (
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
