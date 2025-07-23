import { useState } from "react";
import { useForm } from "react-hook-form";
import { CustomCollapseArrow } from "../baseui/CustomCard";
import { LoadingSpinner } from "../helperui/LoadingSpinnerHelper";
import { isValidEmail } from "../validators/EmailValidator";
import { getPasswordStrength } from "../validators/PasswordValidator";
import CustomButton from "../baseui/CustomButton";
import { FormField } from "../helperui/FormFieldHelper";
import { FormErrorHelper } from "../helperui/FormErrorHelper";
import { searchUserByUsername, updateUser } from "../../lib/AdminServices";
import InnerEmptyState from "../errorui/InnerEmptyState";
import { FaSearchMinus } from "react-icons/fa";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { teamMapperDict } from "../../helperfunctions/TeamMapper";
import { roleMapperDict } from "../../helperfunctions/RoleMapper";

export function UserUpdateCard() {
  const [loadingFromSearch, setLoadingFromSearch] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  const [loadingAfterUpdate, setLoadingAfterUpdate] = useState(false);

  const [userDataFromSearch, setUserDataFromSearch] = useState({});

  const queryClient = useQueryClient();

  const [updateError, setUpdateError] = useState(null);
  const [searchError, setSearchError] = useState(null);

  const {
    register: registerSearch,
    handleSubmit: handleSubmitSearch,
    reset: resetSearch,
    watch: watchSearch,
    formState: { errors: errorsSearch },
  } = useForm({
    mode: "onSubmit",
  });

  const {
    register: registerUpdate,
    handleSubmit: handleSubmitUpdate,
    reset: resetUpdate,
    watch: watchUpdate,
    formState: { errors: errorsUpdate },
  } = useForm({
    mode: "onSubmit",
    defaultValues: {
      role: "",
      team: "",
    },
  });

  const allTeams = Object.keys(teamMapperDict);

  const teamOptionsByRole = {
    analyst: allTeams.filter((team) => team !== "executive"),
    senioranalyst: allTeams.filter((team) => team !== "executive"),
    pm: allTeams.filter((team) => team !== "executive"),
    vd: ["executive"],
    director: ["executive"],
    developer: ["executive"],
  };

  const watchedUsername = watchSearch("username")?.trim() || "";

  const onSearch = async (data) => {
    setShowUpdateForm(false);
    setLoadingFromSearch(true);
    setSearchError(null);
    try {
      if (data.username.trim() === "liysk64") {
        await new Promise((resolve) => setTimeout(resolve, 300));
        setSearchError(
          "403: Please don't update me. I will update myself if I need to :)"
        );
        setLoadingFromSearch(false);
        return;
      }
      const user = await searchUserByUsername(data.username.trim());
      await new Promise((resolve) => setTimeout(resolve, 300));
      setUserDataFromSearch(user);
      if (user) setShowUpdateForm(true);
    } catch (error) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setSearchError(
        error?.response?.data?.detail ||
        error?.message ||
        "Failed to find user."
      );
    } finally {
      setLoadingFromSearch(false);
    }
  };

  const onSubmit = async (data) => {
    setUpdateError(null);
    setLoadingAfterUpdate(true);
    try {
      const filteredData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== "")
      );

      const res = await updateUser(
        userDataFromSearch.id,
        filteredData
      );
      await new Promise((resolve) => setTimeout(resolve, 500));
      queryClient.invalidateQueries({ queryKey: ["user", role] });
      queryClient.invalidateQueries({ queryKey: ["allusers"] });
      resetUpdate();
      toast.success(`User updated! ${res.username} - ${res.fullname}`);
    } catch (error) {
      setUpdateError(
        error?.response?.data?.detail ||
        error?.message ||
        "Failed to update user."
      );
    }
    finally {
      setShowUpdateForm(false);
      resetSearch();
      setLoadingAfterUpdate(false);
    }
  };

  const selectedRole = watchUpdate("role");
  const allowedTeams = teamOptionsByRole[selectedRole] || [];

  const fullname = watchUpdate("fullname");
  const email = watchUpdate("email");
  const password = watchUpdate("password");
  const role = watchUpdate("role");
  const team = watchUpdate("team");

  const isAnyFieldFilled = !!(fullname || email || password || role || team);

  return (
    <>
      <CustomCollapseArrow
        id={"userCreationCard"}
        title={"Update a user"}
        defaultOpen={false}
        onClose={() => resetSearch()}
      >
        <form
          id="userToUpdate"
          className="flex flex-col md:flex-row gap-3 w-full"
          onSubmit={handleSubmitSearch(onSearch)}
          onChange={() => {
            setShowUpdateForm(false);
            setSearchError(null);
          }}
          autoComplete="off"
        >
          <div className="w-full md:w-4/5">
            <FormField label="Username">
              <input
                type="text"
                className="input input-bordered w-full"
                {...registerSearch("username", {
                  required: "Username is required",
                })}
                autoComplete="off"
              />
            </FormField>
          </div>
          <div className="flex w-full md:w-1/5 mt-auto">
            <CustomButton
              type="submit"
              form="userToUpdate"
              disabled={!watchedUsername}
            >
              Search
            </CustomButton>
          </div>
        </form>
        <div className="flex flex-col gap-1 w-full min-h-0">
          {Object.entries(errorsSearch).map(([field, errorObj]) =>
            errorObj?.message ? (
              <FormErrorHelper key={field} textSize="md">
                {errorObj.message}
              </FormErrorHelper>
            ) : null
          )}
        </div>
        {loadingFromSearch && <LoadingSpinner />}
        {searchError && !loadingFromSearch && (
          <div className="mt-[24px]">
            <InnerEmptyState
              title="We couldn't find the requested user"
              message="Are you sure you entered the correct username?"
              icon={
                <FaSearchMinus className="text-4xl text-base-content/40" />
              }
              enablePadding={false}
            >
              <FormErrorHelper textSize="md">
                {searchError}
              </FormErrorHelper>
            </InnerEmptyState>
          </div>
        )}

        {updateError && (
          <FormErrorHelper textSize="md">
            {updateError}
          </FormErrorHelper>
        )}
        {showUpdateForm && watchedUsername && !loadingFromSearch && (
          <>
            <div className="divider my-2"></div>
            <form
              id="updateUser"
              className="flex flex-col gap-3 w-full"
              onSubmit={handleSubmitUpdate(onSubmit)}
              autoComplete="off"
            >
              <FormField label="Update Full Name">
                <input
                  type="text"
                  className="input input-bordered w-full"
                  {...registerUpdate("fullname")}
                  autoComplete="off"
                  placeholder={userDataFromSearch.fullname}
                />
              </FormField>
              <FormField label="Update Email">
                <input
                  type="text"
                  className="input input-bordered w-full"
                  {...registerUpdate("email", {
                    validate: (value) => {
                      if (!value) return;
                      if (!isValidEmail(value))
                        return "Please enter a valid email address";
                    },
                  })}
                  autoComplete="off"
                  placeholder={userDataFromSearch.email}
                />
              </FormField>
              <FormField label="Update Password">
                <input
                  type="password"
                  className="input input-bordered w-full"
                  {...registerUpdate("password", {
                    validate: (value) =>
                      !value ||
                      getPasswordStrength(value) !==
                      "Weak" ||
                      "Password is too weak",
                  })}
                  autoComplete="new-password"
                />
              </FormField>
              <FormField label="Update Role">
                <select
                  className="select w-full"
                  {...registerUpdate("role")}
                >
                  <option value="" disabled>
                    Update Role - Current:{" "}
                    {
                      roleMapperDict[
                      userDataFromSearch.role
                      ]
                    }
                  </option>
                  {Object.keys(roleMapperDict).map((role) => (
                    <option key={role} value={role}>
                      {roleMapperDict[role]}
                    </option>
                  ))}
                </select>
              </FormField>
              <FormField label="Update Team">
                <select
                  className="select w-full"
                  {...registerUpdate("team")}
                >
                  <option value="" disabled>
                    Update Team - Current:{" "}
                    {
                      teamMapperDict[
                      userDataFromSearch.team
                      ]
                    }
                  </option>
                  {allowedTeams.map((team) => (
                    <option key={team} value={team}>
                      {teamMapperDict[team]}
                    </option>
                  ))}
                </select>
              </FormField>
            </form>
            <div className="flex flex-row gap-3 mt-3 w-full">
              <div className="flex w-4/5">
                <CustomButton
                  form={"updateUser"}
                  disabled={!isAnyFieldFilled | loadingAfterUpdate}
                >
                  {loadingAfterUpdate ? "Updating user..." : "Update User"}
                </CustomButton>
              </div>
              <div className="flex w-1/5">
                <CustomButton
                  onClick={() => resetUpdate()}
                  colour="error"
                  disabled={!isAnyFieldFilled}
                >
                  Reset
                </CustomButton>
              </div>
            </div>
          </>
        )}
        {errorsUpdate && (
          <div className="flex flex-col gap-1 w-full min-h-0">
            {Object.entries(errorsUpdate).map(([field, errorObj]) =>
              errorObj?.message ? (
                <FormErrorHelper key={field} textSize="md">
                  {errorObj.message}
                </FormErrorHelper>
              ) : null
            )}
          </div>
        )}
      </CustomCollapseArrow>
    </>
  );
}
