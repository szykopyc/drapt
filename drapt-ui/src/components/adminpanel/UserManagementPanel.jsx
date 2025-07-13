import { UserShowAllCard } from "../adminui/UserShowAllCard";
import { UserCreationCard } from "../adminui/UserCreationCard";
import { UserUpdateCard } from "../adminui/UserUpdateCard";
import { UserDeleteCard } from "../adminui/UserDeleteCard";
import useUserStore from "../../stores/userStore";

export default function UserManagementPanel() {
  const user = useUserStore((state) => state.user);
  if (!user) return null;
  return (
    <div className="flex flex-col gap-3">
      <UserShowAllCard />
      <UserCreationCard />
      <UserUpdateCard />
      {user?.role === "developer" && <UserDeleteCard />}
    </div>
  );
}
