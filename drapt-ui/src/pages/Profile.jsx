import ThemeSwitcher from "../components/userui/ThemeSwitcher";
import CurrencySwitcher from "../components/userui/CurrencySwitcher";
import { CardOne } from "../components/baseui/CustomCard";
import ProfileCard from "../components/userui/ProfileCard";
import ChangePassword from "../components/userui/ChangePassword";
import LogoutCard from "../components/userui/LogoutCard";
import { MainBlock } from "../components/baseui/MainBlock";
import { BeginText } from "../components/baseui/BeginText";
import useUserStore from "../stores/userStore";

export default function Profile() {
    const user = useUserStore((state) => state.user);
    if (!user) return null;
    return (
        <MainBlock>
            <BeginText title={user ? `Welcome, ${user?.fullname}` : "Welcome"}>
                <p>View your profile and settings here.</p>
            </BeginText>
            <div className="divider my-0"></div>
            <ProfileCard />
            <CardOne id={"profile"} title={"Preferences"} badge={"Preferences"}>
                <div className="flex flex-col gap-4 md:gap-0 md:flex-row md:justify-between items-start md:items-center">
                    <h2 className="text-lg md:text-base">Select Theme</h2>
                    <ThemeSwitcher />
                </div>
                <div className="flex flex-col gap-4 md:gap-0 md:flex-row md:justify-between items-start md:items-center">
                    <h2 className="text-lg md:text-base">Select Currency</h2>
                    <CurrencySwitcher />
                </div>
            </CardOne>
            <ChangePassword></ChangePassword>
            <LogoutCard />
        </MainBlock>
    );
}
