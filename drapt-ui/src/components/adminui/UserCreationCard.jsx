import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { CustomCollapseArrow } from "../baseui/CustomCard";
import { ModalHelper } from "../helperui/ModalHelper";
import { FormErrorHelper } from "../helperui/FormErrorHelper";
import { isValidEmail } from "../validators/EmailValidator";
import { getPasswordStrength } from "../validators/PasswordValidator";
import { LargeSubmit } from "../helperui/LargeSubmitHelper";
import { ResetFormButton } from "../helperui/ResetFormHelper";
import { FormField } from "../helperui/FormFieldHelper"; // <-- import FormField

export function UserCreationCard() {
  const userAddModalRef = useRef(null);
  const [modalData, setModalData] = useState(null);

  const { register, handleSubmit, reset: resetForm, watch, formState: { errors } } = useForm({
    mode:"onChange",
    defaultValues: {
      role: "",
      team: "",
    }});

  const selectedRole = watch("role");
  
  const teamOptionsByRole = {
    Analyst: ["Industrial", "TMT", "Europe", "US & Canada", "Metals, Mining and Commodities"],
    "Senior Analyst": ["Industrial", "TMT", "Europe", "US & Canada", "Metals, Mining and Commodities"],
    Manager: ["Industrial", "TMT", "Europe", "US & Canada", "Metals, Mining and Commodities"],
    "Vice Director": ["Executive"],
    Director: ["Executive"],
    Developer: ["Executive"]
  };

  const allowedTeams = teamOptionsByRole[selectedRole] || [];

  const onSubmit = (data) => {
    if (!isValidEmail(data.email)) {
      return;
    }

    setModalData(data);
    if (userAddModalRef.current) userAddModalRef.current.showModal();
    resetForm();
  };

  const typedFullName = watch("fullName");
  const typedUserName = watch("username");
  const typedEmail = watch("email");
  const typedPassword = watch("password");
  const selectedTeam = watch("team");

  const allFieldsFilledMask = (typedFullName && typedUserName && typedEmail && typedPassword && selectedRole && selectedTeam);
  const someFieldsFilledMask = (typedFullName || typedUserName || typedEmail || typedPassword || selectedRole || selectedTeam)

  return (
    <>
      <CustomCollapseArrow id={"userCreationCard"} title={"Add a new user"} defaultOpen={false}>
        <form id="addUser" className="flex flex-col gap-3 w-full" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <FormField label="Full Name" error={errors.fullName && errors.fullName.message}>
            <input
              type="text"
              className="input input-bordered w-full"
              {...register("fullName", { required: "Full name is required" })}
              autoComplete="off"
            />
          </FormField>
          <FormField label="Username" error={errors.username && errors.username.message}>
            <input
              type="text"
              className="input input-bordered w-full"
              {...register("username", { required: "Username is required" })}
              autoComplete="off"
            />
          </FormField>
          <FormField label="Email" error={errors.email && errors.email.message}>
            <input
              type="text"
              className="input input-bordered w-full"
              {...register("email", {
                required: "Email is required",
                validate: value => isValidEmail(value) || "Please enter a valid email address"
              })}
              autoComplete="off"
            />
          </FormField>
          <FormField label="Default Password" error={errors.password && errors.password.message}>
            <input
              type="password"
              className="input input-bordered w-full"
              {...register("password", { 
                required: "Password is required",
                validate: value => getPasswordStrength(value) === "Weak" ? "Password is too weak" : true
              })}
              autoComplete="new-password"
            />
          </FormField>
          <FormField label="Select Role" error={errors.role && errors.role.message}>
            <select
              className="select w-full"
              {...register("role", { required: "Please select a role" })}
              defaultValue=""
            >
              <option value="" disabled>Select Role</option>
              <option>Analyst</option>
              <option>Senior Analyst</option>
              <option>Manager</option>
              <option>Vice Director</option>
              <option>Director</option>
              <option>Developer</option>
            </select>
          </FormField>
          <FormField label="Select Team" error={errors.team && errors.team.message}>
            <select
              className="select w-full"
              {...register("team", { required: "Please select a team" })}
            >
              <option value="" disabled>Select Team</option>
              {allowedTeams.map(team=>(
                <option key={team} value={team}>{team}</option>
              ))}
            </select>
          </FormField>
        </form>
        <div className="flex flex-row gap-2 mt-3 w-full">
          <LargeSubmit form={"addUser"} size={4} disabled={!allFieldsFilledMask}>
            Add User
          </LargeSubmit>
          <ResetFormButton resetFn={resetForm} disabled={!someFieldsFilledMask}/>
        </div>
      </CustomCollapseArrow>
      <ModalHelper id={"add_user_modal"} reference={userAddModalRef} modalTitle={"User Added"}>
          {modalData && (
            <div className="py-2 flex flex-col justify-between gap-2">
              <div className="flex justify-between">Full Name<span className="text-primary">{modalData.fullName}</span></div>
              <div className="flex justify-between">Username<span className="text-primary">{modalData.username}</span></div>
              <div className="flex justify-between">Email<span className="text-primary">{modalData.email}</span></div>
              <div className="flex justify-between">Role<span className="text-primary">{modalData.role}</span></div>
              <div className="flex justify-between">Team<span className="text-primary">{modalData.team}</span></div>
            </div>
          )}
      </ModalHelper>
    </>
  );
}