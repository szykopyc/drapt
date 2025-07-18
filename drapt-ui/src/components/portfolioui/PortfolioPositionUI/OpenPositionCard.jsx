import { CardOneTooltip } from "../../baseui/CustomCard";
import InnerEmptyState from "../../errorui/InnerEmptyState";
import { MdInfoOutline } from "react-icons/md";
import { LoadingSpinner } from "../../helperui/LoadingSpinnerHelper";
import { currencyMapperDict } from "../../../helperfunctions/CurrencyMapper";
import { useHookGetOpenPositionsByPortfolioID } from "../../../reactqueryhooks/usePositionHook";

export default function OpenPositionCard(portfolioOverviewData) {
    const {
        data: open_position_data = [],
        isLoading,
        isError,
        error,
    } = useHookGetOpenPositionsByPortfolioID(portfolioOverviewData?.id);

    const currencyPriceFormatter = (currency, price) => {
        return (
            currencyMapperDict[currency] + String(parseFloat(price).toFixed(2))
        );
    };

    return (
        <CardOneTooltip
            title={"Open Positions"}
            tooltip={
                "Ticker is the asset symbol. Exchange shows where the asset is traded. Direction indicates if the position is LONG or SHORT. Entry Price is the price at which the position was opened, while Avg Entry Price is the average price for all entries. Initial Quantity is the original size of the position, and Open Quantity is the current open size. Total Cost is the total amount spent to open the position. Unrealised PnL shows the profit or loss if the position were closed now. Entry Date is when the position was opened, and Last Updated is the most recent modification date."
            }
        >
            {isLoading ? (
                <LoadingSpinner />
            ) : isError || open_position_data?.length === 0 ? (
                <InnerEmptyState
                    title="No Open Positions"
                    message={
                        "There are currently no open positions in this portfolio."
                    }
                    icon={<MdInfoOutline className="text-4xl text-info" />}
                />
            ) : (
                <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                    <table className="table-sm md:table table-zebra table-auto md:table-fixed">
                        <thead>
                            <tr>
                                <th>Ticker</th>
                                <th>Exchange</th>
                                <th>Direction</th>
                                <th>Entry Price</th>
                                <th>Avg Price</th>
                                <th>Initial Quantity</th>
                                <th>Open Quantity</th>
                                <th>Total Cost</th>
                                <th>Unrealised PnL</th>
                                <th>Entry Date</th>
                                <th>Last Updated</th>
                            </tr>
                        </thead>
                        <tbody>
                            {open_position_data.toReversed().map((position) => (
                                <tr key={position.id}>
                                    <td>{position.ticker}</td>
                                    <td>{position.exchange}</td>
                                    <td>
                                        <span
                                            className={`badge font-semibold ${
                                                position.direction === "LONG"
                                                    ? "badge-success rounded-none"
                                                    : "badge-error rounded-none text-white"
                                            }`}
                                        >
                                            {position.direction}
                                        </span>
                                    </td>
                                    <td>
                                        {currencyPriceFormatter(
                                            position.currency,
                                            position.entry_price
                                        )}
                                    </td>
                                    <td>
                                        {currencyPriceFormatter(
                                            position.currency,
                                            position.average_entry_price
                                        )}
                                    </td>
                                    <td>
                                        {parseFloat(
                                            position.initial_quantity
                                        ).toFixed(2)}
                                    </td>
                                    <td>
                                        {parseFloat(
                                            position.open_quantity
                                        ).toFixed(2)}
                                    </td>
                                    <td>
                                        {parseFloat(
                                            position.total_cost
                                        ).toFixed(2)}
                                    </td>
                                    <td>YTC</td>
                                    <td>
                                        {position.entry_date
                                            ? new Date(
                                                  position.entry_date
                                              ).toLocaleDateString("en-GB") +
                                              " " +
                                              new Date(
                                                  position.entry_date
                                              ).toLocaleTimeString()
                                            : ""}
                                    </td>
                                    <td>
                                        {position.updated_at
                                            ? new Date(
                                                  position.updated_at
                                              ).toLocaleDateString("en-GB") +
                                              " " +
                                              new Date(
                                                  position.updated_at
                                              ).toLocaleTimeString()
                                            : ""}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </CardOneTooltip>
    );
}
