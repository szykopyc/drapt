import { useState } from "react";
import { CardOne } from "../baseui/CustomCard";
import { isValidEmail } from "../validators/EmailValidator";
import useUserStore from "../../stores/userStore";

export default function ProfileCard({ onUpdate }) {
    const user = useUserStore((state) => state.user);
    if (!user) return null;

    const userUsername = user?.username;
    const userFullName = user?.fullname;
    const userEmail = user?.email;
    let userRole = user?.role.charAt(0).toUpperCase() + user?.role.slice(1);
    const userTeam = user?.team.charAt(0).toUpperCase() + user?.team.slice(1);

    if (userRole === "Pm") userRole = "Portfolio Manager";
    else if (userRole === "Vd") userRole = "Vice Director";

    return (
        <CardOne id="profile-view" title="View Profile" badge="Profile">
            <div className="text-xl font-medium">{userFullName}</div>
            <div className="flex flex-col gap-1 w-full">
                <label className="text-sm text-base-content/70">Username</label>
                {userUsername}
            </div>
            <div className="flex flex-col gap-1 w-full">
                <label className="text-sm text-base-content/70">Email</label>
                <div className="flex items-center gap-2">{userEmail}</div>
            </div>
            <div className="flex flex-col gap-1 w-full">
                <label className="text-sm text-base-content/70">Role</label>
                {userRole} @ {userTeam} Team
            </div>
        </CardOne>
    );
}
