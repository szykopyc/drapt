import { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import { MainBlock } from "../components/baseui/MainBlock";
import { BeginText } from "../components/baseui/BeginText";
import TabNav from "../components/baseui/TabNav";

export default function Analyse() {
  const {portfolioID} = useParams();
  const [activeTab, setActiveTab] = useState("performance");
  const navigate = useNavigate();

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "p" || e.key === "P") {
        setActiveTab("performance");
        navigate(`/analyse/${portfolioID}/performance`);
      } else if (e.key === "r" || e.key === "R") {
        setActiveTab("risk");
        navigate(`/analyse/${portfolioID}/risk`);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate, portfolioID]);

  return (
    <MainBlock>
      <BeginText title={"Analyse"} />
      <TabNav 
        tabs={[
          {label:"Performance", value:"performance", to: `/analyse/${portfolioID}/performance`, keyShortcut:"p"},
          {label:"Risk", value:"risk", to: `/analyse/${portfolioID}/risk`, keyShortcut:"r"},
        ]}
      />
      <Outlet />
    </MainBlock>
  );
}