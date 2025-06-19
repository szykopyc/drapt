import { CardOne } from "../baseui/CustomCard";
import React, { useState, useEffect, useRef } from 'react';
import { useForm } from "react-hook-form";
import { ModalHelper } from "../helperui/ModalHelper";
import { FormErrorHelper } from "../helperui/FormErrorHelper";
import { CustomButtonInputStyle } from "../baseui/CustomButton";
import CustomTable from "../baseui/CustomTable";
import { FormField } from "../helperui/FormFieldHelper";
import BuySellToggle from "./BuySellToggle";
import { div } from "framer-motion/client";

export default function BookTradeCard(){

    const tradeConfirmModalRef = useRef(null);
    const [modalData, setModalData] = useState(null);

    const { register, handleSubmit, reset: resetForm, setValue, watch, formState: { errors } } = useForm({
        mode:"onChange",
        defaultValues: {
            ticker: "",
            direction: "buy",
            quantity: 0,
            priceSource: "lastClose",
            tradeDate: (new Date().toISOString().split("T")[0])
        }
    });

    const direction = watch("direction", "buy");

    const handleDirectionChange = (val) => setValue("direction", val, { shouldValidate: true });

    const typedTicker = watch("ticker");
    const selectedDirection = watch("direction");
    const typedQuantity = watch("quantity");
    const selectedPriceSource = watch("priceSource");
    const selectedDate = watch("tradeDate");

    const allFieldsFilledMask = (typedTicker && selectedDirection && typedQuantity && selectedPriceSource && selectedDate);

    const onSubmit = (data) => {
        const capitalisedData = Object.fromEntries(
            Object.entries(data).map(([key, value]) =>
                typeof value === "string"
                    ? [key, value.toUpperCase()]
                    : [key, value]
            )
        );
        setModalData(capitalisedData);
        if (tradeConfirmModalRef.current) tradeConfirmModalRef.current.showModal();
        resetForm();
    };

    return (
        <>
        <CardOne title={"Book a Trade"}>
            <p>Please enter prices in the asset's native currency.</p>
            <form
                id="bookTrade"
                onSubmit={handleSubmit(onSubmit)}
                autoComplete="off"
            >
                <div className="flex flex-col md:flex-row gap-3 justify-between">
                    <div className="flex flex-col gap-3 w-full">
                        <FormField label="Ticker" /* error={errors.ticker && errors.ticker.message} */>
                            <input
                                type="text" 
                                className="input input-bordered w-full"
                                {...register("ticker", {required: "Ticker is required"})}
                                autoComplete="off"
                            />
                        </FormField>
                        <FormField label="Direction" /* error={errors.direction && errors.direction.message} */>
                            <input type="hidden" {...register("direction", {required: "Direction is required"})} value={direction} />
                            <BuySellToggle value={direction} onChange={handleDirectionChange} />
                        </FormField>
                        <FormField label="Quantity" /* error={errors.quantity && errors.quantity.message} */>
                            <input
                                type="text"
                                className="input input-bordered w-full"
                                {...register("quantity", {required:"Quantity is required"})}
                                autoComplete="off"
                            />
                        </FormField>
                    </div>
                    <div className="flex flex-col gap-3 w-full">
                        <FormField label="Price Source" /* error={errors.priceSource && errors.priceSource.message} */>
                            <div className="flex gap-1">
                                <select
                                    className="select select-bordered w-1/2"
                                    {...register("priceSource", { required: "Price source is required" })}
                                    defaultValue="lastClose"
                                >
                                    <option value="lastClose">Last Close</option>
                                    <option value="manual">Manual</option>
                                </select>
                                <input
                                    type="number"
                                    step="0.01"
                                    placeholder="Enter price"
                                    className="input input-bordered w-1/2"
                                    defaultValue={0}
                                    {...register("manualPrice", {
                                        validate: (value) => {
                                            if (watch("priceSource") === "manual" && !value) {
                                                return "Manual price required";
                                            }
                                            return true;
                                        }
                                    })}
                                    disabled={watch("priceSource") !== "manual"}
                                />
                            </div>
                        </FormField>
                        <FormField label="Trade Date" /* error={errors.tradeDate && errors.tradeDate.message} */>
                            <input
                                type="date"
                                className="input input-bordered w-full"
                                {...register("tradeDate", { required: "Trade date is required" })}
                                value={watch("tradeDate")}
                                max={new Date().toISOString().split("T")[0]}
                            />
                        </FormField>
                        <div className="h-auto md:h-[40px] mt-auto flex w-full">
                            <CustomButtonInputStyle form="bookTrade" colour="success" disabled={!allFieldsFilledMask}>
                                Place Order
                            </CustomButtonInputStyle>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-1 w-full">
                        {Object.entries(errors).map(([field, errorObj]) =>
                            errorObj?.message ? (
                                <FormErrorHelper key={field} textSize="md">{errorObj.message}</FormErrorHelper>
                            ) : null
                        )}
                    </div>
            </form>
        </CardOne>
        <ModalHelper
    id={"trade_confirm"}
    reference={tradeConfirmModalRef}
    modalTitle={"Order Placed"}
    style={{ maxWidth: "90vw", width: "auto", minWidth: "min(600px, 90vw)" }}
>
    {modalData && (
        <div className="mt-3 flex flex-col gap-3">
            <CustomTable data={[modalData]}/>
            <p>Trades are normally executed at 6 hour intervals on business days.</p>
        </div>
    )}
</ModalHelper>
        </>
    );
}