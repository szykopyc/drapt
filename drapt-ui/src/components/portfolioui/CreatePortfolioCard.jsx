import { CardOne } from "../baseui/CustomCard";
import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ModalHelper } from "../helperui/ModalHelper";
import { FormErrorHelper } from "../helperui/FormErrorHelper";
import { CustomButtonInputStyle } from "../baseui/CustomButton";
import { FormField } from "../helperui/FormFieldHelper";
import { searchUserByRole } from "../../lib/AdminServices";
import { initialisePortfolio } from "../../lib/PortfolioServices";

export function CreatePortfolioCard() {
    // initialise states for managers who are available to be assigned
    const [pmsAvailable, setPmsAvailable] = useState([]);
    let pmError = false;

    // initialise states for errors
    const [portfolioCreateError, setPortfolioCreateError] = useState(null);

    // modal stuff
    const [modalData, setModalData] = useState(null);
    const [modalPMData, setModalPMData] = useState(null);
    const portfolioConfirmedModalRef = useRef(null);

    // confirmation button things
    const [portfolioCreationConfirmed, setPortfolioCreationConfirmed] =
        useState(false);

    const handleCreatePortfolioClick = async (e) => {
        e.preventDefault();
        const valid = await trigger();
        if (valid) setPortfolioCreationConfirmed(true);
    };

    // fetches all PMs
    useEffect(() => {
        const fetchManagers = async () => {
            try {
                const fetchedManagerData = await searchUserByRole("pm");
                if (Array.isArray(fetchedManagerData)) {
                    setPmsAvailable(fetchedManagerData);
                }
            } catch (error) {}
        };
        fetchManagers();
    }, []);

    // handles the form
    const {
        register,
        handleSubmit,
        reset: resetForm,
        watch,
        formState: { errors },
        trigger,
    } = useForm({
        mode: "onSubmit",
        defaultValues: {
            name: "",
            portfolio_string_id: "",
            pm_id: "",
            description: null,
        },
    });

    // prevents submission without filling in required details
    const typedname = watch("name");
    const typedUniqueportfolio_string_id = watch("portfolio_string_id");
    const typedPM = watch("pm_id");

    const allFieldsFilledMask =
        typedname && typedUniqueportfolio_string_id && typedPM;

    // this makes the call to the API to add a portfolio
    const guardedSubmitHandler = async (data) => {
        if (!portfolioCreationConfirmed) return;

        const attributes = {
            portfolio_string_id: data.portfolio_string_id,
            name: data.name,
            description: data.description,
            pm_id: parseInt(data.pm_id),
        };

        try {
            const result = await initialisePortfolio(attributes);
            setModalData(data);

            // Lookup the PM object by ID and set it
            const pmObj = pmsAvailable.find(
                (pm) => pm.id === parseInt(data.pm_id)
            );
            setModalPMData(pmObj);

            if (portfolioConfirmedModalRef.current)
                portfolioConfirmedModalRef.current.showModal();
            resetForm();
            setPortfolioCreateError("");
            setPortfolioCreationConfirmed(false);
        } catch (error) {
            console.log(error);
            if (error.response?.status === 400) {
                setPortfolioCreationConfirmed(false);
                setPortfolioCreateError(
                    "Sorry, that portfolio ID is already taken."
                );
            }
        }
    };

    return (
        <>
            <CardOne title={"Initialise Portfolio Form"}>
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
                                {...register("name", {
                                    required: "Portfolio name is required",
                                })}
                                placeholder={"e.g., Industrial, US and Canada"}
                                autoComplete="off"
                                disabled={portfolioCreationConfirmed}
                            />
                        </FormField>
                        <FormField
                            label={
                                "Unique Portfolio ID - no symbols, spaces, capitals, numbers"
                            }
                        >
                            <input
                                type="text"
                                className="input input-bordered w-full"
                                {...register("portfolio_string_id", {
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
                                        if (/[A-Z]/.test(value) == true) {
                                            return "Portfolio ID must not contain capitals";
                                        }
                                    },
                                })}
                                placeholder={"e.g., industrial, tech"}
                                autoComplete="off"
                                disabled={portfolioCreationConfirmed}
                            />
                        </FormField>
                        <FormField label={"Manager"}>
                            <select
                                className="select w-full"
                                {...register("pm_id", {
                                    required: "Portfolio manager is required",
                                })}
                                defaultValue={""}
                            >
                                <option value="" disabled>
                                    Choose Manager
                                </option>
                                {pmsAvailable.map((pm) => (
                                    <option key={pm.id} value={pm.id}>
                                        {pm.username} - {pm.fullname}
                                    </option>
                                ))}
                            </select>
                        </FormField>
                        <FormField label={"Description - Optional"}>
                            <textarea
                                className="textarea textarea-bordered w-full"
                                {...register("description")}
                                autoComplete="off"
                                placeholder="E.g., The Industrial and Resources portfolio is ..."
                                disabled={portfolioCreationConfirmed}
                            ></textarea>
                        </FormField>
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
                {portfolioCreateError && (
                    <div className="flex flex-col gap-1 w-full min-h-0">
                        <FormErrorHelper textSize="md">
                            {portfolioCreateError}
                        </FormErrorHelper>
                    </div>
                )}
            </CardOne>
            <ModalHelper
                id={"portfolio_confirm"}
                reference={portfolioConfirmedModalRef}
                modalTitle={"Portfolio Created"}
                width={70}
            >
                {modalData && modalPMData && (
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
                                        {modalData.name}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Portfolio String ID</td>
                                    <td className="font-semibold">
                                        {modalData.portfolio_string_id}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Manager</td>
                                    <td className="font-semibold">
                                        {modalPMData.fullname}
                                    </td>
                                </tr>
                                {modalData.description && (
                                    <tr>
                                        <td>Description</td>
                                        <td className="font-semibold">
                                            {modalData.description}
                                        </td>
                                    </tr>
                                )}
                                <tr>
                                    <td>Creation Date</td>
                                    <td className="font-semibold">
                                        {new Date().toISOString().split("T")[0]}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </>
                )}
            </ModalHelper>
        </>
    );
}
