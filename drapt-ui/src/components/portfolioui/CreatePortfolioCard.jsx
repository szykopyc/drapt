import { CardOne } from "../baseui/CustomCard";
import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ModalHelper } from "../helperui/ModalHelper";
import { FormErrorHelper } from "../helperui/FormErrorHelper";
import { CustomButtonInputStyle } from "../baseui/CustomButton";
import { FormField } from "../helperui/FormFieldHelper";
import { useQueryClient } from "@tanstack/react-query";
import { useHookSearchUserByRole } from "../../reactqueryhooks/useAdminHook";
import { initialisePortfolio } from "../../lib/PortfolioServices";
import { teamMapperDict } from "../../helperfunctions/TeamMapper";

export function CreatePortfolioCard() {
  // data fetch via RQ hook for managers who are available to be assigned
  const { data: pmsAvailable = [], pmError } = useHookSearchUserByRole("pm");
  const queryClient = useQueryClient();

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
      portfolio_string_id: "", //this is just the PMs team name, e.g., industrial, apem, ...
      description: null,
    },
  });

  // prevents submission without filling in required details
  const typedname = watch("name");
  const typedPortfolioStringID = watch("portfolio_string_id");

  const allFieldsFilledMask = typedname && typedPortfolioStringID;

  // this makes the call to the API to add a portfolio
  const guardedSubmitHandler = async (data) => {
    console.log(data);
    if (!portfolioCreationConfirmed) return;

    const pmObject = pmsAvailable.find(
      (pm) => pm.team === data.portfolio_string_id
    );

    console.log(pmObject);

    const attributes = {
      portfolio_string_id: data.portfolio_string_id,
      name: data.name,
      description: data.description,
      pm_id: pmObject.id,
    };

    console.log(attributes);

    try {
      const result = await initialisePortfolio(attributes);

      // invalidate the portfolios query to refetch new
      queryClient.invalidateQueries({ queryKey: ["allportfolios"] });

      setModalData(data);
      setModalPMData(pmObject);

      if (portfolioConfirmedModalRef.current)
        portfolioConfirmedModalRef.current.showModal();
      resetForm();
      setPortfolioCreateError("");
      setPortfolioCreationConfirmed(false);
    } catch (error) {
      if (error.response?.status === 400) {
        setPortfolioCreationConfirmed(false);
        setPortfolioCreateError(
          "Sorry, the PM you selected already manages another portfolio."
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
            <FormField label={"Manager"}>
              <select
                className="select w-full"
                {...register("portfolio_string_id", {
                  required: "Portfolio manager is required",
                })}
                defaultValue={""}
              >
                <option value="" disabled>
                  Choose Manager
                </option>
                {pmsAvailable.map((pm) => (
                  <option key={pm.team} value={pm.team}>
                    {pm.fullname} -{" "}
                    {teamMapperDict[pm.team]}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label={"Description - Optional"}>
              <textarea
                className="textarea textarea-bordered w-full"
                {...register("description", {
                  validate: (description) => {
                    if (description.length > 1024)
                      return "The portfolio description cannot be over 1024 characters in length.";
                  },
                })}
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
