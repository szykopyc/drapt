import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { CustomCollapseArrow } from "../baseui/CustomCard";
import { ModalHelper } from "../helperui/ModalHelper";
import { LoadingSpinner } from "../helperui/LoadingSpinnerHelper";
import { isValidEmail } from "../validators/EmailValidator";
import { getPasswordStrength } from "../validators/PasswordValidator";
import LargeSubmit from "../baseui/LargeSubmitHelper";
import { ResetFormButton } from "../helperui/ResetFormHelper";
import { FormField } from "../helperui/FormFieldHelper";
import { FormErrorHelper } from "../helperui/FormErrorHelper";
import { searchUserByUsername, updateUser } from "../../lib/AdminServices";
import InnerEmptyState from "../errorui/InnerEmptyState";
import { FaSearchMinus } from "react-icons/fa";

import { useQueryClient } from "@tanstack/react-query";
import { teamMapperDict } from "../../helperfunctions/TeamMapper";
import { roleMapperDict } from "../../helperfunctions/RoleMapper";

export function UserUpdateCard() {
  const [loading, setLoading] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  const userUpdateModalRef = useRef(null);
  const [modalData, setModalData] = useState(null);

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
    setLoading(true);
    setSearchError(null);
    try {
      if (data.username.trim() === "liysk64") {
        await new Promise((resolve) => setTimeout(resolve, 300));
        setSearchError(
          "403: Please don't update me. I will update myself if I need to :)",
        );
        setLoading(false);
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
        "Failed to find user.",
      );
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setUpdateError(null);
    try {
      const filteredData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== ""),
      );
      const updatedUser = await updateUser(userDataFromSearch.id, filteredData);
      queryClient.invalidateQueries({ queryKey: ["user", role] });
      queryClient.invalidateQueries({ queryKey: ["allusers"] });
      setModalData({
        ...filteredData,
        username: updatedUser.username,
        portfolio_id: updatedUser.portfolio_id,
      });
      if (userUpdateModalRef.current) userUpdateModalRef.current.showModal();
      resetUpdate();
    } catch (error) {
      setUpdateError(
        error?.response?.data?.detail ||
        error?.message ||
        "Failed to update user.",
      );
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

  const handleModalClose = () => {
    setSearchError(null);
    setUpdateError(null);
    setModalData(null);
  };

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
          <div className="w-full md:w-1/5 mt-auto">
            <LargeSubmit disabled={!watchedUsername}>Search</LargeSubmit>
          </div>
        </form>
        <div className="flex flex-col gap-1 w-full min-h-0">
          {Object.entries(errorsSearch).map(([field, errorObj]) =>
            errorObj?.message ? (
              <FormErrorHelper key={field} textSize="md">
                {errorObj.message}
              </FormErrorHelper>
            ) : null,
          )}
        </div>
        {loading && <LoadingSpinner />}
        {searchError && !loading && (
          <div className="mt-[24px]">
            <InnerEmptyState
              title="We couldn't find the requested user"
              message="Are you sure you entered the correct username?"
              icon={<FaSearchMinus className="text-4xl text-base-content/40" />}
              enablePadding={false}
            >
              <FormErrorHelper textSize="md">{searchError}</FormErrorHelper>
            </InnerEmptyState>
          </div>
        )}

        {updateError && (
          <FormErrorHelper textSize="md">{updateError}</FormErrorHelper>
        )}
        {showUpdateForm && watchedUsername && !loading && (
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
                      getPasswordStrength(value) !== "Weak" ||
                      "Password is too weak",
                  })}
                  autoComplete="new-password"
                />
              </FormField>
              <FormField label="Update Role">
                <select className="select w-full" {...registerUpdate("role")}>
                  <option value="" disabled>
                    Update Role - Current:{" "}
                    {roleMapperDict[userDataFromSearch.role]}
                  </option>
                  {Object.keys(roleMapperDict).map((role) => (
                    <option key={role} value={role}>
                      {roleMapperDict[role]}
                    </option>
                  ))}
                </select>
              </FormField>
              <FormField label="Update Team">
                <select className="select w-full" {...registerUpdate("team")}>
                  <option value="" disabled>
                    Update Team - Current:{" "}
                    {teamMapperDict[userDataFromSearch.team]}
                  </option>
                  {allowedTeams.map((team) => (
                    <option key={team} value={team}>
                      {teamMapperDict[team]}
                    </option>
                  ))}
                </select>
              </FormField>
            </form>
            <div className="flex flex-row gap-2 mt-3 w-full">
              <div className="w-4/5">
                <LargeSubmit form={"updateUser"} disabled={!isAnyFieldFilled}>
                  Update User
                </LargeSubmit>
              </div>
              <div className="w-1/5">
                <ResetFormButton
                  resetFn={resetUpdate}
                  disabled={!isAnyFieldFilled}
                />
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
              ) : null,
            )}
          </div>
        )}
      </CustomCollapseArrow>
      <ModalHelper
        id={"add_user_modal"}
        reference={userUpdateModalRef}
        modalTitle={"User Updated"}
        onClose={handleModalClose}
      >
        {modalData && (
          <div>
            <p>
              Updated{" "}
              <span className="text-primary font-semibold">
                {modalData.username}
              </span>
              's account
            </p>
            <div className="py-2 flex flex-col justify-between gap-2">
              {modalData.fullname && (
                <div className="flex justify-between">
                  Updated Full Name
                  <span className="text-primary">{modalData.fullname}</span>
                </div>
              )}
              {modalData.email && (
                <div className="flex justify-between">
                  Updated Email
                  <span className="text-primary">{modalData.email}</span>
                </div>
              )}
              {modalData.password && <p>Updated Password</p>}
              {modalData.role && (
                <div className="flex justify-between">
                  Updated Role
                  <span className="text-primary">
                    {roleMapperDict[modalData.role]}
                  </span>
                </div>
              )}
              {modalData.team && (
                <div className="flex justify-between">
                  Updated Team
                  <span className="text-primary">
                    {teamMapperDict[modalData.team]}
                  </span>
                </div>
              )}
            </div>
            <p>
              Changes take 5 minutes to reflect automatically, or log out, then
              log back in to see them immediately.
            </p>
          </div>
        )}
      </ModalHelper>
    </>
  );
}
