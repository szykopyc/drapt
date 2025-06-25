import { useState, useEffect } from "react";
import { Outlet, useNavigate, useParams, useLocation } from "react-router-dom";
import { MainBlock } from "../components/baseui/MainBlock";
import { BeginText } from "../components/baseui/BeginText";
import TabNav from "../components/baseui/TabNav";

export default function Analyse() {
  const {portfolioID} = useParams();

  const capitalisedPortfolioID = portfolioID.charAt(0).toUpperCase() + portfolioID.slice(1);

  const location = useLocation();

    const pathToTab = {
        performance: "performance",
        risk: "risk"
    };

    const lastSegment = location.pathname.split("/").pop();
    const initialTab = pathToTab[lastSegment] || "performance";

  return (
    <MainBlock>
      <BeginText title={capitalisedPortfolioID ? `Analyse ${capitalisedPortfolioID} Portfolio` : "Analyse"} />
      <TabNav 
        tabs={[
          {label:"Performance", value:"performance", to: `/analyse/${portfolioID}/performance`, keyShortcut:"p"},
          {label:"Risk", value:"risk", to: `/analyse/${portfolioID}/risk`, keyShortcut:"r"},
        ]}
        initialTab={initialTab}
      />
      <Outlet />
    </MainBlock>
  );
}