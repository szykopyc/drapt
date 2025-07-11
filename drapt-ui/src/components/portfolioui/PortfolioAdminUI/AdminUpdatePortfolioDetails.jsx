import { useParams } from "react-router-dom";
import { CustomCollapseArrow } from "../../baseui/CustomCard";
import { useForm } from "react-hook-form";
import React, { useState } from "react";
import { FormErrorHelper } from "../../helperui/FormErrorHelper";
import { CustomButtonInputStyle } from "../../baseui/CustomButton";
import { FormField } from "../../helperui/FormFieldHelper";
import { useHookSearchPortfolioOverview } from "../../../reactqueryhooks/usePortfolioHook";
import { updatePortfolioMetadata } from "../../../lib/PortfolioServices";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function AdminUpdatePortfolioDetails() {
  const { portfolioID } = useParams();

  const { data: portfolioOverviewData = [] } = useHookSearchPortfolioOverview(portfolioID);

  const queryClient = useQueryClient();

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
    mode: "onSubmit"
  });

  const isAnyUpdateFieldFilled = (watch("name") || watch("description"));

  // PORTFOLIO CLICK TO CONFIRM button
  const [portfolioUpdateConfirmed, setPortfolioUpdateConfirmed] = useState(false);
  const [isPortfolioBeingUpdated, setIsPortfolioBeingUpdated] = useState(false);

  const portfolioUpdateClickHandler = async (e) => {
    e.preventDefault();
    const valid = await trigger();
    if (valid) setPortfolioUpdateConfirmed(true);
  }

  // THIS IS FOR UPDATING PORTFOLIO METADATA
  const guardedUpdateHandler = async (data) => {
    try {
      const filteredData = Object.fromEntries(Object.entries(data).filter(([_, value]) => value !== ""))
      setIsPortfolioBeingUpdated(true);
      await updatePortfolioMetadata(portfolioOverviewData.id, filteredData);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setIsPortfolioBeingUpdated(false);
      queryClient.invalidateQueries(["portfolio", portfolioOverviewData.portfolio_string_id]);
      reset();
      setPortfolioUpdateConfirmed(false);
      toast.success("Successfuly modified portfolio details");
    }
    catch (error) {
      return error;
    }
  }

  return (
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
                  return "The portfolio description cannot be over 1024 characters in length."
              }
            })}
            autoComplete="off"
            placeholder={portfolioOverviewData?.description ? portfolioOverviewData.description.slice(0, 150) + "..." : "No current description"}
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
              >{isPortfolioBeingUpdated ? "Updating portfolio..." : "Confirm"}</CustomButtonInputStyle>
              <CustomButtonInputStyle
                colour="error"
                onClick={() => setPortfolioUpdateConfirmed(false)}
                disabled={isPortfolioBeingUpdated}
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
  );
}
