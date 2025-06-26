import { Outlet, useLocation, useParams } from "react-router-dom";
import { MainBlock } from "../components/baseui/MainBlock";
import { BeginText } from "../components/baseui/BeginText";
import TabNav from "../components/baseui/TabNav";
import useUserStore from "../stores/userStore";

export default function Analyse() {
    const user = useUserStore((state) => state.user);
    if (!user) return null;

    const { portfolioID } = useParams();
    const capitalisedPortfolioID = portfolioID
        ? portfolioID.charAt(0).toUpperCase() + portfolioID.slice(1)
        : "";

    const location = useLocation();

    const pathToTab = {
        performance: "performance",
        risk: "risk",
    };

    const lastSegment = location.pathname.split("/").pop();
    const initialTab = pathToTab[lastSegment] || "performance";

    return (
        <MainBlock>
            <BeginText
                title={
                    capitalisedPortfolioID
                        ? `Analyse ${capitalisedPortfolioID} Portfolio`
                        : "Analyse"
                }
            />
            <TabNav
                tabs={[
                    {
                        label: "Performance",
                        value: "performance",
                        to: `/analyse/${portfolioID}/performance`,
                        keyShortcut: "p",
                    },
                    {
                        label: "Risk",
                        value: "risk",
                        to: `/analyse/${portfolioID}/risk`,
                        keyShortcut: "r",
                    },
                ]}
                initialTab={initialTab}
            />
            <Outlet />
        </MainBlock>
    );
}
