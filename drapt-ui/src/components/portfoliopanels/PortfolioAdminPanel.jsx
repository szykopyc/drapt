import { useParams } from "react-router-dom";
import { CardOne } from "../baseui/CustomCard";
import { useForm } from "react-hook-form";
import React, { useState, useRef } from "react";
import { ModalHelper } from "../helperui/ModalHelper";
import { FormErrorHelper } from "../helperui/FormErrorHelper";
import { CustomButtonInputStyle } from "../baseui/CustomButton";
import { FormField } from "../helperui/FormFieldHelper";

import SectionMaintenanceWarning from "../baseui/SectionMaintenanceWarning";

export function PortfolioAdminPanel() {
  const { portfolioID } = useParams();

  return (
    <>
      <CardOne title={"Portfolio Administration"}></CardOne>
    </>
  );
}
