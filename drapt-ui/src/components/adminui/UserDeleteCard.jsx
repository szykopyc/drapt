import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { CustomCollapseArrow } from "../baseui/CustomCard";
import { ModalHelper } from "../helperui/ModalHelper";
import { FormField } from "../helperui/FormFieldHelper";
import { LargeSubmit } from "../helperui/LargeSubmitHelper";
import { LoadingSpinner } from "../helperui/LoadingSpinnerHelper";
import { dummyUserTableData } from "../../assets/dummy-data/tableData";

export function UserDeleteCard() {
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const [targetUser, setTargetUser] = useState(null);
  const [showDeleteData, setShowDeleteData] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deletedUsername, setDeletedUsername] = useState("");

  const userDeleteModalRef = useRef(null);

  const { register, handleSubmit, reset, formState: { errors }, watch } = useForm();

  const watchedUsername = watch("username")?.trim() || "";

  const handleInputChange = (e) => {
    setShowDeleteData(false);
    setShowConfirm(false);
    setLoaded(false);
    setLoading(false);
  };

  const onSearch = (data) => {
    // API CALL HERE
    const foundUser = dummyUserTableData.find(
      (user) =>
        user.username.toLowerCase() === data.username.trim().toLowerCase()
    );
    setTargetUser(foundUser || null);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setLoaded(true);
    }, 1000);
    // MODIFY ON BACKEND INTEGRATION
    setShowDeleteData(true);
    setShowConfirm(false);
  };

  const handleDeleteClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmDelete = () => {
    // API CALL HERE
    setShowConfirm(false);
    setShowDeleteData(false);
    setDeletedUsername(targetUser?.username || "");
    setTargetUser(null);
    reset();
    if (userDeleteModalRef.current) {
      userDeleteModalRef.current.showModal();
    }
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
  };

  return (
    <>
      <CustomCollapseArrow id={"userDeleteCard"} title={"Delete a user"} defaultOpen={false}>
        <form
          id="userToDelete"
          className="flex flex-col md:flex-row gap-3 w-full"
          onSubmit={handleSubmit(onSearch)}
          autoComplete="off"
        >
          <div className="flex-1">
            <FormField label="Username" error={errors.username && errors.username.message}>
              <input
                type="text"
                className="input input-bordered w-full"
                {...register("username", { required: "Username is required" })}
                autoComplete="off"
                onChange={e => {
                  handleInputChange(e);
                  register("username").onChange(e);
                }}
              />
            </FormField>
          </div>
          <div className="mt-auto">
            <LargeSubmit size={1} disabled={!watchedUsername}>
              Search
            </LargeSubmit>
          </div>
        </form>
        {!loaded && loading && (
          <LoadingSpinner/>
        )}
        {showDeleteData && loaded && (
          <>
            <div className="mt-4">
              {targetUser ? (
                <div>
                  <div className="overflow-x-auto">
                    <table className="table-sm md:table table-zebra">
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
                          <td>{targetUser.fullName}</td>
                          <td>{targetUser.username}</td>
                          <td>{targetUser.email}</td>
                          <td>{targetUser.role}</td>
                          <td>{targetUser.team}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  {!showConfirm ? (
                    <button
                      type="button"
                      onClick={handleDeleteClick}
                      className="btn btn-error text-base-content mt-3 flex-1"
                    >
                      Delete User
                    </button>
                  ) : (
                    <div className="flex gap-2 mt-3">
                      <button
                        type="button"
                        className="btn btn-error"
                        onClick={handleConfirmDelete}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline"
                        onClick={handleCancelDelete}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-error mt-2">No user found with that username.</div>
              )}
            </div>
          </>
        )}
      </CustomCollapseArrow>
      <ModalHelper id={"delete_user_modal"} reference={userDeleteModalRef} modalTitle={"User Deleted"}>
        <div className="py-2">User <span className="text-warning">{deletedUsername}</span> has been deleted.</div>
      </ModalHelper>
    </>
  );
}