import ThemeSwitcher from "../components/userui/ThemeSwitcher";
import CurrencySwitcher from "../components/userui/CurrencySwitcher";
import { CardOne } from "../components/baseui/CustomCard";
import ProfileCard from "../components/userui/ProfileCard";
import ChangePassword from "../components/userui/ChangePassword";
import LogoutCard from "../components/userui/LogoutCard";
import { MainBlock } from "../components/baseui/MainBlock";
import { BeginText } from "../components/baseui/BeginText";
import { useEffect, useState } from "react";
import useUserStore from "../stores/userStore";

export default function Profile() {
    const user = useUserStore((state) => state.user);
    const setUser = useUserStore((state) => state.setUser); // DELETE IN PROD
    if (!user) return null;

    // DELETE IN PROD THIS IS SO I CAN CHANGE MY USER TYPE WITHOUT RELOGGING IN
    const [userWantsToChangeOption, setUserWantsToChangeOption] = useState(
        user?.role
    );

    // DELETE IN PROD THIS IS SO I CAN CHANGE MY USER TYPE WITHOUT RELOGGING IN
    useEffect(() => {
        switch (userWantsToChangeOption) {
            case "developer":
                setUser({
                    fullname: "Szymon Kopyciński",
                    username: "szymonkp",
                    email: "szymon.kopycinski@outlook.com",
                    role: "developer",
                    team: "executive",
                });
                break;
            case "analyst":
                setUser({
                    fullname: "Random Analyst",
                    username: "randomanalyst",
                    email: "random.analyst@outlook.com",
                    role: "analyst",
                    team: "industrial",
                });
                break;
            case "pm":
                setUser({
                    fullname: "Portfolio Manager",
                    username: "portfoliomanager",
                    email: "portfolio.manager@outlook.com",
                    role: "pm",
                    team: "industrial",
                });
                break;
            default:
                break;
        }
    }, [userWantsToChangeOption, setUser]);

    return (
        <MainBlock>
            <BeginText title={"Profile & Settings"}>
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
            {/* DELETE IN PROD THIS IS SO I CAN CHANGE MY USER TYPE WITHOUT RELOGGING IN*/}
            <CardOne title={"Developer Settings"} id="dev" badge={"Developer"}>
                <p>
                    This is so that you can simulate signing in as another user
                    without having to log back in.
                </p>
                <div className="flex flex-col gap-4 md:gap-0 md:flex-row md:justify-between items-start md:items-center">
                    <h2 className="text-lg md:text-base">Quick Change User</h2>
                    <select
                        className="select select-bordered cursor-pointer"
                        value={userWantsToChangeOption}
                        onChange={(e) =>
                            setUserWantsToChangeOption(e.target.value)
                        }
                        defaultValue={user?.role}
                    >
                        <option value="developer">Developer</option>
                        <option value="analyst">Analyst</option>
                        <option value="pm">Portfolio Manager</option>
                    </select>
                </div>
            </CardOne>
            <ChangePassword></ChangePassword>
            <LogoutCard />
        </MainBlock>
    );
}
