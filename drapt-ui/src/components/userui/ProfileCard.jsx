import { useState } from "react";
import { CardOne } from "../baseui/CustomCard";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function ProfileCard({ username, fullname, email, role, team, onUpdate }) {
  const [editMode, setEditMode] = useState(false);
  const [newUsername, setNewUsername] = useState(username);
  const [newEmail, setNewEmail] = useState(email);
  const [error, setError] = useState("");

  const handleSave = () => {
    if (!isValidEmail(newEmail)) {
      setError("Please enter a valid email address.");
      return;
    }
    setEditMode(false);
    setError("");
    if (onUpdate) onUpdate({ username: newUsername, email: newEmail });
  };

  return (
    <CardOne id="profile-view" title="View Profile" badge="Profile">
      <div className="text-xl font-medium">{fullname}</div>
      <div className="flex flex-col gap-1 w-full">
        <label className="text-sm text-gray-500">Username</label>
        <div className="flex items-center gap-2">
          {editMode ? (
            <input
              className="input input-xs input-bordered"
              value={newUsername}
              onChange={e => setNewUsername(e.target.value)}
            />
          ) : (
            <span className="italic">{newUsername}</span>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-1 w-full">
        <label className="text-sm text-gray-500">Email</label>
        <div className="flex items-center gap-2">
          {editMode ? (
            <input
              className="input input-xs input-bordered"
              value={newEmail}
              onChange={e => setNewEmail(e.target.value)}
              type="email"
            />
          ) : (
            <span>{newEmail}</span>
          )}
        </div>
      </div>
      {error && (
        <div className="text-xs text-red-500 mt-1">{error}</div>
      )}
      <div className="text-sm text-gray-500 italic mt-1">{role} @ {team}</div>
      <div className="flex gap-2 mt-3">
        {editMode ? (
          <>
            <button className="btn btn-xs btn-primary mr-2" onClick={handleSave}>
              Save
            </button>
            <button className="btn btn-xs btn-ghost" onClick={() => {
              setEditMode(false);
              setNewUsername(username);
              setNewEmail(email);
              setError("");
            }}>
              Cancel
            </button>
          </>
        ) : (
          <button className="btn btn-xs btn-primary" onClick={() => setEditMode(true)}>
            Edit
          </button>
        )}
      </div>
    </CardOne>
  );
}