import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { CustomCollapseArrow } from "../baseui/CustomCard";
import { ModalHelper } from "../helperui/ModalHelper";
import { FormField } from "../helperui/FormFieldHelper";
import { FormErrorHelper } from "../helperui/FormErrorHelper";
import LargeSubmit from "../baseui/LargeSubmitHelper";
import { LoadingSpinner } from "../helperui/LoadingSpinnerHelper";
import { teamMapperDict } from "../../helperfunctions/TeamMapper";
import { roleMapperDict } from "../../helperfunctions/RoleMapper";
import { searchUserByUsername, deleteUserByID } from "../../lib/AdminServices";
import { FaHdd } from "react-icons/fa";
import InnerEmptyState from "../errorui/InnerEmptyState";
import { useQueryClient } from "@tanstack/react-query";

export function UserDeleteCard() {
    const [loading, setLoading] = useState(false);
    const [showDeleteData, setShowDeleteData] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [deletedUsername, setDeletedUsername] = useState("");
    const [targetUser, setTargetUser] = useState(null);
    const [searchError, setSearchError] = useState(null);
    const [deleteError, setDeleteError] = useState(null);

    const queryClient = useQueryClient();

    // reference for modal which confirms deletion

    const userDeleteModalRef = useRef(null);

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
        setShowDeleteData(false);
        setShowConfirm(false);
        setLoading(false);
        setSearchError(null);
        setDeleteError(null);
    };

    // Business logic for searching a user to delete
    const onSearch = async (data) => {
        setShowDeleteData(false);
        setLoading(true);
        setSearchError(null);
        setTargetUser(null);
        try {
            // dont delete myself :(
            if (data.username.trim() === "liysk64") {
                throw "Error";
            }
            const user = await searchUserByUsername(data.username.trim());
            await new Promise((resolve) => setTimeout(resolve, 300));
            setTargetUser(user);
            setShowDeleteData(true);
        } catch (error) {
            await new Promise((resolve) => setTimeout(resolve, 300));
            if (data.username.trim() == "liysk64")
                setSearchError("Please don't delete Szymon :(");
            else {
                setSearchError(
                    error?.response?.data?.detail ||
                        error?.message ||
                        "Failed to find user."
                );
            }
        } finally {
            setLoading(false);
        }
        setShowConfirm(false);
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
            queryClient.invalidateQueries({ queryKey: ["user", user.role] });
            setDeletedUsername(targetUser?.username || "");
            setTargetUser(null);
            setShowDeleteData(false);
            setShowConfirm(false);
            reset();
            if (userDeleteModalRef.current) {
                userDeleteModalRef.current.showModal();
            }
        } catch (error) {
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
                onClose={() => reset()}
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
                    <div className="w-full md:w-1/5 mt-auto">
                        <LargeSubmit size={1} disabled={!watchedUsername}>
                            Search
                        </LargeSubmit>
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
                {showDeleteData && targetUser && !loading && (
                    <>
                        <div className="mt-1">
                            <div>
                                <div className="overflow-x-auto">
                                    <table className="table-sm md:table">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Full Name</th>
                                                <th>Username</th>
                                                <th>Email</th>
                                                <th>Role</th>
                                                <th>Team</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <th>{targetUser.id}</th>
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
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="w-full flex mt-3">
                                    {!showConfirm ? (
                                        <button
                                            type="button"
                                            onClick={handleDeleteClick}
                                            className="btn btn-error text-base-content flex-1"
                                        >
                                            Delete User
                                        </button>
                                    ) : (
                                        <div className="flex gap-2 w-full">
                                            <button
                                                type="button"
                                                className="btn btn-error w-1/2"
                                                onClick={handleConfirmDelete}
                                            >
                                                Yes
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-outline w-1/2"
                                                onClick={handleCancelDelete}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </CustomCollapseArrow>
            <ModalHelper
                id={"delete_user_modal"}
                reference={userDeleteModalRef}
                modalTitle={"User Deleted"}
            >
                User{" "}
                <span className="text-error font-semibold">
                    {deletedUsername}
                </span>{" "}
                has been deleted. This action is irreversible.
            </ModalHelper>
        </>
    );
}
