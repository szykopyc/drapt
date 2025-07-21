import { CardOne } from "../../baseui/CustomCard";
import { useHookGetTradesByPortfolioID } from "../../../reactqueryhooks/useTradeHook";
import InnerEmptyState from "../../errorui/InnerEmptyState";
import { MdInfoOutline } from "react-icons/md";
import { LoadingSpinner } from "../../helperui/LoadingSpinnerHelper";
import { venueMapperDict } from "../../../helperfunctions/VenueMapper";
import ModalHelper from "../../helperui/ModalHelper";
import { useState, useRef, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import { timeAndDateFormatter } from "../../../helperfunctions/VariousTextFormatter";
import { directionCellRenderer } from "../../../helperfunctions/AGCellRenderers";
import { currencyPriceFormatter } from "../../../helperfunctions/VariousTextFormatter";

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
        headerName: "Price",
        field: "price",
        valueFormatter: ({ data }) =>
          currencyPriceFormatter(data.currency, data.price),
        sortable: true,
        minWidth: 120,
      },
      {
        headerName: "Quantity",
        field: "quantity",
        valueFormatter: ({ value }) => parseFloat(value).toFixed(2),
        sortable: true,
        minWidth: 120,
      },
      {
        headerName: "Notional",
        field: "notional",
        valueFormatter: ({ data }) =>
          currencyPriceFormatter(data.currency, data.notional),
        sortable: true,
        minWidth: 120,
      },
      {
        headerName: "Analyst",
        field: "analyst_id",
        valueGetter: ({ data }) =>
          portfolioMemberFullnameFinder(data.analyst_id),
        sortable: true,
        minWidth: 130,
      },
      {
        headerName: "Trader",
        field: "trader_id",
        valueGetter: ({ data }) =>
          portfolioMemberFullnameFinder(data.trader_id),
        sortable: true,
        minWidth: 130,
      },
      {
        headerName: "Date and Time",
        field: "execution_date",
        valueFormatter: ({ value }) => timeAndDateFormatter(value),
        sortable: true,
        minWidth: 160,
        sort: "desc",
        sortIndex: 0,
      },
      {
        headerName: "Broker",
        field: "venue",
        valueGetter: ({ data }) => venueMapperDict[data.venue],
        sortable: true,
        minWidth: 120,
      },
      {
        headerName: "Notes",
        field: "notes",
        cellRenderer: ({ data }) => {
          if (!data.notes) return "N/A";
          return (
            <button
              className="btn btn-info rounded-none w-full h-full"
              type="button"
            >
              View
            </button>
          );
        },
        onCellClicked: ({ data }) => {
          if (data.notes) handleShowNoteDialogue(data);
        },
        sortable: true,
        minWidth: 100,
      },
    ],
    [portfolioMemberFullnameFinder]
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
    <>
      <CardOne title={"Trade History"}>
        {isLoading ? (
          <LoadingSpinner />
        ) : isError || trade_history_data?.length === 0 ? (
          <InnerEmptyState
            title="No Trades Yet"
            message={
              "No trade history available for this portfolio."
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
              rowData={trade_history_data}
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
      </CardOne>
      <ModalHelper
        id={"trade_note_data"}
        reference={tradeNoteDialogueRef}
        modalTitle={
          tradeNoteData
            ? `${tradeNoteData.ticker} ${tradeNoteData.direction
            } ${new Date(
              tradeNoteData.execution_date
            ).toLocaleDateString("en-GB")} Notes`
            : "Trade Notes"
        }
      >
        {tradeNoteData && (
          <p className="whitespace-pre-line">{tradeNoteData.notes}</p>
        )}
      </ModalHelper>
    </>
  );
}
