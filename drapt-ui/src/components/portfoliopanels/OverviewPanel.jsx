import { useParams } from "react-router-dom";
import { CardOne } from "../baseui/CustomCard";
import CustomTable from "../baseui/CustomTable";
import CustomButton from "../baseui/CustomButton";
import { dummyRecentOrders } from "../../assets/dummy-data/tableData";
import React, { useState, useEffect, useRef } from "react";
import { CSVLink } from "react-csv";
import FullscreenItem from "../helperui/FullscreenItemHelper";
import useUserStore from "../../stores/userStore";

export function OverviewPanel() {
    const overviewRef = useRef(null);
    const [overviewHeight, setOverviewHeight] = useState(0);

    const recentPortfolioActions = dummyRecentOrders.slice(0, 5);

    const [fullscreenItem, setFullScreenItem] = useState("");

    const selectedPortfolio = useUserStore(
        (state) => state.currentPortfolioBeingAnalysed
    );
    if (!selectedPortfolio) return null;

    useEffect(() => {
        if (overviewRef.current) {
            setOverviewHeight(overviewRef.current.clientHeight);
        }
    }, []);

    function ExportCSVButton() {
        return (
            <CSVLink
                data={dummyRecentOrders}
                filename="portfolio_actions.csv"
                className="self-end"
            >
                <CustomButton colour="primary">Export to CSV</CustomButton>
            </CSVLink>
        );
    }

    const columnNames = [
        { key: "ticker", label: "Ticker" },
        { key: "action", label: "Action" },
        { key: "orderStatus", label: "Order Status" },
        { key: "quantity", label: "Quantity" },
        { key: "price", label: "Price" },
        { key: "date", label: "Date" },
    ];

    return (
        <>
            <div className="flex flex-col md:flex-row justify-between gap-3">
                <CardOne title={selectedPortfolio?.portfolioName} size="half">
                    <div ref={overviewRef}>
                        <table className="w-full text-left text-base">
                            <colgroup>
                                <col className="w-1/2 md:w-[40%]" />
                                <col className="w-1/2 md:w-[60%]" />
                            </colgroup>
                            <tbody className="align-top">
                                <tr>
                                    <td className="pr-2 font-medium">Type</td>
                                    <td>{selectedPortfolio?.portfolioType}</td>
                                </tr>
                                <tr>
                                    <td className="pr-2 font-medium">
                                        Manager
                                    </td>
                                    <td>
                                        {selectedPortfolio?.portfolioManager}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="pr-2 font-medium">
                                        Created On
                                    </td>
                                    <td>
                                        {
                                            selectedPortfolio?.portfolioCreationDate
                                        }
                                    </td>
                                </tr>
                                <tr>
                                    <td className="pr-2 font-medium">
                                        Last Modified
                                    </td>
                                    <td>
                                        {
                                            selectedPortfolio?.portfolioLastModified
                                        }
                                    </td>
                                </tr>
                                <tr>
                                    <td className="pr-2 font-medium">
                                        Team Members
                                    </td>
                                    <td>{selectedPortfolio?.teamMembers}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="divider my-0"></div>
                        <table className="w-full text-left text-base">
                            <colgroup>
                                <col className="w-1/2 md:w-[40%]" />
                                <col className="w-1/2 md:w-[60%]" />
                            </colgroup>
                            <tbody className="align-top">
                                <tr>
                                    <td className="pr-2 font-medium">
                                        Current Value
                                    </td>
                                    <td>
                                        {selectedPortfolio?.portfolioCurrency}
                                        {
                                            selectedPortfolio?.portfolioCurrentValue
                                        }
                                    </td>
                                </tr>
                                <tr>
                                    <td className="pr-2 font-medium">
                                        1M Return
                                    </td>
                                    <td>
                                        {selectedPortfolio?.portfolio1MonthChange >=
                                        0 ? (
                                            <span className="text-success">
                                                +
                                                {selectedPortfolio?.portfolio1MonthChange.toFixed(
                                                    2
                                                )}
                                                %
                                            </span>
                                        ) : (
                                            <span className="text-error">
                                                {selectedPortfolio?.portfolio1MonthChange.toFixed(
                                                    2
                                                )}
                                                %
                                            </span>
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="pr-2 font-medium">
                                        Volatility
                                    </td>
                                    <td>
                                        {selectedPortfolio?.portfolio1MonthVolatility.toFixed(
                                            2
                                        )}
                                        %
                                    </td>
                                </tr>
                                <tr>
                                    <td className="pr-2 font-medium">
                                        Number of Holdings
                                    </td>
                                    <td>
                                        {
                                            selectedPortfolio?.portfolioHoldingsNumber
                                        }
                                    </td>
                                </tr>
                                <tr>
                                    <td className="pr-2 font-medium">
                                        Number of Trades
                                    </td>
                                    <td>
                                        {
                                            selectedPortfolio?.portfolioTradesNumber
                                        }
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </CardOne>
                <CardOne
                    title={"Recent Activity"}
                    onClick={() => setFullScreenItem("recentActivity")}
                    size="half"
                >
                    <CustomTable
                        data={recentPortfolioActions}
                        maxHeight={
                            overviewHeight ? `${overviewHeight}px` : "314px"
                        }
                        columns={columnNames}
                        noScrollbar={true}
                    />
                </CardOne>
                {fullscreenItem && (
                    <FullscreenItem reference={setFullScreenItem} width={75}>
                        {fullscreenItem === "recentActivity" && (
                            <>
                                <div className="flex justify-between">
                                    <h1 className="card-title text-2xl">
                                        Recent Activity
                                    </h1>
                                    <ExportCSVButton />
                                </div>
                                <div className="divider my-3"></div>
                                <CustomTable
                                    data={recentPortfolioActions}
                                    maxHeight={"75vh"}
                                    columns={columnNames}
                                />
                            </>
                        )}
                    </FullscreenItem>
                )}
            </div>
        </>
    );
}
