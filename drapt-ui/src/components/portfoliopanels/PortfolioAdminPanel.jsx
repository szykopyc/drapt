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

    const portfolioAdminModalRef = useRef(null);
    const [modalData, setModalData] = useState(null);
    const [portfolioAdminConfirmed, setPortfolioAdminConfirmed] =
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
    });

    const handlePortfolioAdminClick = async (e) => {
        e.preventDefault();
        const valid = await trigger();
        if (valid) setPortfolioAdminConfirmed(true);
    };

    const guardedSubmitHandler = (data) => {
        if (!portfolioAdminConfirmed) return;
    };

    return (
        <>
            <CardOne title={"Portfolio Administration"}></CardOne>
        </>
    );
}
