import { CardOneTooltip } from "../../baseui/CustomCard";
import InnerEmptyState from "../../errorui/InnerEmptyState";
import { MdInfoOutline } from "react-icons/md";
import { LoadingSpinner } from "../../helperui/LoadingSpinnerHelper";
import { currencyMapperDict } from "../../../helperfunctions/CurrencyMapper";
import { useHookGetClosedPositionsByPortfolioID } from "../../../reactqueryhooks/usePositionHook";
import { AgGridReact } from "ag-grid-react";
import { useMemo } from "react";

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

export default function ClosedPositionCard(portfolioOverviewData) {
    const {
        data: closed_position_data = [],
        isLoading,
        isError,
        error,
    } = useHookGetClosedPositionsByPortfolioID(portfolioOverviewData?.id);

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
                headerName: "Entry Price",
                field: "entry_price",
                valueFormatter: ({ data }) =>
                    currencyPriceFormatter(data.currency, data.entry_price),
                sortable: true,
                minWidth: 120,
            },
            {
                headerName: "Exit Price",
                field: "exit_price",
                valueFormatter: ({ data }) =>
                    currencyPriceFormatter(data.currency, data.exit_price),
                sortable: true,
                minWidth: 120,
            },
            {
                headerName: "Initial Quantity",
                field: "initial_quantity",
                valueFormatter: ({ value }) => numberFormatter.format(value),
                sortable: true,
                minWidth: 120,
            },
            {
                headerName: "Realised PnL",
                field: "realised_pnl",
                cellRenderer: pnlCellRenderer,
                sortable: true,
                minWidth: 130,
            },
            {
                headerName: "Return %",
                field: "realised_return",
                valueGetter: ({ data }) =>
                    (data.realised_pnl /
                        (data.initial_quantity * data.entry_price)) *
                    100,
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
                headerName: "Close Date",
                field: "close_date",
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
                        rowData={closed_position_data}
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
            )}
        </CardOneTooltip>
    );
}
