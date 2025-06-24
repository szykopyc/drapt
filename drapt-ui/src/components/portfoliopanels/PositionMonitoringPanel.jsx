import { CardOne } from "../baseui/CustomCard";
import { ClosePositionModal } from "../portfolioui/ClosePositionModal";
import { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FormField } from "../helperui/FormFieldHelper";
import { FormErrorHelper } from "../helperui/FormErrorHelper";
import LargeSubmit from "../baseui/LargeSubmitHelper";
import InnerEmptyState from "../errorui/InnerEmptyState";

import { dummyPositionMonitoringTable } from "../../assets/dummy-data/tableData";

export default function PositionMonitoringPanel() {
    const positions = dummyPositionMonitoringTable;

    const positionCloseModalRef = useRef(null);
    const [modalData, setModalData] = useState(null);
    const [sortOption, setSortOption] = useState("ticker");

    const closeModal = () => {
        if (positionCloseModalRef.current) positionCloseModalRef.current.close();
        setModalData(null);
        reset();
    }

    const {register, handleSubmit, reset, watch, formState: {errors}} = useForm({
        mode:"onSubmit",
        reValidateMode: "onChange",
        defaultValues: {
            manualQuantity: 0,
            quantityToClose: "manualQuantitySelect"
        }
    });

    useEffect(() => {
        if (modalData && positionCloseModalRef.current) {
            positionCloseModalRef.current.showModal();
        }
    }, [modalData]);

    const showPositionCloseModal = (positionID) => {
        const position = positions.find(pos => pos.positionID === positionID);
        if (position) setModalData(position);
    };

    const handlePositionClose = (position) => {
        // BACKEND CLOSE POSITION
        console.log(position.positionTicker)
        console.log(position)
        closeModal();
        return;
    }

    const getSortedPositions = () => {
        const sorted = [...positions];
        sorted.sort((a, b) => {
            if (a.positionTicker === b.positionTicker) {
                return new Date(b.positionEntryDate) - new Date(a.positionEntryDate);
            }
            return a.positionTicker.localeCompare(b.positionTicker);
        });
        return sorted;
    };

    const columns = [
        { key: "positionTicker", label: "Ticker" },
        { key: "positionQuantity", label: "Quantity" },
        { key: "entryPrice", label: "Entry Price" },
        { key: "currentPrice", label: "Current Price" },
        { key: "positionPnLNominal", label: "P&L (Nominal)" },
        { key: "positionPnLPercentage", label: "P&L (%)" },
        { key: "positionStatus", label: "Status" },
        { key: "positionEntryDate", label: "Entry Date"},
        { key: "action", label: "Action" }
    ];

    return (
        <>
        <CardOne title={"Position Monitoring"}>
            {positions.length === 0 ? (
                <InnerEmptyState title="No positions yet" message="Looks like your portfolio doesn't yet have any positions."/>
            ) : (
                <div className="overflow-x-auto w-full">
                    <table className="w-full table-sm md:table table-zebra">
                        <thead>
                            <tr>
                                {columns.map(col => (
                                    <th key={col.key}>{col.label}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {getSortedPositions().map((pos, idx) => (
                                <tr key={idx}>
                                    <td>{pos.positionTicker}</td>
                                    <td>{pos.positionQuantity}</td>
                                    <td>{pos.entryPrice}</td>
                                    <td>{pos.currentPrice}</td>
                                    <td>
                                        {pos.positionPnLNominal >= 0 ? (
                                            <span className="text-success">+{pos.positionPnLNominal.toFixed(2)}</span>
                                        ) : (
                                            <span className="text-error">{pos.positionPnLNominal.toFixed(2)}</span>
                                        )}
                                    </td>
                                    <td>
                                        {pos.positionPnLPercentage >= 0 ? (
                                            <span className="text-success">
                                                +{(pos.positionPnLPercentage * 100).toFixed(2)}%
                                            </span>
                                        ) : (
                                            <span className="text-error">
                                                {(pos.positionPnLPercentage * 100).toFixed(2)}%
                                            </span>
                                        )}
                                    </td>
                                    <td>{pos.positionStatus}</td>
                                    <td>{pos.positionEntryDate}</td>
                                    <td>
                                        {pos.positionStatus === "Open" && (
                                            <button
                                                className="btn btn-sm btn-error"
                                                onClick={() => showPositionCloseModal(pos.positionID)}
                                            >
                                                Close
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </CardOne>
        {modalData && (
          <ClosePositionModal
            reference={positionCloseModalRef}
            positionData={modalData}
            onSubmit={handlePositionClose}
            closeModalActions={closeModal}
          />
        )}
        </>
    );
}