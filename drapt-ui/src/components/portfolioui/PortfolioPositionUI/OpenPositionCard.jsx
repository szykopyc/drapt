import { CardOneTooltip } from "../../baseui/CustomCard";
import InnerEmptyState from "../../errorui/InnerEmptyState";
import { MdInfoOutline } from "react-icons/md";
import { LoadingSpinner } from "../../helperui/LoadingSpinnerHelper";
import { currencyMapperDict } from "../../../helperfunctions/CurrencyMapper";
import { useHookGetOpenPositionsByPortfolioID } from "../../../reactqueryhooks/usePositionHook";
import { parse } from "date-fns";

export default function OpenPositionCard(portfolioOverviewData) {
  const {
    data: open_position_data = [],
    isLoading,
    isError,
  } = useHookGetOpenPositionsByPortfolioID(portfolioOverviewData?.id);

  const numberFormatter = new Intl.NumberFormat("en-GB", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const currencyPriceFormatter = (currency, price) => {
    return (
      currencyMapperDict[currency] + numberFormatter.format(parseFloat(price))
    );
  };

  const timeAndDateFormatter = (datetime) => {
    if (!datetime) return "N/A";

    const dateObj = datetime instanceof Date
      ? datetime
      : new Date(String(datetime).trim().replace(/^"+|"+$/g, ""));

    if (isNaN(dateObj.getTime())) return "Invalid Date";

    const datePart = dateObj.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    const timePart = dateObj.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    return `${datePart}`;
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
          message={"There are currently no open positions in this portfolio."}
          icon={<MdInfoOutline className="text-4xl text-info" />}
        />
      ) : (
        <>
          <p>Unrealised PnL last updated: <span className="font-semibold">{timeAndDateFormatter(open_position_data[0]?.valid_price_date)}</span></p>
          <div className="overflow-x-auto max-h-[500px] overflow-y-auto no-scrollbar">
            <table className="table-sm md:table table-zebra table-auto">
              <thead>
                <tr>
                  <th>Ticker</th>
                  <th>Exchange</th>
                  <th>Direction</th>
                  <th>Initial Qty</th>
                  <th>Open Qty</th>
                  <th>Entry Price</th>
                  <th>Avg Price</th>
                  <th>Total Cost</th>
                  <th>Unrealised PnL</th>
                  <th>Unrealised Return</th>
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
                        className={`badge font-semibold ${position.direction === "LONG"
                          ? "badge-success rounded-none"
                          : "badge-error rounded-none text-white"
                          }`}
                      >
                        {position.direction}
                      </span>
                    </td>
                    <td>{numberFormatter.format(position.initial_quantity)}</td>
                    <td>{numberFormatter.format(position.open_quantity)}</td>
                    <td>{currencyPriceFormatter(position.currency, position.entry_price)}</td>
                    <td>{currencyPriceFormatter(position.currency, position.average_entry_price)}</td>
                    <td>{numberFormatter.format(position.total_cost)}</td>
                    <td>
                      <span className={`${position.unrealised_pnl >= 0 ? "text-success" : "text-error"}`}>
                        {currencyPriceFormatter(position.currency, position.unrealised_pnl)}
                      </span>
                    </td>
                    <td>
                      <span className={`${position.unrealised_pnl >= 0 ? "text-success" : "text-error"}`}>
                        {numberFormatter.format(
                          (position.unrealised_pnl /
                            (position.open_quantity * position.average_entry_price)) *
                          100
                        )}%
                      </span>
                    </td>
                    <td>
                      {position.entry_date
                        ? new Date(position.entry_date).toLocaleDateString("en-GB") +
                        " " +
                        new Date(position.entry_date).toLocaleTimeString()
                        : ""}
                    </td>
                    <td>
                      {position.updated_at
                        ? new Date(position.updated_at).toLocaleDateString("en-GB") +
                        " " +
                        new Date(position.updated_at).toLocaleTimeString()
                        : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </CardOneTooltip>
  );
}
