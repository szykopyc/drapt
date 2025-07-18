import { CardOne } from "../baseui/CustomCard";
import { useRef, useState, useEffect, useMemo } from "react";
import InnerEmptyState from "../errorui/InnerEmptyState";
import useUserStore from "../../stores/userStore";

import { dummyPositionMonitoringTable } from "../../assets/dummy-data/tableData";

export default function PositionMonitoringPanel() {
  // Sorting function used for both open and closed positions
  const getSortedPositions = (positionsToSort) => {
    const sorted = [...positionsToSort];
    sorted.sort((a, b) => {
      if (a.positionTicker === b.positionTicker) {
        return (
          new Date(b.positionEntryDate) -
          new Date(a.positionEntryDate)
        );
      }
      return a.positionTicker.localeCompare(b.positionTicker);
    });
    return sorted;
  };

  const positions = dummyPositionMonitoringTable;

  const openPositions = useMemo(
    () =>
      getSortedPositions(
        positions.filter(
          (position) => position.positionStatus === "Open"
        )
      ),
    [positions]
  );

  const closedPositions = useMemo(
    () =>
      getSortedPositions(
        positions.filter(
          (position) => position.positionStatus !== "Open"
        )
      ),
    [positions]
  );


  const user = useUserStore((state) => state.user);
  if (!user) return null;

  const columnsOpenPosition = [
    { key: "positionTicker", label: "Ticker" },
    { key: "positionQuantity", label: "Quantity" },
    { key: "entryPrice", label: "Entry Price" },
    { key: "currentPrice", label: "Current Price" },
    { key: "positionPnLNominal", label: "P&L (Nominal)" },
    { key: "positionPnLPercentage", label: "P&L (%)" },
    { key: "positionStatus", label: "Status" },
    { key: "positionEntryDate", label: "Entry Date" },
  ];

  const columnsClosedPosition = [
    { key: "positionTicker", label: "Ticker" },
    { key: "positionQuantity", label: "Quantity" },
    { key: "entryPrice", label: "Entry Price" },
    { key: "currentPrice", label: "Current Price" },
    { key: "positionPnLNominal", label: "P&L (Nominal)" },
    { key: "positionPnLPercentage", label: "P&L (%)" },
    { key: "positionStatus", label: "Status" },
    { key: "positionEntryDate", label: "Entry Date" },
  ];

  return (
    <>
      <CardOne title={"Open Positions"}>
        {openPositions.length === 0 ? (
          <InnerEmptyState
            title="No positions yet"
            message="Looks like your portfolio doesn't yet have any positions."
          />
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full table-sm md:table table-zebra">
              <thead>
                <tr>
                  {columnsOpenPosition.map((col) => (
                    <th key={col.key}>{col.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {openPositions.map((pos, idx) => (
                  <tr key={idx}>
                    <td>{pos.positionTicker}</td>
                    <td>{pos.positionQuantity}</td>
                    <td>{pos.entryPrice}</td>
                    <td>{pos.currentPrice}</td>
                    <td>
                      {pos.positionPnLNominal >= 0 ? (
                        <span className="text-success">
                          +
                          {pos.positionPnLNominal.toFixed(
                            2
                          )}
                        </span>
                      ) : (
                        <span className="text-error">
                          {pos.positionPnLNominal.toFixed(
                            2
                          )}
                        </span>
                      )}
                    </td>
                    <td>
                      {pos.positionPnLPercentage >= 0 ? (
                        <span className="text-success">
                          +
                          {(
                            pos.positionPnLPercentage *
                            100
                          ).toFixed(2)}
                          %
                        </span>
                      ) : (
                        <span className="text-error">
                          {(
                            pos.positionPnLPercentage *
                            100
                          ).toFixed(2)}
                          %
                        </span>
                      )}
                    </td>
                    <td>{pos.positionStatus}</td>
                    <td>{pos.positionEntryDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardOne>
      <CardOne title={"Closed Positions"}>
        {closedPositions.length === 0 ? (
          <InnerEmptyState
            title="No closed positions"
            message="No positions have been closed yet."
          />
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full table-sm md:table table-zebra">
              <thead>
                <tr>
                  {columnsClosedPosition.map((col) => (
                    <th key={col.key}>{col.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {closedPositions.map((pos, idx) => (
                  <tr key={idx}>
                    <td>{pos.positionTicker}</td>
                    <td>{pos.positionQuantity}</td>
                    <td>{pos.entryPrice}</td>
                    <td>{pos.currentPrice}</td>
                    <td>
                      {pos.positionPnLNominal >= 0 ? (
                        <span className="text-success">
                          +
                          {pos.positionPnLNominal.toFixed(
                            2
                          )}
                        </span>
                      ) : (
                        <span className="text-error">
                          {pos.positionPnLNominal.toFixed(
                            2
                          )}
                        </span>
                      )}
                    </td>
                    <td>
                      {pos.positionPnLPercentage >= 0 ? (
                        <span className="text-success">
                          +
                          {(
                            pos.positionPnLPercentage *
                            100
                          ).toFixed(2)}
                          %
                        </span>
                      ) : (
                        <span className="text-error">
                          {(
                            pos.positionPnLPercentage *
                            100
                          ).toFixed(2)}
                          %
                        </span>
                      )}
                    </td>
                    <td>{pos.positionStatus}</td>
                    <td>{pos.positionEntryDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardOne>
    </>
  );
}
