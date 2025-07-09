import { useParams } from "react-router-dom";
import { CardOne } from "../baseui/CustomCard";
import { useForm } from "react-hook-form";
import React, { useState, useRef } from "react";
import { ModalHelper } from "../helperui/ModalHelper";
import { FormErrorHelper } from "../helperui/FormErrorHelper";
import { CustomButtonInputStyle } from "../baseui/CustomButton";
import { FormField } from "../helperui/FormFieldHelper";

import InnerEmptyState from "../errorui/InnerEmptyState";
import { MdErrorOutline } from "react-icons/md";
import { LoadingSpinner } from "../helperui/LoadingSpinnerHelper";
import { hookSearchPortfolioOverview } from "../../reactqueryhooks/usePortfolioHook";

export function PortfolioAdminPanel() {
  const { portfolioID } = useParams();

  const { data: portfolioOverviewData = [], isLoading, isError, error } = hookSearchPortfolioOverview(portfolioID);

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

        <CardOne title={"Portfolio Administration"}></CardOne>
      )}
    </>
  );
}
