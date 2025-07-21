import {
    currencyPriceFormatter,
    numberFormatter,
    timeAndDateFormatter,
} from "./VariousTextFormatter";

export const directionCellRenderer = (params) => (
    <span
        className={`badge font-semibold h-full w-full ${
            params.value === "LONG" || params.value === "BUY"
                ? "badge-success rounded-none"
                : "badge-error rounded-none text-white"
        }`}
    >
        {params.value}
    </span>
);

export const pnlCellRenderer = (params) => (
    <span className={params.value >= 0 ? "text-success" : "text-error"}>
        {currencyPriceFormatter(params.data.currency, params.value)}
    </span>
);

export const returnCellRenderer = (params) => (
    <span className={params.value >= 0 ? "text-success" : "text-error"}>
        {numberFormatter.format(params.value)}%
    </span>
);
