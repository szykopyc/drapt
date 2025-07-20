import { useParams } from "react-router-dom";
import { CustomCollapseArrow } from "../../baseui/CustomCard";
import { useForm } from "react-hook-form";
import React, { useState } from "react";
import { FormErrorHelper } from "../../helperui/FormErrorHelper";
import CustomButton from "../../baseui/CustomButton";
import { FormField } from "../../helperui/FormFieldHelper";
import { useHookSearchPortfolioOverview } from "../../../reactqueryhooks/usePortfolioHook";
import { updatePortfolioMetadata } from "../../../lib/PortfolioServices";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { currencyMapperDict } from "../../../helperfunctions/CurrencyMapper";

export default function AdminUpdatePortfolioDetails() {
    const { portfolioID } = useParams();

    const { data: portfolioOverviewData = [] } =
        useHookSearchPortfolioOverview(portfolioID);

    const queryClient = useQueryClient();

    const isPortfolioInitialCashAlreadySet =
        Number(portfolioOverviewData?.initial_cash) > 0.01;

    // ----------------UPDATE PORTFOLIO METADATA SECTION---------------
    // FORM FOR UPDATING PORTFOLIO METADATA
    const {
        register,
        handleSubmit,
        reset,
        watch,
        trigger,
        formState: { errors: errorsOnFormUpdate },
    } = useForm({
        mode: "onSubmit",
    });

    const isAnyUpdateFieldFilled =
        watch("name") ||
        watch("description") ||
        watch("currency") ||
        watch("initial_cash");

    // PORTFOLIO CLICK TO CONFIRM button
    const [portfolioUpdateConfirmed, setPortfolioUpdateConfirmed] =
        useState(false);
    const [isPortfolioBeingUpdated, setIsPortfolioBeingUpdated] =
        useState(false);

    const portfolioUpdateClickHandler = async (e) => {
        e.preventDefault();
        const valid = await trigger();
        if (valid) setPortfolioUpdateConfirmed(true);
    };

    // THIS IS FOR UPDATING PORTFOLIO METADATA
    const guardedUpdateHandler = async (data) => {
        try {
            const filteredData = Object.fromEntries(
                Object.entries(data).filter(([key, value]) => {
                    if (value === "") return false;
                    if (key === "initial_cash") {
                        const parsed = parseFloat(value);
                        return !isNaN(parsed) && parsed >= 0.001;
                    }
                    return true;
                })
            );

            setIsPortfolioBeingUpdated(true);
            await updatePortfolioMetadata(
                portfolioOverviewData.id,
                filteredData
            );
            await new Promise((resolve) => setTimeout(resolve, 500));
            setIsPortfolioBeingUpdated(false);
            queryClient.invalidateQueries([
                "portfolio",
                portfolioOverviewData.portfolio_string_id,
            ]);
            reset();
            setPortfolioUpdateConfirmed(false);
            toast.success("Successfully modified portfolio details");
        } catch (error) {
            return error;
        }
    };
    return (
        <CustomCollapseArrow
            title={"Manage Portfolio Details"}
            defaultOpen={false}
            onClose={() => reset()}
        >
            <form
                id={"portfolioToUpdate"}
                className="flex flex-col gap-3 w-full"
                onSubmit={handleSubmit(guardedUpdateHandler)}
                autoComplete="off"
            >
                <FormField label={"Update Portfolio Name"}>
                    <input
                        type="text"
                        className="input input-bordered w-full"
                        {...register("name", {
                            validate: (name) => {
                                if (name == null) return true;
                                if (name !== null && name.length > 50)
                                    return "The portfolio name cannot be over 50 characters in length.";
                            },
                        })}
                        placeholder={portfolioOverviewData?.name}
                    />
                </FormField>
                <FormField label="Update Description">
                    <textarea
                        className="textarea textarea-bordered w-full"
                        {...register("description", {
                            validate: (description) => {
                                if (description == null) return true;
                                if (
                                    description !== null &&
                                    description.length > 1024
                                )
                                    return "The portfolio description cannot be over 1024 characters in length.";
                            },
                        })}
                        autoComplete="off"
                        placeholder={
                            portfolioOverviewData?.description
                                ? portfolioOverviewData.description.slice(
                                      0,
                                      150
                                  ) + "..."
                                : "No current description"
                        }
                        // add disabled field
                    ></textarea>
                </FormField>
                <div className="flex flex-col md:flex-row gap-3 justify-between">
                    <div className="w-1/2">
                        <FormField label="Set Currency">
                            <select
                                className="select w-full"
                                {...register("currency")}
                                disabled={isPortfolioInitialCashAlreadySet}
                            >
                                <option value="" disabled>
                                    {isPortfolioInitialCashAlreadySet
                                        ? `Currency: ${
                                              currencyMapperDict[
                                                  portfolioOverviewData
                                                      ?.currency
                                              ]
                                          } - ${
                                              portfolioOverviewData?.currency
                                          }`
                                        : `Default ${
                                              currencyMapperDict[
                                                  portfolioOverviewData
                                                      ?.currency
                                              ]
                                          } - ${
                                              portfolioOverviewData?.currency
                                          }`}
                                </option>
                                {Object.entries(currencyMapperDict).map(
                                    ([currencyStr, currencySymbol]) => (
                                        <option
                                            key={currencyStr}
                                            value={currencyStr}
                                        >
                                            {currencySymbol} - {currencyStr}
                                        </option>
                                    )
                                )}
                            </select>
                        </FormField>
                    </div>
                    <div className="w-1/2">
                        <FormField label="Set Initial Cash">
                            <input
                                type="number"
                                step="10"
                                className="input input-bordered w-full"
                                placeholder={
                                    isPortfolioInitialCashAlreadySet
                                        ? portfolioOverviewData?.initial_cash
                                        : "0.00"
                                }
                                disabled={isPortfolioInitialCashAlreadySet}
                                {...register("initial_cash", {
                                    validate: (value) => {
                                        // Handle empty or 0-like inputs gracefully
                                        const parsed = parseFloat(value);
                                        if (
                                            isNaN(parsed) &&
                                            watch("initial_cash")
                                        )
                                            return "Initial cash must be a valid number";
                                        if (parsed < 0)
                                            return "Initial cash cannot be negative";
                                        return true;
                                    },
                                })}
                            />
                        </FormField>
                    </div>
                </div>
                <div className="h-[40px] flex gap-3 w-full">
                    {!portfolioUpdateConfirmed ? (
                        <CustomButton
                            colour="success"
                            type="button"
                            onClick={portfolioUpdateClickHandler}
                            disabled={!isAnyUpdateFieldFilled}
                        >
                            Update Portfolio
                        </CustomButton>
                    ) : (
                        <>
                            <CustomButton
                                form="portfolioToUpdate"
                                colour="success"
                                type="submit"
                            >
                                {isPortfolioBeingUpdated
                                    ? "Updating portfolio..."
                                    : "Confirm"}
                            </CustomButton>
                            <CustomButton
                                colour="error"
                                onClick={() =>
                                    setPortfolioUpdateConfirmed(false)
                                }
                                disabled={isPortfolioBeingUpdated}
                            >
                                Cancel
                            </CustomButton>
                        </>
                    )}
                </div>
            </form>
            {errorsOnFormUpdate && (
                <div className="flex flex-col gap-1 w-full min-h-0">
                    {Object.entries(errorsOnFormUpdate).map(
                        ([field, errorObj]) =>
                            errorObj?.message ? (
                                <FormErrorHelper key={field} textSize="md">
                                    {errorObj.message}
                                </FormErrorHelper>
                            ) : null
                    )}
                </div>
            )}
        </CustomCollapseArrow>
    );
}
