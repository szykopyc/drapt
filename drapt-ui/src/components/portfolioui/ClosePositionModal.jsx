import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { FormField } from "../helperui/FormFieldHelper";
import { FormErrorHelper } from "../helperui/FormErrorHelper";

export function ClosePositionModal({
    reference,
    positionData,
    onSubmit,
    closeModalActions,
    ...props
}) {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
        trigger,
        reset,
    } = useForm({
        mode: "onSubmit",
        defaultValues: {
            setQuantity: "",
            quantitySource: "setQuantitySelector",
            closePrice: "",
            priceSource: "setClosePrice",
        },
    });

    const [tradeConfirmed, setTradeConfirmed] = useState(false);

    // Watch selectors
    const quantitySource = watch("quantitySource");
    const priceSource = watch("priceSource");

    // Set input values to defaults when selector changes
    useEffect(() => {
        if (
            quantitySource === "fullQuantity" &&
            positionData?.positionQuantity
        ) {
            setValue("setQuantity", positionData.positionQuantity);
        }
        if (quantitySource === "setQuantitySelector") {
            setValue("setQuantity", "");
        }
    }, [quantitySource, positionData, setValue]);

    useEffect(() => {
        if (priceSource === "acceptLastClose" && positionData?.currentPrice) {
            setValue("closePrice", positionData.currentPrice);
        }
        if (priceSource === "setClosePrice") {
            setValue("closePrice", "");
        }
    }, [priceSource, positionData, setValue]);

    const guardedSubmitHandler = (data) => {
        if (!tradeConfirmed) {
            return;
        }

        const setQuantity =
            data.quantitySource === "fullQuantity" ? "FULL" : data.setQuantity;
        const setPrice =
            data.priceSource === "acceptLastClose"
                ? "LASTCLOSE"
                : data.closePrice;

        if (onSubmit && positionData) {
            onSubmit({ setQuantity, setPrice, position: positionData });
        }
        reset();
        setTradeConfirmed(false);
        closeModalActions();
    };

    const handleClosePositionClick = async (e) => {
        e.preventDefault(); // Prevent any default form behavior
        const valid = await trigger();
        if (valid) {
            setTradeConfirmed(true);
        }
    };

    const handleCancel = () => {
        reset();
        setTradeConfirmed(false);
        closeModalActions();
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
        }
    };

    return (
        <dialog ref={reference} className="modal">
            <div className="modal-box" {...props}>
                <h3 className="font-bold text-2xl">
                    {positionData
                        ? `Close ${positionData.positionTicker} Position`
                        : "Close Position"}
                </h3>
                <div className="py-2">
                    <div className="flex flex-col gap-2 w-full">
                        <p>
                            Select whether to close the full position or a
                            partial amount, and confirm your selling price.
                        </p>
                        <p>
                            Trades are normally executed at 6 hour intervals on
                            business days.
                        </p>
                        <div className="divider my-0"></div>
                        <form
                            id="closePositionForm"
                            onSubmit={(e) => {
                                e.preventDefault(); // Extra guard against form submission
                                handleSubmit(guardedSubmitHandler)(e);
                            }}
                            onKeyDown={handleKeyDown}
                            autoComplete="off"
                            className="flex flex-col gap-2"
                        >
                            <FormField label="Quantity">
                                <div className="flex gap-1">
                                    <select
                                        className="select select-bordered w-1/2"
                                        {...register("quantitySource", {
                                            required: "Quantity is required",
                                        })}
                                        defaultValue="setQuantitySelector"
                                        disabled={tradeConfirmed}
                                    >
                                        <option value="setQuantitySelector">
                                            Set Quantity
                                        </option>
                                        <option value="fullQuantity">
                                            Full Position
                                        </option>
                                    </select>
                                    <input
                                        type="number"
                                        step="1"
                                        placeholder="Enter Quantity"
                                        className="input input-bordered w-1/2"
                                        min={0}
                                        {...register("setQuantity", {
                                            validate: (value) => {
                                                if (
                                                    watch("quantitySource") !==
                                                    "setQuantitySelector"
                                                )
                                                    return true;
                                                if (!value)
                                                    return "Manual quantity required";
                                                if (value <= 0)
                                                    return "Quantity must be greater than 0";
                                                if (
                                                    !positionData?.positionQuantity ||
                                                    value >
                                                        positionData.positionQuantity
                                                )
                                                    return "Quantity must not be greater than position.";
                                                return true;
                                            },
                                        })}
                                        disabled={
                                            watch("quantitySource") !==
                                            "setQuantitySelector"
                                        }
                                    />
                                </div>
                            </FormField>
                            <FormField label="Sale Price">
                                <div className="flex gap-1">
                                    <select
                                        className="select select-bordered w-1/2"
                                        {...register("priceSource", {
                                            required: "Sale price is required",
                                        })}
                                        defaultValue="setClosePrice"
                                        disabled={tradeConfirmed}
                                    >
                                        <option value="setClosePrice">
                                            Set Price
                                        </option>
                                        <option value="acceptLastClose">
                                            Accept Last Close
                                        </option>
                                    </select>
                                    <input
                                        type="number"
                                        step="1"
                                        placeholder="Enter Price"
                                        className="input input-bordered w-1/2"
                                        min={0}
                                        {...register("closePrice", {
                                            validate: (value) => {
                                                if (
                                                    watch("priceSource") !==
                                                    "setClosePrice"
                                                )
                                                    return true;
                                                if (!value)
                                                    return "Close price is required";
                                                if (value <= 0)
                                                    return "Close price must be greater than 0";
                                                if (
                                                    !positionData?.currentPrice ||
                                                    Math.abs(
                                                        (value -
                                                            positionData.currentPrice) /
                                                            positionData.currentPrice
                                                    ) > 0.05
                                                )
                                                    return "Close price must be within 5% of current price.";
                                                return true;
                                            },
                                        })}
                                        disabled={
                                            watch("priceSource") !==
                                            "setClosePrice"
                                        }
                                    />
                                </div>
                            </FormField>
                        </form>
                        <div className="flex flex-col gap-1 w-full">
                            {Object.entries(errors).map(([field, errorObj]) =>
                                errorObj?.message ? (
                                    <FormErrorHelper key={field} textSize="md">
                                        {errorObj.message}
                                    </FormErrorHelper>
                                ) : null
                            )}
                        </div>
                        <div className="flex gap-3 w-full">
                            <div className="flex-1">
                                {tradeConfirmed ? (
                                    <button
                                        className="btn btn-success w-full"
                                        style={{
                                            borderRadius:
                                                "var(--border-radius)",
                                        }}
                                        type="submit"
                                        form="closePositionForm"
                                    >
                                        Confirm
                                    </button>
                                ) : (
                                    <button
                                        className="btn btn-primary w-full"
                                        style={{
                                            borderRadius:
                                                "var(--border-radius)",
                                        }}
                                        type="button"
                                        onClick={handleClosePositionClick}
                                    >
                                        Close Position
                                    </button>
                                )}
                            </div>
                            <div className="flex-1">
                                <button
                                    className="btn btn-error w-full"
                                    style={{
                                        borderRadius: "var(--border-radius)",
                                    }}
                                    type="button"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </dialog>
    );
}
