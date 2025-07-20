import { CardOneTooltip } from "../../baseui/CustomCard";
import InnerEmptyState from "../../errorui/InnerEmptyState";
import { MdInfoOutline } from "react-icons/md";
import { LoadingSpinner } from "../../helperui/LoadingSpinnerHelper";
import { currencyMapperDict } from "../../../helperfunctions/CurrencyMapper";
import { useHookGetClosedPositionsByPortfolioID } from "../../../reactqueryhooks/usePositionHook";

export default function ClosedPositionCard(portfolioOverviewData) {
    const {
        data: closed_position_data = [],
        isLoading,
        isError,
        error,
    } = useHookGetClosedPositionsByPortfolioID(portfolioOverviewData?.id);

    const currencyPriceFormatter = (currency, price) => {
        return (
            currencyMapperDict[currency] + String(parseFloat(price).toFixed(2))
        );
    };

    return (
        <CardOneTooltip
            title={"Closed Positions"}
            tooltip={
                "Ticker is the asset symbol. Exchange shows where the asset was traded. Direction indicates if the position was LONG or SHORT. Entry Price is the price at which the position was opened. Exit Price is the price at which it was closed. Initial Quantity is the original size of the position. Realised PnL shows the profit or loss made when the position was closed. Return % is the percentage gain or loss on the position. Entry DateTime is when the position was opened. Close DateTime is when the position was closed."
            }
        >
            {isLoading ? (
                <LoadingSpinner />
            ) : isError || closed_position_data?.length === 0 ? (
                <InnerEmptyState
                    title="No Closed Positions"
                    message={
                        "There are currently no closed positions in this portfolio."
                    }
                    icon={<MdInfoOutline className="text-4xl text-info" />}
                />
            ) : (
                <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                    <table className="table-sm md:table table-zebra table-auto">
                        <thead>
                            <tr>
                                <th>Ticker</th>
                                <th>Exchange</th>
                                <th>Direction</th>
                                <th>Entry Price</th>
                                <th>Exit Price</th>
                                <th>Initial Quantity</th>
                                <th>Realised PnL</th>
                                <th>Return %</th>
                                <th>Entry DateTime</th>
                                <th>Close DateTime</th>
                            </tr>
                        </thead>
                        <tbody>
                            {closed_position_data
                                .toReversed()
                                .map((position) => (
                                    <tr key={position.id}>
                                        <td>{position.ticker}</td>
                                        <td>{position.exchange}</td>
                                        <td>
                                            <span
                                                className={`badge font-semibold ${
                                                    position.direction ===
                                                    "LONG"
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
                                                position.exit_price
                                            )}
                                        </td>
                                        <td>
                                            {parseFloat(
                                                position.initial_quantity
                                            ).toFixed(2)}
                                        </td>
                                        <td>
                                            <span
                                                className={`${
                                                    position.realised_pnl >= 0
                                                        ? "text-success"
                                                        : "text-error"
                                                }`}
                                            >
                                                {currencyPriceFormatter(
                                                    position.currency,
                                                    position.realised_pnl
                                                )}
                                            </span>
                                        </td>
                                        <td>
                                            <span
                                                className={`${
                                                    position.realised_pnl >= 0
                                                        ? "text-success"
                                                        : "text-error"
                                                }`}
                                            >
                                                {(
                                                    (position.realised_pnl /
                                                        position.initial_quantity /
                                                        position.entry_price) *
                                                    100
                                                ).toFixed(2)}
                                                %
                                            </span>
                                        </td>
                                        <td>
                                            {position.entry_date
                                                ? new Date(
                                                      position.entry_date
                                                  ).toLocaleDateString(
                                                      "en-GB"
                                                  ) +
                                                  " " +
                                                  new Date(
                                                      position.entry_date
                                                  ).toLocaleTimeString()
                                                : ""}
                                        </td>
                                        <td>
                                            {position.updated_at
                                                ? new Date(
                                                      position.close_date
                                                  ).toLocaleDateString(
                                                      "en-GB"
                                                  ) +
                                                  " " +
                                                  new Date(
                                                      position.close_date
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
