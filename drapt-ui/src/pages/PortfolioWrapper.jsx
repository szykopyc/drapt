import { MainBlock } from "../components/baseui/MainBlock";
import { BeginText } from "../components/baseui/BeginText";
import TabNav from "../components/baseui/TabNav";
import { useState } from "react";
import { Outlet, useParams, Link } from "react-router-dom";

export default function Portfolio() {
    const {portfolioID} = useParams();
    
    return (
        <MainBlock>
            <BeginText title={`Portfolio`}>
            </BeginText>
            <TabNav
            tabs={[
                { label: "Overview", value: "overview", to: `/portfolio/${portfolioID}/overview`, keyShortcut: "o" },
                { label: "Trade Booker", value: "tradeBooker", to: `/portfolio/${portfolioID}/tradebooker`, keyShortcut: "t" },
                { label: "Portfolio Admin", value: "portfolioAdmin", to: `/portfolio/${portfolioID}/administration`, keyShortcut: "a" },
            ]}
            initialTab="overview"
            />
            <Outlet />
        </MainBlock>
    );
}