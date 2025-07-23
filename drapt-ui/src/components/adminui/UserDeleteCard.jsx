import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { CustomCollapseArrow } from "../baseui/CustomCard";
import ModalHelper from "../helperui/ModalHelper";
import { FormField } from "../helperui/FormFieldHelper";
import { FormErrorHelper } from "../helperui/FormErrorHelper";
import CustomButton from "../baseui/CustomButton";
import { LoadingSpinner } from "../helperui/LoadingSpinnerHelper";
import { teamMapperDict } from "../../helperfunctions/TeamMapper";
import { roleMapperDict } from "../../helperfunctions/RoleMapper";
import { searchUserByUsername, deleteUserByID } from "../../lib/AdminServices";
import { FaHdd } from "react-icons/fa";
import InnerEmptyState from "../errorui/InnerEmptyState";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
export function UserDeleteCard() {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deletedUsername, setDeletedUsername] = useState("");
  const [targetUser, setTargetUser] = useState(null);
  const [searchError, setSearchError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  const queryClient = useQueryClient();

  // initialising the form

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm();

  // watching username to prevent search unless it is filled

  const watchedUsername = watch("username")?.trim() || "";

  // handles input change, setting show delete data, show confirm, loading to false, search and setdelete error to null

  const handleInputChange = (e) => {
    setShowConfirm(false);
    setLoading(false);
    setSearchError(null);
    setDeleteError(null);
  };

  // Business logic for searching a user to delete
  const onSearch = async (data) => {
    setLoading(true);
    setSearchError(null);
    setTargetUser(null); // Reset the target user
    try {
      // Prevent deleting yourself
      if (data.username.trim() === "liysk64") {
        throw new Error("Please don't delete Szymon :(");
      }

      const user = await searchUserByUsername(data.username.trim());

      await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate delay
      setTargetUser(user);
    } catch (error) {
      await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate delay
      if (data.username.trim() === "liysk64") {
        setSearchError("Please don't delete Szymon :(");
      } else {
        setSearchError(
          error?.response?.data?.detail ||
          error?.message ||
          "Failed to find user."
        );
      }
    } finally {
      setLoading(false);
    }
    setShowConfirm(false); // Ensure confirmation is reset
  };

  const handleDeleteClick = () => {
    setShowConfirm(true);
  };

  // Business logic for deleting a user
  const handleConfirmDelete = async () => {
    setDeleteError(null);
    setLoading(true);
    try {
      await deleteUserByID(targetUser.id);
      queryClient.invalidateQueries({
        queryKey: ["user", targetUser.role],
      });
      queryClient.invalidateQueries({
        queryKey: ["allusers"],
      });
      setDeletedUsername(targetUser?.username || "");
      toast.success(`Deleted user: ${targetUser?.username} - ${targetUser?.fullname}`)
      setTargetUser(null);
      setShowConfirm(false);
      reset();
    } catch (error) {
      console.log(error);
      setDeleteError(
        error?.response?.data?.detail ||
        error?.message ||
        "Failed to delete user."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
  };

  return (
    <>
      <CustomCollapseArrow
        id={"userDeleteCard"}
        title={"Delete a user"}
        defaultOpen={false}
        onClose={() => {
          reset();
          setShowConfirm(false);
          setLoading(false);
          setSearchError(null);
          setDeleteError(null);
          setTargetUser(null);
        }}
      >
        <form
          id="userToDelete"
          className="flex flex-col md:flex-row gap-3 w-full"
          onSubmit={handleSubmit(onSearch)}
          autoComplete="off"
        >
          <div className="w-full md:w-4/5">
            <FormField label="Username">
              <input
                type="text"
                className="input input-bordered w-full"
                {...register("username", {
                  required: "Username is required",
                })}
                autoComplete="off"
                onChange={(e) => {
                  handleInputChange(e);
                  register("username").onChange(e);
                }}
              />
            </FormField>
          </div>
          <div className="flex w-full md:w-1/5 mt-auto">
            <CustomButton type="submit" disabled={!watchedUsername}>
              Search
            </CustomButton>
          </div>
        </form>
        {loading && <LoadingSpinner />}
        {searchError && (
          <div className="mt-6">
            <InnerEmptyState
              title="User not found"
              message="We couldn't find the user you wanted to delete. Are you sure you typed in the correct username?"
              enablePadding={false}
              icon={
                <FaHdd className="text-4xl text-base-content/40" />
              }
            >
              <FormErrorHelper textSize="md">
                Error: {searchError}
              </FormErrorHelper>
            </InnerEmptyState>
          </div>
        )}
        {targetUser && !loading && (
          <>
            <div className="mt-1">
              <div>
                <div className="overflow-x-auto">
                  <table className="table-sm md:table">
                    <thead>
                      <tr>
                        <th>Full Name</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Team</th>
                        <th>Assigned</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{targetUser.fullname}</td>
                        <td>{targetUser.username}</td>
                        <td>{targetUser.email}</td>
                        <td>
                          {
                            roleMapperDict[
                            targetUser.role
                            ]
                          }
                        </td>
                        <td>
                          {
                            teamMapperDict[
                            targetUser.team
                            ]
                          }
                        </td>
                        <td>
                          {targetUser.portfolio_id
                            ? "True"
                            : "False"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="w-full flex mt-3">
                  {!showConfirm ? (
                    <CustomButton
                      type="button"
                      onClick={handleDeleteClick}
                      colour="error"
                    >
                      Delete User
                    </CustomButton>
                  ) : (
                    <div className="flex gap-2 w-full">
                      <CustomButton
                        type="button"
                        colour="success"
                        onClick={handleConfirmDelete}
                      >
                        Confirm
                      </CustomButton>
                      <CustomButton
                        type="button"
                        colour="neutral"
                        onClick={handleCancelDelete}
                      >
                        Cancel
                      </CustomButton>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </CustomCollapseArrow>
    </>
  );
}
