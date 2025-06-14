import { MainBlock } from "../components/baseui/MainBlock";
import { BeginText } from "../components/baseui/BeginText";
import { useState } from "react";
import { Outlet, useParams, Link } from "react-router-dom";

export default function Portfolio() {
    const [activeTab, setActiveTab] = useState("overview");
    const {portfolioID} = useParams();
    
    return (
        <MainBlock>
            <BeginText title={`Portfolio ${portfolioID}`}>
            </BeginText>
            <div className="flex items-center justify-between border-b border-gray-300">
                <nav className="flex space-x-4">
                    <Link className={`pb-2 ${activeTab === "overview" ? "border-b-2 border-base font-semibold" : "text-base-content/70"}`}
                    onClick={() => setActiveTab("overview")}
                    aria-selected={activeTab === "overview"} 
                    to={`/portfolio/${portfolioID}/overview`}>Overview</Link>
                    <Link className={`pb-2 ${activeTab === "tradeBooker" ? "border-b-2 border-base font-semibold" : "text-base-content/70"}`}
                    onClick={() => setActiveTab("tradeBooker")}
                    aria-selected={activeTab === "tradeBooker"} 
                    to={`/portfolio/${portfolioID}/tradebooker`}>Trade Booker</Link>
                    <Link className={`pb-2 ${activeTab === "portfolioAdmin" ? "border-b-2 border-base font-semibold" : "text-base-content/70"}`}
                    onClick={() => setActiveTab("portfolioAdmin")}
                    aria-selected={activeTab === "portfolioAdmin"} 
                    to={`/portfolio/${portfolioID}/administration`}>Portfolio Admin</Link>
                </nav>
            </div>
            <Outlet />
        </MainBlock>
    );
}