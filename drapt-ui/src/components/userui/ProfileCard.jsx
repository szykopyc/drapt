import { CardOne } from "../baseui/CustomCard";
import useUserStore from "../../stores/userStore";
import { teamMapperDict } from "../../helperfunctions/TeamMapper";
import { roleMapperDict } from "../../helperfunctions/RoleMapper";

export default function ProfileCard({ onUpdate }) {
    const user = useUserStore((state) => state.user);
    if (!user) return null;

    const userUsername = user?.username;
    const userFullName = user?.fullname;
    const userEmail = user?.email;

    return (
        <CardOne
            id="profile-view"
            title={userFullName ? userFullName : "View Profile"}
            badge="Profile"
        >
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
                {roleMapperDict[user?.role]} @ {teamMapperDict[user?.team]} Team
            </div>
        </CardOne>
    );
}
