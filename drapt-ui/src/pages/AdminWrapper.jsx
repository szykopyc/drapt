import { Outlet, useLocation } from "react-router-dom";
import TabNav from "../components/baseui/TabNav";
import MainBlock from "../components/layout/MainBlock";
import { BeginText } from "../components/baseui/BeginText";

export default function AdminWrapper() {
    const location = useLocation();

    const pathToTab = {
        management: "management",
        engagement: "engagement",
    };

    const lastSegment = location.pathname.split("/").pop();
    const initialTab = pathToTab[lastSegment] || "management";

    return (
        <MainBlock>
            <BeginText title={"User Administration"}></BeginText>
            <TabNav
                tabs={[
                    {
                        label: "User Management",
                        value: "management",
                        to: `/admin/management`,
                        keyShortcut: "m",
                    },
                    {
                        label: "User Engagement",
                        value: "engagement",
                        to: `/admin/engagement`,
                        keyShortcut: "e",
                    },
                ]}
                initialTab={initialTab}
            />
            <Outlet />
        </MainBlock>
    );
}
