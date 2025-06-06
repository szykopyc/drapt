import { AnalyseCard } from "../baseui/CustomCard";
import { CardHelper } from "../helperui/DivHelper";
import { UserShowAllCard } from "../adminui/UserShowAllCard";
import { UserCreationCard } from "../adminui/UserCreationCard";
import { UserUpdateCard } from "../adminui/UserUpdateCard";
import { UserDeleteCard } from "../adminui/UserDeleteCard";

export default function UserManagementPanel() {
  return (
    <div className="flex flex-col gap-3">
      <CardHelper>
        <div className="flex-col w-full">
          <AnalyseCard id={"welcome"} title={"Welcome to User Management"}>
            <div className="h-full flex flex-col justify-center">
              <p>
                Here you can manage users across <span className="text-accent font-semibold">Drapt</span>. Add new users, update existing ones, or delete users, including bulk actions for easy admin.
              </p>
            </div>
          </AnalyseCard>
        </div>
      </CardHelper>
      <div className="divider my-0"></div>
      <UserShowAllCard />
      <UserCreationCard />
      <UserUpdateCard />
      <UserDeleteCard />
    </div>
  );
}