import ThemeSwitcher from "../components/userui/ThemeSwitcher";
import { CardOne } from "../components/baseui/CustomCard";
import ProfileCard from "../components/userui/ProfileCard";
import ChangePassword from "../components/userui/ChangePassword";
import LogoutCard from "../components/userui/LogoutCard";
import MainBlock from "../components/layout/MainBlock";
import { BeginText } from "../components/baseui/BeginText";
import { useEffect, useState } from "react";
import useUserStore from "../stores/userStore";

export default function Profile() {
    const user = useUserStore((state) => state.user);
    if (!user) return null;

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
            </CardOne>
            <ChangePassword></ChangePassword>
            <LogoutCard />
        </MainBlock>
    );
}
