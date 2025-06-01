import { useState, useRef } from "react";
import { CardOne } from "../baseui/CustomCard";

function getPasswordStrength(password) {
  if (!password) return "";
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return "Weak";
  if (score === 3 || score === 4) return "Medium";
  if (score === 5) return "Strong";
  return "";
}

export default function ChangePassword({ onChange }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const modalRef = useRef(null);

  const strength = getPasswordStrength(next);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (next !== confirm) {
      setMessage("New passwords do not match.");
      return;
    }
    if (strength === "Weak") {
      setMessage("Password is too weak.");
      return;
    }
    // Call parent handler or API here
    if (modalRef.current) modalRef.current.showModal();
    if (onChange) onChange(current, next);
    setCurrent("");
    setNext("");
    setConfirm("");
  };

  return (
    <>
      <CardOne id="change-password" title="Change Password" badge="Security">
        <form className="flex flex-col gap-3 w-full" onSubmit={handleSubmit}>
          <div>
            <label className="label">
              <span className="label-text">Current Password</span>
            </label>
            <input
              type="password"
              className="input input-bordered w-full"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label">
              <span className="label-text">New Password</span>
            </label>
            <input
              type="password"
              className="input input-bordered w-full"
              value={next}
              onChange={(e) => setNext(e.target.value)}
              required
            />
            {next && (
              <div className={`mt-1 text-xs font-semibold ${
                strength === "Strong"
                  ? "text-green-500"
                  : strength === "Medium"
                  ? "text-yellow-500"
                  : "text-red-500"
              }`}>
                Strength: {strength}
              </div>
            )}
          </div>
          <div>
            <label className="label">
              <span className="label-text">Confirm New Password</span>
            </label>
            <input
              type="password"
              className="input input-bordered w-full"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>
          {message && (
            <div className="text-sm mt-1 text-primary">{message}</div>
          )}
          <button type="submit" className="btn btn-primary mt-2 self-end rounded-lg shadow-md hover:shadow-lg transition-shadow text-primary-content">
            Change Password
          </button>
        </form>
      </CardOne>
      <dialog id="change_password_success_modal" ref={modalRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Password Changed</h3>
          <p className="py-4">Your password has been updated successfully.</p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}