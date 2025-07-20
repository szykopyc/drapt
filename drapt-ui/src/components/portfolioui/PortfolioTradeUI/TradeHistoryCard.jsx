import { CardOne } from "../../baseui/CustomCard";
import CustomTable from "../../baseui/CustomTable";
import { useHookGetTradesByPortfolioID } from "../../../reactqueryhooks/useTradeHook";
import InnerEmptyState from "../../errorui/InnerEmptyState";
import { MdInfo, MdInfoOutline } from "react-icons/md";
import { LoadingSpinner } from "../../helperui/LoadingSpinnerHelper";
import { currencyMapperDict } from "../../../helperfunctions/CurrencyMapper";
import { venueMapperDict } from "../../../helperfunctions/VenueMapper";
import { ModalHelper } from "../../helperui/ModalHelper";
import { useState, useRef, useMemo } from "react";

export default function TradeHistoryCard(portfolioOverviewData) {
    const {
        data: trade_history_data = [],
        isLoading,
        isError,
        error,
    } = useHookGetTradesByPortfolioID(portfolioOverviewData.id);

    const [tradeNoteData, setTradeNoteData] = useState(null);
    const tradeNoteDialogueRef = useRef(null);

    const portfolio_members = Array.isArray(portfolioOverviewData?.members)
        ? portfolioOverviewData?.members
        : [];

    const currencyPriceFormatter = (currency, price) => {
        return (
            currencyMapperDict[currency] + String(parseFloat(price).toFixed(2))
        );
    };
    const memberNameMap = useMemo(() => {
        const map = {};
        portfolio_members.forEach((m) => (map[m.id] = m.fullname));
        return map;
    }, [portfolio_members]);

    const portfolioMemberFullnameFinder = (id) =>
        memberNameMap[id] || `User ID ${id}`;

    const handleShowNoteDialogue = (trade_data) => {
        setTradeNoteData(trade_data);

        if (tradeNoteDialogueRef.current)
            tradeNoteDialogueRef.current.showModal();
    };

    return (
        <>
            <CardOne title={"Trade History"}>
                {isLoading ? (
                    <LoadingSpinner />
                ) : isError || trade_history_data?.length === 0 ? (
                    <InnerEmptyState
                        title="No Trades Yet"
                        message={"No trade history available for is portfolio."}
                        icon={<MdInfoOutline className="text-4xl text-info" />}
                    />
                ) : (
                    <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                        <table className="table-sm md:table table-zebra table-auto">
                            <thead>
                                <tr>
                                    <th>Ticker</th>
                                    <th>Exchange</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Notional</th>
                                    <th>Direction</th>
                                    <th>Analyst</th>
                                    <th>Trader</th>
                                    <th>Date and Time</th>
                                    <th>Venue/Broker</th>
                                    <th>Notes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {trade_history_data
                                    .toReversed()
                                    .map((trade) => (
                                        <tr
                                            key={`${trade.id}-${trade.execution_date}`}
                                        >
                                            <td>{trade.ticker}</td>
                                            <td>{trade.exchange}</td>
                                            <td>
                                                {currencyPriceFormatter(
                                                    trade.currency,
                                                    trade.price
                                                )}
                                            </td>
                                            <td>
                                                {parseFloat(
                                                    trade.quantity
                                                ).toFixed(2)}
                                            </td>
                                            <td>
                                                {currencyPriceFormatter(
                                                    trade.currency,
                                                    trade.notional
                                                )}
                                            </td>
                                            <td>
                                                <span
                                                    className={`badge font-semibold ${
                                                        trade.direction ===
                                                        "BUY"
                                                            ? "badge-success rounded-none"
                                                            : "badge-error rounded-none text-white"
                                                    }`}
                                                >
                                                    {trade.direction}
                                                </span>
                                            </td>
                                            <td>
                                                {portfolioMemberFullnameFinder(
                                                    trade.analyst_id
                                                )}
                                            </td>
                                            <td>
                                                {portfolioMemberFullnameFinder(
                                                    trade.trader_id
                                                )}
                                            </td>
                                            <td>
                                                {new Date(
                                                    trade.execution_date
                                                ).toLocaleDateString("en-GB") +
                                                    " " +
                                                    new Date(
                                                        trade.execution_date
                                                    ).toLocaleTimeString()}
                                            </td>
                                            <td>
                                                {venueMapperDict[trade.venue]}
                                            </td>
                                            <td>
                                                {trade.notes ? (
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-success rounded-none"
                                                        onClick={() =>
                                                            handleShowNoteDialogue(
                                                                trade
                                                            )
                                                        }
                                                    >
                                                        View
                                                    </button>
                                                ) : (
                                                    "N/A"
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </CardOne>
            <ModalHelper
                id={"trade_note_data"}
                reference={tradeNoteDialogueRef}
                modalTitle={
                    tradeNoteData
                        ? `${tradeNoteData.ticker} ${
                              tradeNoteData.direction
                          } ${new Date(
                              tradeNoteData.execution_date
                          ).toLocaleDateString("en-GB")} Notes`
                        : "Trade Notes"
                }
            >
                {tradeNoteData && <p>{tradeNoteData.notes}</p>}
            </ModalHelper>
        </>
    );
}
