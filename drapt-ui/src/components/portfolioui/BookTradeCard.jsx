import { CardOne } from "../baseui/CustomCard";
import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { ModalHelper } from "../helperui/ModalHelper";
import { FormErrorHelper } from "../helperui/FormErrorHelper";
import { CustomButtonInputStyle } from "../baseui/CustomButton";
import CustomTable from "../baseui/CustomTable";
import { FormField } from "../helperui/FormFieldHelper";

export default function BookTradeCard() {
    const tradeConfirmModalRef = useRef(null);
    const [modalData, setModalData] = useState(null);
    const [tradeConfirmed, setTradeConfirmed] = useState(false);

    const {
        register,
        handleSubmit,
        reset: resetForm,
        setValue,
        watch,
        formState: { errors },
        trigger,
    } = useForm({
        mode: "onSubmit",
        defaultValues: {
            ticker: "",
            direction: "LONG",
            quantity: 0,
            analystWhoPitched: "",
            priceSource: "lastClose",
            manualPrice: "",
            tradeDate: new Date().toISOString().split("T")[0],
        },
    });

    const priceSource = watch("priceSource");

    const handlePlaceOrderClick = async (e) => {
        e.preventDefault();
        const valid = await trigger();
        if (valid) setTradeConfirmed(true);
    };

    const guardedSubmitHandler = (data) => {
        if (!tradeConfirmed) return;

        const openPrice =
            data.priceSource === "lastClose" ? "LASTCLOSE" : data.manualPrice;

        const { priceSource, manualPrice, analystWhoPitched, ...rest } = data;
        const capitalisedData = Object.fromEntries(
            Object.entries(rest).map(([key, value]) =>
                typeof value === "string"
                    ? [key, value.toUpperCase()]
                    : [key, value]
            )
        );

        const finalData = { ...capitalisedData, openPrice, analystWhoPitched };

        setModalData(finalData);
        if (tradeConfirmModalRef.current)
            tradeConfirmModalRef.current.showModal();
        resetForm();
        setTradeConfirmed(false);
    };

    const modalTableColumns = [
        { key: "ticker", label: "Ticker" },
        { key: "quantity", label: "Quantity" },
        { key: "openPrice", label: "Open Price" },
        { key: "direction", label: "Direction" },
        { key: "analystWhoPitched", label: "Analyst" },
        { key: "tradeDate", label: "Trade Date" },
    ];

    const typedTicker = watch("ticker");
    const typedQuantity = watch("quantity");
    const typedAnalyst = watch("analystWhoPitched");
    const typedManualPrice = watch("manualPrice");

    const allFieldsFilledMask =
        typedTicker &&
        typedQuantity &&
        typedAnalyst &&
        (priceSource === "lastClose" ||
            (priceSource === "manual" && typedManualPrice));

    return (
        <>
            <CardOne title={"Book a Trade"}>
                <p>Please enter prices in the asset's native currency.</p>
                <form
                    id="bookTrade"
                    onSubmit={handleSubmit(guardedSubmitHandler)}
                    autoComplete="off"
                >
                    <div className="flex flex-col md:flex-row gap-3 justify-between">
                        <div className="flex flex-col gap-3 w-full">
                            <FormField label="Ticker">
                                <input
                                    type="text"
                                    className="input input-bordered w-full"
                                    {...register("ticker", {
                                        required: "Ticker is required",
                                    })}
                                    autoComplete="off"
                                    disabled={tradeConfirmed}
                                />
                            </FormField>
                            {/* Direction field removed, but still submit LONG as hidden input */}
                            <input
                                type="hidden"
                                {...register("direction")}
                                value="LONG"
                            />
                            <FormField label="Quantity">
                                <input
                                    type="number"
                                    step="1"
                                    className="input input-bordered w-full"
                                    {...register("quantity", {
                                        required: "Quantity is required",
                                        validate: (value) => {
                                            if (!value)
                                                return "Quantity is required";
                                            if (value <= 0)
                                                return "Quantity must be greater than 0";
                                            return true;
                                        },
                                    })}
                                    autoComplete="off"
                                    min={0}
                                    disabled={tradeConfirmed}
                                />
                            </FormField>
                            <FormField label={"Analyst"}>
                                <input
                                    type="text"
                                    className="input input-bordered w-full"
                                    {...register("analystWhoPitched", {
                                        required: "Analyst's name is required",
                                    })}
                                    autoComplete="off"
                                    disabled={tradeConfirmed}
                                />
                            </FormField>
                        </div>
                        <div className="flex flex-col gap-3 w-full">
                            <FormField label="Price Source">
                                <div className="flex gap-1">
                                    <select
                                        className="select select-bordered w-1/2"
                                        {...register("priceSource", {
                                            required:
                                                "Price source is required",
                                        })}
                                        defaultValue="lastClose"
                                        disabled={tradeConfirmed}
                                    >
                                        <option value="lastClose">
                                            Last Close
                                        </option>
                                        <option value="manual">Manual</option>
                                    </select>
                                    <input
                                        type="number"
                                        step="0.01"
                                        placeholder="Enter price"
                                        className="input input-bordered w-1/2"
                                        {...register("manualPrice", {
                                            validate: (value) => {
                                                if (
                                                    watch("priceSource") ===
                                                        "manual" &&
                                                    !value
                                                ) {
                                                    return "Manual price required";
                                                }
                                                return true;
                                            },
                                        })}
                                        disabled={
                                            priceSource !== "manual" ||
                                            tradeConfirmed
                                        }
                                    />
                                </div>
                            </FormField>
                            <FormField label="Trade Date">
                                <input
                                    type="date"
                                    className="input input-bordered w-full"
                                    {...register("tradeDate", {
                                        required: "Trade date is required",
                                        validate: (value) => {
                                            const selectedDate = new Date(
                                                value
                                            );
                                            const currentDate = new Date();
                                            const differenceInDays =
                                                (currentDate - selectedDate) /
                                                (1000 * 60 * 60 * 24);

                                            if (
                                                selectedDate.getDay() === 0 ||
                                                selectedDate.getDay() === 6
                                            ) {
                                                return "Trades cannot be placed on weekends.";
                                            }
                                            if (differenceInDays > 7) {
                                                return "Trades must have happened in the last week.";
                                            }
                                            return true;
                                        },
                                    })}
                                    value={watch("tradeDate")}
                                    max={new Date().toISOString().split("T")[0]}
                                    disabled={tradeConfirmed}
                                />
                            </FormField>
                            <div className="h-auto md:h-[40px] mt-auto flex gap-3 w-full">
                                {!tradeConfirmed ? (
                                    <CustomButtonInputStyle
                                        form="bookTrade"
                                        colour="success"
                                        type="button"
                                        onClick={handlePlaceOrderClick}
                                        disabled={!allFieldsFilledMask}
                                    >
                                        Place Order
                                    </CustomButtonInputStyle>
                                ) : (
                                    <>
                                        <CustomButtonInputStyle
                                            form="bookTrade"
                                            colour="success"
                                            type="submit"
                                        >
                                            Confirm
                                        </CustomButtonInputStyle>
                                        <CustomButtonInputStyle
                                            form="bookTrade"
                                            colour="error"
                                            onClick={() =>
                                                setTradeConfirmed(false)
                                            }
                                        >
                                            Cancel
                                        </CustomButtonInputStyle>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1 w-full">
                        {Object.entries(errors).map(([field, errorObj]) =>
                            errorObj?.message ? (
                                <FormErrorHelper key={field} textSize="md">
                                    {errorObj.message}
                                </FormErrorHelper>
                            ) : null
                        )}
                    </div>
                </form>
            </CardOne>
            <ModalHelper
                id={"trade_confirm"}
                reference={tradeConfirmModalRef}
                modalTitle={"Order Placed"}
                style={{
                    maxWidth: "90vw",
                    width: "auto",
                    minWidth: "min(600px, 90vw)",
                }}
            >
                {modalData && (
                    <div className="flex flex-col gap-3">
                        <CustomTable
                            data={[modalData]}
                            columns={modalTableColumns}
                        />
                        <p>
                            Trades are normally executed at 6 hour intervals on
                            business days.
                        </p>
                    </div>
                )}
            </ModalHelper>
        </>
    );
}
