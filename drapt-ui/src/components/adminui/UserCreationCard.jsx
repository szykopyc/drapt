import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { CustomCollapseArrow } from "../baseui/CustomCard";
import { ModalHelper } from "../helperui/ModalHelper";
import { FormErrorHelper } from "../helperui/FormErrorHelper";
import { isValidEmail } from "../validators/EmailValidator";
import { getPasswordStrength } from "../validators/PasswordValidator";
import LargeSubmit from "../baseui/LargeSubmitHelper";
import { ResetFormButton } from "../helperui/ResetFormHelper";
import { FormField } from "../helperui/FormFieldHelper"; // <-- import FormField

import { register as registerUser } from "../../services/RegisterUserService";

export function UserCreationCard() {
    const userAddModalRef = useRef(null);
    const [modalData, setModalData] = useState(null);

    const {
        register,
        handleSubmit,
        reset: resetForm,
        watch,
        formState: { errors },
    } = useForm({
        mode: "onSubmit",
        defaultValues: {
            role: "",
            team: "",
        },
    });

    const selectedRole = watch("role");

    const teamOptionsByRole = {
        analyst: [
            "Industrial",
            "TMT",
            "Europe",
            "US & Canada",
            "Metals, Mining and Commodities",
        ],
        pm: [
            "Industrial",
            "TMT",
            "Europe",
            "US & Canada",
            "Metals, Mining and Commodities",
        ],
        vd: ["Executive"],
        director: ["Executive"],
        developer: ["Executive"],
    };

    const allowedTeams = teamOptionsByRole[selectedRole] || [];

    const onSubmit = async (data) => {
        if (!isValidEmail(data.email)) {
            return;
        }

        try {
            const tryRegisterUser = await registerUser(
                data.email.toLowerCase(),
                data.password,
                data.fullName,
                data.username.toLowerCase(),
                data.role.toLowerCase(),
                data.team.toLowerCase()
            );
            setModalData(tryRegisterUser);
            if (userAddModalRef.current) userAddModalRef.current.showModal();
            resetForm();
        } catch (err) {}
    };

    const typedFullName = watch("fullName");
    const typedUserName = watch("username");
    const typedEmail = watch("email");
    const typedPassword = watch("password");
    const selectedTeam = watch("team");

    const allFieldsFilledMask =
        typedFullName &&
        typedUserName &&
        typedEmail &&
        typedPassword &&
        selectedRole &&
        selectedTeam;
    const someFieldsFilledMask =
        typedFullName ||
        typedUserName ||
        typedEmail ||
        typedPassword ||
        selectedRole ||
        selectedTeam;

    return (
        <>
            <CustomCollapseArrow
                id={"userCreationCard"}
                title={"Add a new user"}
                defaultOpen={false}
            >
                <form
                    id="addUser"
                    className="flex flex-col gap-3 w-full"
                    onSubmit={handleSubmit(onSubmit)}
                    autoComplete="off"
                >
                    <FormField
                        label="Full Name"
                        error={errors.fullName && errors.fullName.message}
                    >
                        <input
                            type="text"
                            className="input input-bordered w-full"
                            {...register("fullName", {
                                required: "Full name is required",
                            })}
                            autoComplete="off"
                        />
                    </FormField>
                    <FormField
                        label="Username"
                        error={errors.username && errors.username.message}
                    >
                        <input
                            type="text"
                            className="input input-bordered w-full"
                            {...register("username", {
                                required: "Username is required",
                            })}
                            autoComplete="off"
                        />
                    </FormField>
                    <FormField
                        label="Email"
                        error={errors.email && errors.email.message}
                    >
                        <input
                            type="text"
                            className="input input-bordered w-full"
                            {...register("email", {
                                required: "Email is required",
                                validate: (value) =>
                                    isValidEmail(value) ||
                                    "Please enter a valid email address",
                            })}
                            autoComplete="off"
                        />
                    </FormField>
                    <FormField
                        label="Default Password"
                        error={errors.password && errors.password.message}
                    >
                        <input
                            type="password"
                            className="input input-bordered w-full"
                            {...register("password", {
                                required: "Password is required",
                                validate: (value) =>
                                    getPasswordStrength(value) === "Weak"
                                        ? "Password is too weak"
                                        : true,
                            })}
                            autoComplete="new-password"
                        />
                    </FormField>
                    <FormField
                        label="Select Role"
                        error={errors.role && errors.role.message}
                    >
                        <select
                            className="select w-full"
                            {...register("role", {
                                required: "Please select a role",
                            })}
                            defaultValue=""
                        >
                            <option value="" disabled>
                                Select Role
                            </option>
                            <option value={"analyst"}>Analyst</option>
                            <option value={"pm"}>Manager</option>
                            <option value={"vd"}>Vice Director</option>
                            <option value={"director"}>Director</option>
                            <option value={"developer"}>Developer</option>
                        </select>
                    </FormField>
                    <FormField
                        label="Select Team"
                        error={errors.team && errors.team.message}
                    >
                        <select
                            className="select w-full"
                            {...register("team", {
                                required: "Please select a team",
                            })}
                        >
                            <option value="" disabled>
                                Select Team
                            </option>
                            {allowedTeams.map((team) => (
                                <option key={team} value={team}>
                                    {team}
                                </option>
                            ))}
                        </select>
                    </FormField>
                </form>
                <div className="flex flex-row gap-2 mt-3 w-full">
                    <div className="w-4/5">
                        <LargeSubmit
                            form={"addUser"}
                            disabled={!allFieldsFilledMask}
                        >
                            Add User
                        </LargeSubmit>
                    </div>
                    <div className="w-1/5">
                        <ResetFormButton
                            resetFn={resetForm}
                            disabled={!someFieldsFilledMask}
                        />
                    </div>
                </div>
            </CustomCollapseArrow>
            <ModalHelper
                id={"add_user_modal"}
                reference={userAddModalRef}
                modalTitle={"User Added"}
            >
                {modalData && (
                    <div className="flex flex-col justify-between gap-2">
                        <div className="flex justify-between">
                            Full Name
                            <span className="text-primary">
                                {modalData.fullname}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            Username
                            <span className="text-primary">
                                {modalData.username}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            Email
                            <span className="text-primary">
                                {modalData.email}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            Role
                            <span className="text-primary">
                                {modalData.role}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            Team
                            <span className="text-primary">
                                {modalData.team}
                            </span>
                        </div>
                    </div>
                )}
            </ModalHelper>
        </>
    );
}
