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

export function UserUpdateCard() {
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [targetUsername, setTargetUsername] = useState("");
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  const userUpdateModalRef = useRef(null);
  const [modalData, setModalData] = useState(null);

  const { register: registerSearch, handleSubmit: handleSubmitSearch, reset: resetSearch, watch: watchSearch, formState: { errors: errorsSearch } } = useForm();

  const { register: registerUpdate, handleSubmit: handleSubmitUpdate, reset: resetUpdate, watch: watchUpdate, formState: { errors: errorsUpdate } } = useForm({
    defaultValues: {
      role: "",
      team: "",
    }
  });

  const teamOptionsByRole = {
    Analyst: ["Industrial", "TMT", "Europe", "US & Canada", "Metals, Mining and Commodities"],
    "Senior Analyst": ["Industrial", "TMT", "Europe", "US & Canada", "Metals, Mining and Commodities"],
    Manager: ["Industrial", "TMT", "Europe", "US & Canada", "Metals, Mining and Commodities"],
    "Vice Director": ["Executive"],
    Director: ["Executive"],
    Developer: ["Executive"]
  };

  const watchedUsername = watchSearch("username")?.trim() || "";

  const onSearch = (data) => {
    setTargetUsername(data.username.trim());
    setLoading(true);
    setLoaded(false);
    setShowUpdateForm(false);
    setTimeout(() => {
      setLoading(false);
      setLoaded(true);
      setShowUpdateForm(true);
    }, 1000);
  };

  const onSubmit = (data) => {
    setLoaded(false);
    setLoading(false);
    setModalData(data);
    if (userUpdateModalRef.current) userUpdateModalRef.current.showModal();
    resetUpdate();
  };

  const selectedRole = watchUpdate("role");
  const allowedTeams = teamOptionsByRole[selectedRole] || [];

  const fullName = watchUpdate("fullName");
  const email = watchUpdate("email");
  const password = watchUpdate("password");
  const role = watchUpdate("role");
  const team = watchUpdate("team");

  const isAnyFieldFilled = !!(fullName || email || password || role || team);

  return (
    <>
      <CustomCollapseArrow id={"userCreationCard"} title={"Update a user"} defaultOpen={false}>
        <form
          id="userToUpdate"
          className="flex flex-col md:flex-row gap-3 w-full"
          onSubmit={handleSubmitSearch(onSearch)}
          autoComplete="off"
        >
          <div className="flex-1">
            <FormField label="Username" error={errorsSearch.username && errorsSearch.username.message}>
              <input
                type="text"
                className="input input-bordered w-full"
                {...registerSearch("username", { required: "Username is required" })}
                autoComplete="off"
              />
            </FormField>
          </div>
          <div className="mt-auto">
            <LargeSubmit disabled={!watchedUsername} >
              Search
            </LargeSubmit>
          </div>
        </form>
        {!loaded && loading && (
          <LoadingSpinner/>
        )}
        {showUpdateForm && watchedUsername && loaded && (
          <>
            <div className="divider my-2"></div>
            <form id="updateUser" className="flex flex-col gap-3 w-full" onSubmit={handleSubmitUpdate(onSubmit)} autoComplete="off">
              <FormField label="Update Full Name" error={errorsUpdate.fullName && errorsUpdate.fullName.message}>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  {...registerUpdate("fullName")}
                  autoComplete="off"
                />
              </FormField>
              <FormField label="Update Email" error={errorsUpdate.email && errorsUpdate.email.message}>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  {...registerUpdate("email", {
                    validate: value =>
                      !value || isValidEmail(value) || "Please enter a valid email address"
                  })}
                  autoComplete="off"
                />
              </FormField>
              <FormField label="Update Password" error={errorsUpdate.password && errorsUpdate.password.message}>
                <input
                  type="password"
                  className="input input-bordered w-full"
                  {...registerUpdate("password", {
                    validate: value =>
                      !value || getPasswordStrength(value) !== "Weak" || "Password is too weak"
                  })}
                  autoComplete="new-password"
                />
              </FormField>
              <FormField label="Update Role" error={errorsUpdate.role && errorsUpdate.role.message}>
                <select className="select w-full" {...registerUpdate("role")}>
                  <option value="" disabled>Update Role</option>
                  <option>Analyst</option>
                  <option>Senior Analyst</option>
                  <option>Manager</option>
                  <option>Vice Director</option>
                  <option>Director</option>
                  <option>Developer</option>
                </select>
              </FormField>
              <FormField label="Update Team" error={errorsUpdate.team && errorsUpdate.team.message}>
                <select
                  className="select w-full"
                  {...registerUpdate("team")}
                >
                  <option value="" disabled>Update Team</option>
                  {allowedTeams.map(team => (
                    <option key={team} value={team}>{team}</option>
                  ))}
                </select>
              </FormField>
            </form>
            <div className="flex flex-row gap-2 mt-3 w-full">
            <div className="w-4/5">
              <LargeSubmit
                form={"updateUser"}
                disabled={!isAnyFieldFilled}
              >
                Update User
              </LargeSubmit>
            </div>
            <div className="w-1/5">
              <ResetFormButton resetFn={resetUpdate} disabled={!isAnyFieldFilled} />
            </div>
            </div>
          </>
        )}
      </CustomCollapseArrow>
      <ModalHelper id={"add_user_modal"} reference={userUpdateModalRef} modalTitle={"User Updated"}>
        {modalData && targetUsername && (
          <div>
            <p>Updated <span className="text-primary font-semibold">{targetUsername}'s</span> account</p>
            <div className="py-2 flex flex-col justify-between gap-2">
              {modalData.fullName && <div className="flex justify-between">Updated Full Name<span className="text-primary">{modalData.fullName}</span></div>}
              {modalData.email && <div className="flex justify-between">Updated Email<span className="text-primary">{modalData.email}</span></div>}
              {modalData.password && <p>Updated Password</p>}
              {modalData.role && <div className="flex justify-between">Updated Role<span className="text-primary">{modalData.role}</span></div>}
              {modalData.team && <div className="flex justify-between">Updated Team<span className="text-primary">{modalData.team}</span></div>}
            </div>
          </div>
        )}
      </ModalHelper>
    </>
  );
}