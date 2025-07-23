import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { CustomCollapseArrow } from "../baseui/CustomCard";
import ModalHelper from "../helperui/ModalHelper";
import { FormErrorHelper } from "../helperui/FormErrorHelper";
import { isValidEmail } from "../validators/EmailValidator";
import { getPasswordStrength } from "../validators/PasswordValidator";
import { FormField } from "../helperui/FormFieldHelper";
import InnerEmptyState from "../errorui/InnerEmptyState";
import { LoadingSpinner } from "../helperui/LoadingSpinnerHelper";
import CustomButton from "../baseui/CustomButton";
import { useQueryClient } from "@tanstack/react-query";
import { teamMapperDict } from "../../helperfunctions/TeamMapper";
import { roleMapperDict } from "../../helperfunctions/RoleMapper";
import toast from "react-hot-toast";
import { register as registerUser } from "../../lib/RegisterUserService";

export function UserCreationCard() {
  const [userCreationError, setUserCreationError] = useState("");

  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

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

  const reset = () => {
    resetForm();
    setUserCreationError("");
    setLoading(false);
  };

  const selectedRole = watch("role");

  const allTeams = Object.keys(teamMapperDict);

  const teamOptionsByRole = {
    analyst: allTeams.filter((team) => team !== "executive"),
    senioranalyst: allTeams.filter((team) => team !== "executive"),
    pm: allTeams.filter((team) => team !== "executive"),
    vd: ["executive"],
    director: ["executive"],
    developer: ["executive"],
  };

  const allowedTeams = teamOptionsByRole[selectedRole] || [];

  const onSubmit = async (data) => {
    if (!isValidEmail(data.email)) {
      return;
    }

    setUserCreationError("");
    setLoading(true);

    try {
      await registerUser(
        data.email.toLowerCase(),
        data.password,
        data.fullName,
        data.username.toLowerCase(),
        data.role.toLowerCase(),
        data.team.toLowerCase()
      );
      await new Promise((resolve) => setTimeout(resolve, 300));
      queryClient.invalidateQueries({ queryKey: ["allusers"] });
      resetForm();
      toast.success(`User Added! ${data.fullName}`)
    } catch (error) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setUserCreationError(
        error?.response?.data?.detail ||
        error?.message ||
        "Failed to create user"
      );
    } finally {
      setLoading(false);
    }
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
        onClose={() => resetForm()}
      >
        <form
          id="addUser"
          className="flex flex-col gap-3 w-full"
          onSubmit={handleSubmit(onSubmit)}
          autoComplete="off"
        >
          <FormField label="Full Name">
            <input
              type="text"
              className="input input-bordered w-full"
              {...register("fullName", {
                required: "Full name is required",
              })}
              autoComplete="off"
            />
          </FormField>
          <FormField label="Username">
            <input
              type="text"
              className="input input-bordered w-full"
              {...register("username", {
                required: "Username is required",
              })}
              autoComplete="off"
            />
          </FormField>
          <FormField label="Email">
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
          <FormField label="Default Password">
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
          <FormField label="Select Role">
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
              {Object.keys(roleMapperDict).map((role) => (
                <option key={role} value={role}>
                  {roleMapperDict[role]}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Select Team">
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
                  {teamMapperDict[team]}
                </option>
              ))}
            </select>
          </FormField>
        </form>
        <div className="flex flex-col md:flex-row gap-3 mt-3 w-full">
          <div className="flex w-full md:w-4/5">
            <CustomButton
              form={"addUser"}
              disabled={!allFieldsFilledMask | loading}
            >
              {loading ? "Adding User..." : !allFieldsFilledMask ? "Fill Required Fields" : "Add User"}
            </CustomButton>
          </div>
          <div className="flex w-full md:w-1/5">
            <CustomButton
              onClick={() => reset()}
              disabled={!someFieldsFilledMask}
              colour="error"
            >
              Reset
            </CustomButton>
          </div>
        </div>
        {loading && <LoadingSpinner />}
        <div className="flex flex-col gap-1 w-full">
          {Object.entries(errors).map(([field, errorObj]) =>
            errorObj?.message ? (
              <FormErrorHelper key={field} textSize="md">
                {errorObj.message}
              </FormErrorHelper>
            ) : null
          )}
        </div>
        {userCreationError && (
          <div className="mt-6">
            <InnerEmptyState
              title="Failed to create user"
              message="We failed to create the user you requested. Maybe try a different username or email."
              enablePadding={false}
            >
              <FormErrorHelper textSize="md">
                {userCreationError}
              </FormErrorHelper>
            </InnerEmptyState>
          </div>
        )}
      </CustomCollapseArrow>
    </>
  );
}
