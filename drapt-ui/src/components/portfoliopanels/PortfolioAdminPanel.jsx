import { useParams } from "react-router-dom";
import { CardOne, CustomCollapseArrow } from "../baseui/CustomCard";
import { useForm } from "react-hook-form";
import React, { useState, useRef } from "react";
import { ModalHelper } from "../helperui/ModalHelper";
import { FormErrorHelper } from "../helperui/FormErrorHelper";
import { CustomButtonInputStyle } from "../baseui/CustomButton";
import { FormField } from "../helperui/FormFieldHelper";
import InnerEmptyState from "../errorui/InnerEmptyState";
import { MdErrorOutline } from "react-icons/md";
import { LoadingSpinner } from "../helperui/LoadingSpinnerHelper";
import { useHookSearchPortfolioOverview } from "../../reactqueryhooks/usePortfolioHook";
import { updatePortfolioMetadata } from "../../lib/PortfolioServices";
import { useQueryClient } from "@tanstack/react-query";

export function PortfolioAdminPanel() {
  const { portfolioID } = useParams();

  const { data: portfolioOverviewData = [], isLoading, isError, error } = useHookSearchPortfolioOverview(portfolioID);

  const queryClient = useQueryClient();

  const [isLoadingAfterUpdate, setIsLoadingAfterUpdate] = useState(false);

  const [portfolioUpdateConfirmed, setPortfolioUpdateConfirmed] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    trigger,
    formState: { errors: errorsOnFormUpdate },
  } = useForm({
    mode: "onSubmit"
  });

  const portfolioUpdateClickHandler = async (e) => {
    e.preventDefault();
    const valid = await trigger();
    if (valid) setPortfolioUpdateConfirmed(true);
  }

  const guardedUpdateHandler = async (data) => {
    setIsLoadingAfterUpdate(true);
    try {
      const filteredData = Object.fromEntries(Object.entries(data).filter(([_, value]) => value !== ""))
      const updatedPortfolio = await updatePortfolioMetadata(portfolioOverviewData.id, filteredData);
      queryClient.invalidateQueries(["portfolio", portfolioOverviewData.portfolio_string_id]);
      reset();
      setPortfolioUpdateConfirmed(false);
    }
    catch (error) {
      return;
    }
    finally {
      setIsLoadingAfterUpdate(false);
    }
  }

  const isAnyUpdateFieldFilled = (watch("name") || watch("description"));

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : isError ? (
        <div className="flex flex-col items-center justify-center">
          <InnerEmptyState
            title={"An Error Occurred"}
            message={error?.response?.data?.detail || error?.message || "An unknown error occurred."}
            icon={<MdErrorOutline className="text-4xl text-error" />}
          />
        </div>
      ) : (
        <CustomCollapseArrow title={"Update Portfolio Details"} defaultOpen={false} onClose={() => reset()}>
          <form
            id={"portfolioToUpdate"}
            className="flex flex-col gap-3 w-full"
            onSubmit={handleSubmit(guardedUpdateHandler)}
            autoComplete="off"
          >
            <FormField label={"Update Portfolio Name"}>
              <input type="text"
                className="input input-bordered w-full"
                {...register("name", {
                  validate: (name) => {
                    if (name == null) return true;
                    if (name !== null && name.length > 50)
                      return "The portfolio name cannot be over 50 characters in length."
                  }
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
                    if (description !== null && description.length > 1024)
                      return "The portfolio description cannot be over 255 characters in length."
                  }
                })}
                autoComplete="off"
                placeholder={portfolioOverviewData?.description.slice(0, 100) + "..."}
              // add disabled field 
              ></textarea>
            </FormField>
            <div className="h-[40px] flex gap-3 w-full">
              {!portfolioUpdateConfirmed ? (
                <CustomButtonInputStyle
                  colour="success"
                  type="button"
                  onClick={portfolioUpdateClickHandler}
                  disabled={!isAnyUpdateFieldFilled}
                >
                  Update Portfolio
                </CustomButtonInputStyle>
              ) : (
                <>
                  <CustomButtonInputStyle
                    form="portfolioToUpdate"
                    colour="success"
                    type="submit"
                  >Confirm</CustomButtonInputStyle>
                  <CustomButtonInputStyle
                    colour="error"
                    onClick={() => setPortfolioUpdateConfirmed(false)}
                  >
                    Cancel
                  </CustomButtonInputStyle>
                </>
              )}
            </div>
          </form>
          {errorsOnFormUpdate && (
            <div className="flex flex-col gap-1 w-full min-h-0">
              {Object.entries(errorsOnFormUpdate).map(([field, errorObj]) =>
                errorObj?.message ? (
                  <FormErrorHelper key={field} textSize="md">
                    {errorObj.message}
                  </FormErrorHelper>
                ) : null,
              )}
            </div>
          )}
        </CustomCollapseArrow>
      )}
    </>
  );
}
