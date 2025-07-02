import { CardOne } from "../baseui/CustomCard";
import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { ModalHelper } from "../helperui/ModalHelper";
import { FormErrorHelper } from "../helperui/FormErrorHelper";
import { CustomButtonInputStyle } from "../baseui/CustomButton";
import { FormField } from "../helperui/FormFieldHelper";
import { Link } from "react-router-dom";

import useUserStore from "../../stores/userStore";

export function CreatePortfolioCard() {
    const user = useUserStore((state) => state.user);
    if (!user) return null;

    const portfolioConfirmedModalRef = useRef(null);
    const [modalData, setModalData] = useState(null);
    const [portfolioCreationConfirmed, setPortfolioCreationConfirmed] =
        useState(false);

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
            portfolioName: "",
            portfolioID: "",
            portfolioManager: "",
            portfolioTeamMembers: "",
            portfolioInitialValue: 0,
            portfolioCurrency: "GBP",
            portfolioCreationDate: new Date().toISOString().split("T")[0],
            portfolioAssetType: "Equity",
        },
    });

    const handleCreatePortfolioClick = async (e) => {
        e.preventDefault();
        const valid = await trigger();
        if (valid) setPortfolioCreationConfirmed(true);
    };

    const guardedSubmitHandler = (data) => {
        if (!portfolioCreationConfirmed) return;

        const {
            portfolioName,
            portfolioCurrency,
            portfolioAssetType,
            ...rest
        } = data;
        const capitalisedData = Object.fromEntries(
            Object.entries(rest).map(([key, value]) =>
                typeof value === "string"
                    ? [key, value.toLowerCase()]
                    : [key, value]
            )
        );

        const finalData = {
            ...capitalisedData,
            portfolioName,
            portfolioCurrency,
            portfolioAssetType,
        };

        setModalData(finalData);
        if (portfolioConfirmedModalRef.current)
            portfolioConfirmedModalRef.current.showModal();
        resetForm();
        setPortfolioCreationConfirmed(false);
    };

    const currencyMap = {
        GBP: "£",
        USD: "$",
        JPY: "¥",
        EUR: "€",
    };

    const typedPortfolioName = watch("portfolioName");
    const typedUniquePortfolioID = watch("portfolioID");
    const typedPM = watch("portfolioManager");
    const typedTeamMembers = watch("portfolioTeamMembers");
    const typedPortfolioInitialValue = watch("portfolioInitialValue");

    const allFieldsFilledMask =
        typedPortfolioName &&
        typedUniquePortfolioID &&
        typedPM &&
        typedTeamMembers &&
        typedPortfolioInitialValue > 0;

    return (
        <>
            <CardOne title={"Create Portfolio Form"}>
                <form
                    id="createPortfolio"
                    onSubmit={handleSubmit(guardedSubmitHandler)}
                    autoComplete="off"
                >
                    <div className="flex flex-col gap-3 justify-between">
                        <FormField label={"Portfolio Name"}>
                            <input
                                type="text"
                                className="input input-bordered w-full"
                                {...register("portfolioName", {
                                    required: "Portfolio name is required",
                                })}
                                placeholder={"e.g., Industrial, US and Canada"}
                                autoComplete="off"
                                disabled={portfolioCreationConfirmed}
                            />
                        </FormField>
                        <FormField
                            label={
                                "Unique Portfolio ID - no symbols, no spaces, no numbers"
                            }
                        >
                            <input
                                type="text"
                                className="input input-bordered w-full"
                                {...register("portfolioID", {
                                    required: "Portfolio ID is required",
                                    validate: (value) => {
                                        if (/\s/.test(value) == true) {
                                            return "Portfolio ID must not contain spaces";
                                        }
                                        if (
                                            /[!@$^&*()_+\-{}\[\],.<>?]/.test(
                                                value
                                            ) == true
                                        ) {
                                            return "Portfolio ID must not contain special characters";
                                        }
                                        if (/[0-9]/.test(value) == true) {
                                            return "Portfolio ID must not contain numbers";
                                        }
                                    },
                                })}
                                placeholder={"e.g., industrial, tech"}
                                autoComplete="off"
                                disabled={portfolioCreationConfirmed}
                            />
                        </FormField>
                        <FormField label={"Manager"}>
                            <input
                                type="text"
                                className="input input-bordered w-full"
                                {...register("portfolioManager", {
                                    required: "Portfolio manager is required",
                                })}
                                placeholder="e.g., liysk64"
                                autoComplete="off"
                                disabled={portfolioCreationConfirmed}
                            />
                        </FormField>
                        <FormField
                            label={"Team Members - use commas to separate"}
                        >
                            <textarea
                                className="textarea textarea-bordered w-full"
                                {...register("portfolioTeamMembers", {
                                    required: "Team members are required",
                                })}
                                autoComplete="off"
                                placeholder="e.g., abcde01, abcde02"
                                disabled={portfolioCreationConfirmed}
                            ></textarea>
                        </FormField>
                        <div className="flex flex-col md:flex-row gap-3 justify-between w-full">
                            <div className="w-full md:w-1/5">
                                <FormField label={"Currency"}>
                                    <select
                                        className="select select-bordered w-full"
                                        {...register("portfolioCurrency", {
                                            required:
                                                "Portfolio currency is required",
                                        })}
                                        defaultValue="GBP"
                                        disabled={portfolioCreationConfirmed}
                                    >
                                        <option value="GBP">£ GBP</option>
                                        <option value="USD">$ USD</option>
                                        <option value="JPY">¥ JPY</option>
                                        <option value="EUR">€ EUR</option>
                                    </select>
                                </FormField>
                            </div>
                            <div className="w-full md:w-4/5">
                                <FormField label={"Initial Value"}>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="input input-bordered w-full "
                                        {...register("portfolioInitialValue", {
                                            required:
                                                "Portfolio name is required",
                                            validate: (value) => {
                                                if (!value)
                                                    return "Initial value is required";
                                                if (value <= 0)
                                                    return "Initial value must be greater than 0";
                                            },
                                        })}
                                        autoComplete="off"
                                        defaultValue={0}
                                        min={0}
                                        disabled={portfolioCreationConfirmed}
                                    />
                                </FormField>
                            </div>
                        </div>
                        <input
                            type="hidden"
                            {...register("portfolioCreationDate")}
                            value={new Date().toISOString().split("T")[0]}
                        />
                        <input
                            type="hidden"
                            {...register("portfolioAssetType")}
                            value={"Equity"}
                        />
                        <div className="h-[40px] flex gap-3 w-full">
                            {!portfolioCreationConfirmed ? (
                                <CustomButtonInputStyle
                                    form="createPortfolio"
                                    colour="success"
                                    type="button"
                                    onClick={handleCreatePortfolioClick}
                                    disabled={!allFieldsFilledMask}
                                >
                                    Create Portfolio
                                </CustomButtonInputStyle>
                            ) : (
                                <>
                                    <CustomButtonInputStyle
                                        form="createPortfolio"
                                        colour="success"
                                        type="submit"
                                    >
                                        Confirm
                                    </CustomButtonInputStyle>
                                    <CustomButtonInputStyle
                                        form="createPortfolio"
                                        colour="error"
                                        onClick={() =>
                                            setPortfolioCreationConfirmed(false)
                                        }
                                    >
                                        Cancel
                                    </CustomButtonInputStyle>
                                </>
                            )}
                        </div>
                    </div>
                </form>
                <div className="flex flex-col gap-1 w-full min-h-0">
                    {Object.entries(errors).map(([field, errorObj]) =>
                        errorObj?.message ? (
                            <FormErrorHelper key={field} textSize="md">
                                {errorObj.message}
                            </FormErrorHelper>
                        ) : null
                    )}
                </div>
            </CardOne>
            <ModalHelper
                id={"portfolio_confirm"}
                reference={portfolioConfirmedModalRef}
                modalTitle={"Portfolio Created"}
                width={70}
            >
                {modalData && (
                    <>
                        <table className="w-full text-left text-base">
                            <colgroup>
                                <col className="w-1/2" />
                                <col className="w-1/2" />
                            </colgroup>
                            <tbody className="align-top">
                                <tr>
                                    <td>Portfolio Name</td>
                                    <td className="font-semibold">
                                        {modalData.portfolioName}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Portfolio ID</td>
                                    <td className="font-semibold">
                                        {modalData.portfolioID}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Manager</td>
                                    <td className="font-semibold">
                                        {modalData.portfolioManager}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Team Members</td>
                                    <td className="font-semibold">
                                        {modalData.portfolioTeamMembers}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Initial Value</td>
                                    <td className="font-semibold">
                                        {
                                            currencyMap[
                                                modalData.portfolioCurrency
                                            ]
                                        }
                                        {Number(
                                            modalData.portfolioInitialValue
                                        ).toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Currency</td>
                                    <td className="font-semibold">
                                        {modalData.portfolioCurrency}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Creation Date</td>
                                    <td className="font-semibold">
                                        {modalData.portfolioCreationDate}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Asset Type</td>
                                    <td className="font-semibold">
                                        {modalData.portfolioAssetType}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <p className="mt-3">
                            You will soon be able to view this portfolio at{" "}
                            <a
                                className="text-accent"
                                tabIndex={0}
                                href={`http://localhost:5173/portfolio/${modalData.portfolioID}`}
                            >
                                http://localhost:5173/portfolio/
                                {modalData.portfolioID}
                            </a>
                        </p>
                    </>
                )}
            </ModalHelper>
        </>
    );
}
