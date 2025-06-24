import { MainBlock } from "../components/baseui/MainBlock";
import { BeginText } from "../components/baseui/BeginText";
import TabNav from "../components/baseui/TabNav";
import { Outlet, useParams, useLocation } from "react-router-dom";

export default function Portfolio() {
    const { portfolioID } = useParams();
    const location = useLocation();

    const pathToTab = {
        overview: "overview",
        monitor: "monitor",
        tradebooker: "tradeBooker",
        administration: "portfolioAdmin",
    };

    const lastSegment = location.pathname.split("/").pop();
    const initialTab = pathToTab[lastSegment] || "overview";

    return (
        <MainBlock>
            <BeginText title={`Portfolio`} />
            <TabNav
                tabs={[
                    { label: "Overview", value: "overview", to: `/portfolio/${portfolioID}/overview`, keyShortcut: "o" },
                    { label: "Positions", value: "monitor", to:`/portfolio/${portfolioID}/monitor`, keyShortcut: "m"},
                    { label: "Trade Booker", value: "tradeBooker", to: `/portfolio/${portfolioID}/tradebooker`, keyShortcut: "t" },
                    { label: "Portfolio Admin", value: "portfolioAdmin", to: `/portfolio/${portfolioID}/administration`, keyShortcut: "a" },
                ]}
                initialTab={initialTab}
                showKeyboardShortcuts={true}
            />
            <Outlet />
        </MainBlock>
    );
}