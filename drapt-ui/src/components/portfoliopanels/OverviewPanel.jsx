import { useParams } from "react-router-dom";
import { CardOne } from "../baseui/CustomCard";
import CustomTable from "../baseui/CustomTable";
import CustomButton from "../baseui/CustomButton";
import { dummyPortfolioActions } from "../../assets/dummy-data/tableData";
import React, { useState, useEffect, useRef } from 'react';
import { CSVLink } from "react-csv";
import FullscreenItem from "../helperui/FullscreenItemHelper";

export function OverviewPanel(){

    const overviewRef = useRef(null);
    const [overviewHeight, setOverviewHeight] = useState(0);

    const [ fullscreenItem, setFullScreenItem ] = useState("");

    const {portfolioID} = useParams();
    const portfolioName = "Industrials";
    const portfolioType = "Equity";
    const PM = "Szymon Kopyciński";
    const createdOn = "11/06/2025";
    const lastUpdated = "14/06/2025";
    const teamMembers = "Szymon, Benjamin, Ben, Edward, Sam, Noah, Adam";
    const currentValue = "£3400";
    const noOfHoldings = "12";
    const noOfTrades = "43";
    const oneYearReturn = "18.93%"
    const volatility = "14.31%";

    useEffect(() => {
        if (overviewRef.current) {
            setOverviewHeight(overviewRef.current.clientHeight);
        }
    }, []);

    function ExportCSVButton(){
        return (
            <CSVLink data={dummyPortfolioActions} filename="portfolio_actions.csv" className="self-end">
                <CustomButton colour="primary">
                    Export to CSV
                </CustomButton>
            </CSVLink>
        );
    }

    return (
        <>
        <div className="flex flex-col md:flex-row justify-between gap-3">
            <CardOne title={portfolioName}>
                <div ref={overviewRef}>
                <table className="w-full text-left">
                    <colgroup>
                      <col className="w-1/2 md:w-[30%]" />
                      <col className="w-1/2 md:w-[70%]" />
                    </colgroup>
                    <tbody>
                        <tr>
                            <td className="pr-2 font-medium">Type</td>
                            <td>{portfolioType}</td>
                        </tr>
                        <tr>
                            <td className="pr-2 font-medium">Manager</td>
                            <td>{PM}</td>
                        </tr>
                        <tr>
                            <td className="pr-2 font-medium">Created On</td>
                            <td>{createdOn}</td>
                        </tr>
                        <tr>
                            <td className="pr-2 font-medium">Last Modified</td>
                            <td>{lastUpdated}</td>
                        </tr>
                        <tr>
                            <td className="pr-2 font-medium">Team Members</td>
                            <td>{teamMembers}</td>
                        </tr>
                    </tbody>
                </table>
                <div className="divider my-0"></div>
                <table className="w-full text-left">
                    <colgroup>
                      <col className="w-1/2 md:w-[30%]" />
                      <col className="w-1/2 md:w-[70%]" />
                    </colgroup>
                    <tbody>
                        <tr>
                            <td className="pr-2 font-medium">Current Value</td>
                            <td>{currentValue}</td>
                        </tr>
                        <tr>
                            <td className="pr-2 font-medium">Number of Holdings</td>
                            <td>{noOfHoldings}</td>
                        </tr>
                        <tr>
                            <td className="pr-2 font-medium">Number of Trades</td>
                            <td>{noOfTrades}</td>
                        </tr>
                        <tr>
                            <td className="pr-2 font-medium">1Y Return</td>
                            <td>{oneYearReturn}</td>
                        </tr>
                        <tr>
                            <td className="pr-2 font-medium">Volatility</td>
                            <td>{volatility}</td>
                        </tr>
                    </tbody>
                </table>
                </div>
            </CardOne>
            <CardOne title={"Recent Activity"} onClick={() => setFullScreenItem("recentActivity")}>
                <CustomTable data={dummyPortfolioActions} maxHeight={overviewHeight ? `${overviewHeight}px` : "314px"}/>
            </CardOne>
            {fullscreenItem && (
                <FullscreenItem reference={setFullScreenItem} width={75}>
                    {fullscreenItem === "recentActivity" && (
                        <>
                            <div className="flex justify-between">
                                <h1 className="card-title text-2xl">Recent Actions</h1>
                                <ExportCSVButton />
                            </div>
                            <div className="divider my-3"></div>
                            <CustomTable data={dummyPortfolioActions} maxHeight={"75vh"}/>
                        </>
                    )}
                </FullscreenItem>
            )}
        </div>
        </>
    );
}