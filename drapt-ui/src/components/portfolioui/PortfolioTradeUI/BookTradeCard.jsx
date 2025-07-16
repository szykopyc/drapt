import { CardOneTooltip } from "../../baseui/CustomCard";
import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ModalHelper } from "../../helperui/ModalHelper";
import { FormErrorHelper } from "../../helperui/FormErrorHelper";
import { CustomButtonInputStyle } from "../../baseui/CustomButton";
import { FormField } from "../../helperui/FormFieldHelper";
import BuySellToggle from "../BuySellToggle";
import { currencyMapperDict } from "../../../helperfunctions/CurrencyMapper";
import { roleMapperDict } from "../../../helperfunctions/RoleMapper";
import { venueMapperDict } from "../../../helperfunctions/VenueMapper";
import { MdInfoOutline, MdOutlineClose } from "react-icons/md";
import { BookTrade } from "../../../lib/TradeService";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { FaSearch } from "react-icons/fa";
import { getAssetMetadataFuzzy } from "../../../lib/AssetDataService";
import { flagMapperDict } from "../../../helperfunctions/FlagMapper";
import FuzzyAssetMetadataSearchBar from "../../assetdataui/FuzzyAssetMetadataSearch";

export default function BookTradeCard(portfolioOverviewData) {
    const queryClient = useQueryClient();

    const [selectedTickerFromSelection, setSelectedTickerFromSelection] =
        useState({});

    // Handles searching for asset metadata (tickers) based on the searchTerm input.
    // Sets loading state, fetches results, and shows dropdown with results.

    // modal stuff
    const tradeConfirmModalRef = useRef(null);
    const [modalData, setModalData] = useState(null);
    const [tradeConfirmed, setTradeConfirmed] = useState(false);
    const fuzzySearchRef = useRef();

    const {
        register,
        setValue,
        handleSubmit,
        reset: resetForm,
        watch,
        formState: { errors },
        trigger,
    } = useForm({
        mode: "onSubmit",
        defaultValues: {
            currency: "",
            price: "",
            direction: "BUY",
            analyst_id: "",
            execution_date: new Date().toISOString().split("T")[0],
            venue: "",
            notes: "",
        },
    });

    // checkbox to confirm that a trade may take the portfolio short on a position
    const [confirmShortWarning, setConfirmShortWarning] = useState(false);

    // sets the direction based off the custom BuySellToggle
    const direction = watch("direction");
    const handleDirectionClick = (val) => {
        setValue("direction", val, { shouldValidate: true });
        if (val === "BUY") setConfirmShortWarning(false);
    };

    // watches to make sure that all required fields are filled
    const watchedFields = watch([
        "quantity",
        "price",
        "currency",
        "direction",
        "analyst_id",
        "execution_date",
        "venue",
    ]);
    const allFieldsFilledMask =
        !watchedFields.includes("") && selectedTickerFromSelection;

    // sets confirm button to true if true
    const handlePlaceOrderClick = async (e) => {
        e.preventDefault();
        const valid = await trigger();
        if (valid) setTradeConfirmed(true);
    };

    // this is where API call happens and modal gets shown
    // IN FUTURE : need to prevent executing trades if it would take them into negative cash (from calculating cash based on lots)
    const guardedSubmitHandler = async (data) => {
        console.log(data);
        if (!tradeConfirmed) return;

        const dataToSendForTradeBooking = {
            ...data,
            portfolio_id: portfolioOverviewData?.id,
            ticker: selectedTickerFromSelection.ticker,
            exchange: selectedTickerFromSelection.exchange,
        };

        try {
            await BookTrade(dataToSendForTradeBooking);
            await new Promise((resolve) => setTimeout(resolve, 300));
            queryClient.invalidateQueries([
                "trade_history_by_pid",
                portfolioOverviewData.id,
            ]);
            const modalDataToPass = {
                ...data,
                ticker: selectedTickerFromSelection.ticker.toUpperCase(),
                exchange: selectedTickerFromSelection.exchange,
                direction: data.direction.toUpperCase(),
                analyst_fullname: portfolioOverviewData?.members.find(
                    (member) => member.id === Number(data.analyst_id)
                ).fullname,
                curr_price: currencyMapperDict[data.currency] + data.price,
                countryCode: selectedTickerFromSelection.countryCode,
                confirmShortWarning: confirmShortWarning,
            };

            setModalData(modalDataToPass);

            if (tradeConfirmModalRef.current)
                tradeConfirmModalRef.current.showModal();
        } catch {
            toast.error("Failed to book trade.");
        } finally {
            resetForm();
            setSelectedTickerFromSelection({});
            setTradeConfirmed(false);
            setConfirmShortWarning(false);
            // Clear the search bar in the child
            fuzzySearchRef?.current?.clear();
        }
    };

    return (
        <>
            <CardOneTooltip
                title={"Book a Trade"}
                tooltip={
                    "Please fill all required boxes to book a trade. To enter a ticker, type it in, press the search button next to the input, and select the asset from the list. Trades cannot be undone. If submitting a short trade to close an existing long, please be aware that it may result in an overall short position if the quantity is greater than the existing long."
                }
            >
                <p>Please enter prices in the asset's native currency.</p>
                <form
                    id="bookTrade"
                    onSubmit={handleSubmit(guardedSubmitHandler)}
                    autoComplete="off"
                >
                    <div className="flex flex-col md:flex-row gap-3 justify-between">
                        <div className="flex flex-col gap-3 w-full">
                            <FormField label="Ticker">
                                <FuzzyAssetMetadataSearchBar
                                    ref={fuzzySearchRef}
                                    selectedAsset={selectedTickerFromSelection}
                                    onSelect={setSelectedTickerFromSelection}
                                    disabled={tradeConfirmed}
                                />
                            </FormField>

                            <FormField label="Currency and Price">
                                <div className="flex flex-col md:flex-row gap-3 justify-between">
                                    <select
                                        className="select w-full md:w-1/2"
                                        {...register("currency", {
                                            required: "Currency is required",
                                        })}
                                        disabled={tradeConfirmed}
                                        defaultValue=""
                                    >
                                        <option value="" disabled>
                                            Select Trade Currency
                                        </option>
                                        {Object.entries(currencyMapperDict).map(
                                            ([code, symbol]) => (
                                                <option key={code} value={code}>
                                                    {symbol} - {code}
                                                </option>
                                            )
                                        )}
                                    </select>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min={0}
                                        placeholder="Enter price"
                                        className="input input-bordered w-full md:w-1/2"
                                        {...register("price", {
                                            required: "Price is required",
                                            setValueAs: (v) => parseFloat(v),
                                            validate: (value) =>
                                                value < 0.01
                                                    ? "Price must be nonzero and positive."
                                                    : true,
                                        })}
                                        disabled={tradeConfirmed}
                                    />
                                </div>
                            </FormField>

                            <FormField label="Quantity">
                                <input
                                    type="number"
                                    step="1"
                                    placeholder="Enter Quantity"
                                    className="input input-bordered w-full"
                                    {...register("quantity", {
                                        required: "Quantity is required",
                                        setValueAs: (v) => parseFloat(v),
                                        validate: (value) =>
                                            value <= 0
                                                ? "Quantity must be greater than 0"
                                                : true,
                                    })}
                                    min={0}
                                    disabled={tradeConfirmed}
                                />
                            </FormField>

                            <FormField label={"Direction"}>
                                <input
                                    type="hidden"
                                    {...register("direction")}
                                    value={direction}
                                />
                                <BuySellToggle
                                    value={direction}
                                    onChange={handleDirectionClick}
                                    disabled={tradeConfirmed}
                                />
                            </FormField>

                            <FormField label={"Analyst"}>
                                <select
                                    className="select w-full"
                                    {...register("analyst_id", {
                                        required: "Analyst is required",
                                        setValueAs: (v) => parseFloat(v),
                                    })}
                                    disabled={tradeConfirmed}
                                    defaultValue=""
                                >
                                    <option value="" disabled>
                                        Select Analyst
                                    </option>
                                    {portfolioOverviewData?.members.map(
                                        (member) => (
                                            <option
                                                key={member.id}
                                                value={Number(member.id)}
                                            >
                                                {member.fullname} -{" "}
                                                {roleMapperDict[member.role]}
                                            </option>
                                        )
                                    )}
                                </select>
                            </FormField>
                        </div>

                        <div className="flex flex-col gap-3 w-full">
                            <FormField label="Trade Date">
                                <input
                                    type="date"
                                    className="input input-bordered w-full"
                                    {...register("execution_date", {
                                        required: "Trade date is required",
                                        validate: (value) => {
                                            const selectedDate = new Date(
                                                value
                                            );
                                            const currentDate = new Date();
                                            const diffDays =
                                                (currentDate - selectedDate) /
                                                (1000 * 60 * 60 * 24);
                                            if (
                                                selectedDate.getDay() === 0 ||
                                                selectedDate.getDay() === 6
                                            )
                                                return "Trades cannot be placed on weekends.";
                                            if (diffDays > 7)
                                                return "Trades must have happened in the last week.";
                                            return true;
                                        },
                                    })}
                                    max={new Date().toISOString().split("T")[0]}
                                    disabled={tradeConfirmed}
                                />
                            </FormField>

                            <FormField label={"Venue/Broker"}>
                                <select
                                    className="select w-full"
                                    {...register("venue", {
                                        required: "Venue is required",
                                    })}
                                    disabled={tradeConfirmed}
                                    defaultValue=""
                                >
                                    <option value="" disabled>
                                        Select Venue
                                    </option>
                                    {Object.entries(venueMapperDict).map(
                                        ([venueID, venueSTR]) => (
                                            <option
                                                key={venueID}
                                                value={venueID}
                                            >
                                                {venueSTR}
                                            </option>
                                        )
                                    )}
                                </select>
                            </FormField>

                            <FormField label={"Optional Trade Notes"}>
                                <textarea
                                    className="textarea w-full min-h-[185px]"
                                    {...register("notes", {
                                        validate: (value) => {
                                            if (value.length > 1024)
                                                return "Trade notes must not be over 1024 characters in length.";
                                            return true;
                                        },
                                    })}
                                    placeholder="e.g., catalyst, risk considerations, conviction level, or entry rationale"
                                    disabled={tradeConfirmed}
                                />
                            </FormField>
                        </div>
                    </div>
                    <div className="w-full flex flex-row justify-between items-center mt-3">
                        {watch("direction") === "SELL" ? (
                            <>
                                <div className="flex flex-row justify-start gap-1">
                                    <MdInfoOutline className="text-xl text-error" />
                                    <span className="text-md text-error">
                                        Trades are final and cannot be undone.
                                        This trade may take you short if it does
                                        not close an existing long position.
                                        Please check this box to affirm this
                                        risk.
                                    </span>
                                </div>
                                <input
                                    id="confirmShortWarning"
                                    type="checkbox"
                                    className="checkbox"
                                    checked={confirmShortWarning}
                                    onChange={(e) =>
                                        setConfirmShortWarning(e.target.checked)
                                    }
                                />
                            </>
                        ) : (
                            <div className="w-full flex justify-start items-center gap-1">
                                <MdInfoOutline className="text-xl text-info" />
                                <span className="text-md text-info">
                                    Trades are final and cannot be undone.
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="h-auto md:h-[40px] mt-3 flex gap-3 w-full">
                        {!tradeConfirmed ? (
                            <CustomButtonInputStyle
                                colour="success"
                                type="button"
                                onClick={handlePlaceOrderClick}
                                disabled={
                                    !allFieldsFilledMask ||
                                    (direction === "SELL" &&
                                        !confirmShortWarning)
                                }
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
                                    onClick={() => setTradeConfirmed(false)}
                                >
                                    Cancel
                                </CustomButtonInputStyle>
                            </>
                        )}
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
            </CardOneTooltip>

            <ModalHelper
                id={"trade_confirm"}
                reference={tradeConfirmModalRef}
                modalTitle={"Trade Details"}
                style={{
                    minWidth: "max(50vw, 600px)",
                }}
            >
                {modalData && (
                    <div className="flex flex-col">
                        <div className="overflow-x-auto">
                            <table className="table-sm md:table table-zebra table-auto">
                                <thead>
                                    <tr>
                                        <th>Ticker</th>
                                        <th>Exchange</th>
                                        <th>Price</th>
                                        <th>Quantity</th>
                                        <th>Direction</th>
                                        <th>Analyst</th>
                                        <th>Date</th>
                                        <th>Venue/Broker</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr key={modalData.ticker}>
                                        <th>{modalData.ticker}</th>
                                        <th>
                                            {modalData.exchange +
                                                " " +
                                                flagMapperDict[
                                                    modalData.countryCode
                                                ]}
                                        </th>
                                        <th>{modalData.curr_price}</th>
                                        <th>{modalData.quantity}</th>
                                        <th>{modalData.direction}</th>
                                        <th>{modalData.analyst_fullname}</th>
                                        <th>{modalData.execution_date}</th>
                                        <th>
                                            {venueMapperDict[modalData.venue]}
                                        </th>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-3 flex flex-row gap-1 justify-start items-center">
                            <MdInfoOutline className="text-md text-info" />
                            <span className="text-info">
                                {modalData.confirmShortWarning
                                    ? "You affirmed the short warning, this trade is irrevocable."
                                    : "This trade is irrevocable."}
                                .
                            </span>
                        </div>
                        {modalData?.notes ? (
                            <div className="flex flex-col mt-3">
                                <p className="whitespace-pre-line underline">
                                    Trade Notes
                                </p>
                                {modalData.notes}
                            </div>
                        ) : null}
                    </div>
                )}
            </ModalHelper>
        </>
    );
}
