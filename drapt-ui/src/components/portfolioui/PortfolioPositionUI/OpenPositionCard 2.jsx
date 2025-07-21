import { CardOneTooltip } from "../../baseui/CustomCard";
import InnerEmptyState from "../../errorui/InnerEmptyState";
import { MdInfoOutline } from "react-icons/md";
import { LoadingSpinner } from "../../helperui/LoadingSpinnerHelper";
import { currencyMapperDict } from "../../../helperfunctions/CurrencyMapper";
import { useHookGetOpenPositionsByPortfolioID } from "../../../reactqueryhooks/usePositionHook";
import { useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import {
    numberFormatter,
    currencyPriceFormatter,
    timeAndDateFormatter,
} from "../../../helperfunctions/VariousTextFormatter";

import {
    directionCellRenderer,
    pnlCellRenderer,
    returnCellRenderer,
} from "../../../helperfunctions/AGCellRenderers";

export default function OpenPositionCard(portfolioOverviewData) {
    const {
        data: open_position_data = [],
        isLoading,
        isError,
    } = useHookGetOpenPositionsByPortfolioID(portfolioOverviewData?.id);

    const columnDefs = useMemo(
        () => [
            {
                headerName: "Ticker",
                field: "ticker",
                sortable: true,
                filter: true,
                minWidth: 100,
            },
            {
                headerName: "Exchange",
                field: "exchange",
                sortable: true,
                filter: true,
                minWidth: 100,
            },
            {
                headerName: "Direction",
                field: "direction",
                cellRenderer: directionCellRenderer,
                sortable: true,
                filter: true,
                minWidth: 110,
            },
            {
                headerName: "Initial Qty",
                field: "initial_quantity",
                valueFormatter: ({ value }) => numberFormatter.format(value),
                sortable: true,
                minWidth: 110,
            },
            {
                headerName: "Open Qty",
                field: "open_quantity",
                valueFormatter: ({ value }) => numberFormatter.format(value),
                sortable: true,
                minWidth: 110,
            },
            {
                headerName: "Entry Price",
                field: "entry_price",
                valueFormatter: ({ data }) =>
                    currencyPriceFormatter(data.currency, data.entry_price),
                sortable: true,
                minWidth: 120,
            },
            {
                headerName: "Avg Price",
                field: "average_entry_price",
                valueFormatter: ({ data }) =>
                    currencyPriceFormatter(
                        data.currency,
                        data.average_entry_price
                    ),
                sortable: true,
                minWidth: 120,
            },
            {
                headerName: "Total Cost",
                field: "total_cost",
                valueFormatter: ({ value }) => numberFormatter.format(value),
                sortable: true,
                minWidth: 120,
            },
            {
                headerName: "Unrealised PnL",
                field: "unrealised_pnl",
                cellRenderer: pnlCellRenderer,
                sortable: true,
                minWidth: 130,
            },
            {
                headerName: "Unrealised Return",
                field: "unrealised_return",
                valueGetter: ({ data }) =>
                    data.open_quantity && data.average_entry_price
                        ? (data.unrealised_pnl /
                              (data.open_quantity * data.average_entry_price)) *
                          100
                        : 0,
                cellRenderer: returnCellRenderer,
                sortable: true,
                minWidth: 130,
            },
            {
                headerName: "Entry Date",
                field: "entry_date",
                valueFormatter: ({ value }) => timeAndDateFormatter(value),
                sortable: true,
                minWidth: 160,
                sort: "desc",
                sortIndex: 0,
            },
            {
                headerName: "Last Updated",
                field: "updated_at",
                valueFormatter: ({ value }) => timeAndDateFormatter(value),
                sortable: true,
                minWidth: 160,
            },
        ],
        []
    );

    const defaultColDef = useMemo(
        () => ({
            flex: 1,
            filter: true,
            resizable: true,
            minWidth: 100,
            sortable: true,
            sortingOrder: ["desc", "asc", null],
        }),
        []
    );

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
                <>
                    {open_position_data.length !== 0 ? (
                        <p>
                            Value of open positions last updated:{" "}
                            {timeAndDateFormatter(
                                open_position_data[0]?.valid_price_date
                            )}
                        </p>
                    ) : null}
                    <div
                        className="ag-theme-quartz"
                        style={{
                            width: "100%",
                            maxHeight: "500px",
                            minHeight: "auto",
                            height: "auto",
                            overflow: "auto",
                        }}
                    >
                        <AgGridReact
                            rowData={open_position_data}
                            columnDefs={columnDefs}
                            defaultColDef={defaultColDef}
                            domLayout="autoHeight"
                            getRowHeight={() => 32}
                            headerHeight={32}
                            animateRows={true}
                            suppressCellFocus={true}
                            pagination={false}
                            suppressHorizontalScroll={true}
                        />
                    </div>
                </>
            )}
        </CardOneTooltip>
    );
}
