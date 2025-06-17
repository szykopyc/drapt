import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { CardOne } from "../baseui/CustomCard";
import { ModalHelper } from "../helperui/ModalHelper";
import { FormField } from "../helperui/FormFieldHelper";
import { getPasswordStrength } from "../validators/PasswordValidator";

export default function ChangePassword({ onChange }) {
  const modalRef = useRef(null);
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm({
    mode: "onChange",
    defaultValues: {
      current: "",
      next: "",
      confirm: ""
    }
  });

  const next = watch("next");
  const confirm = watch("confirm");
  const strength = getPasswordStrength(next);

  const onSubmit = (data) => {
    if (data.next !== data.confirm) {
      setMessage("New passwords do not match.");
      return;
    }
    if (strength === "Weak") {
      setMessage("Password is too weak.");
      return;
    }
    // Call API here
    if (modalRef.current) modalRef.current.showModal();
    if (onChange) onChange(data.current, data.next);
    setMessage("");
    reset();
  };

  return (
    <>
      <CardOne id="change-password" title="Change Password" badge="Security">
        <form className="flex flex-col gap-3 w-full" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <FormField label="Current Password" error={errors.current && errors.current.message}>
            <input
              type="password"
              className="input input-bordered w-full"
              {...register("current", { required: "Current password is required" })}
              autoComplete="current-password"
            />
          </FormField>
          <FormField label="New Password" error={errors.next && errors.next.message}>
            <input
              type="password"
              className="input input-bordered w-full"
              {...register("next", {
                required: "New password is required",
                validate: value => getPasswordStrength(value) === "Weak" ? "" : true
              })}
              autoComplete="new-password"
            />
            {watch("next") && (
              <div className={`text-sm font-semibold ${
                strength === "Strong" || strength === "Very Strong"
                  ? "text-success"
                  : strength === "Medium"
                  ? "text-warning"
                  : "text-error"
              }`}>
                Strength: {strength}
              </div>
            )}
          </FormField>
          <FormField label="Confirm New Password" error={errors.confirm && errors.confirm.message}>
            <input
              type="password"
              className="input input-bordered w-full"
              {...register("confirm", {
                required: "Please confirm your new password",
                validate: value => value === next || "Passwords do not match"
              })}
              autoComplete="new-password"
            />
          </FormField>
          {message && (
            <div className="text-primary">{message}</div>
          )}
          <div className="flex flex-row gap-2 mt-2 w-full">
            <button
              type="submit"
              className="btn btn-primary self-end rounded-lg shadow-md hover:shadow-lg transition-shadow text-primary-content"
            >
              Change Password
            </button>
          </div>
        </form>
      </CardOne>
      <ModalHelper id={"change_password_success_modal"} reference={modalRef} modalTitle={"Password Changed"}>
        <p className="py-2">Your password has been updated successfully.</p>
      </ModalHelper>
    </>
  );
}