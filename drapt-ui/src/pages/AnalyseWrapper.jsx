import { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import { MainBlock } from "../components/baseui/MainBlock";
import { BeginText } from "../components/baseui/BeginText";

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
      <div className="flex items-center justify-between border-b border-gray-300">
        <nav className="flex space-x-4">
          <Link
            className={`pb-2 ${activeTab === "performance" ? "border-b-2 border-base font-semibold" : "text-base-content/70"}`}
            onClick={() => setActiveTab("performance")}
            aria-selected={activeTab === "performance"}
            to={`/analyse/${portfolioID}/performance`}
          >
            Performance
          </Link>
          <Link
            className={`pb-2 ${activeTab === "risk" ? "border-b-2 border-base font-semibold" : "text-base-content/70"}`}
            onClick={() => setActiveTab("risk")}
            aria-selected={activeTab === "risk"}
            to={`/analyse/${portfolioID}/risk`}
          >
            Risk
          </Link>
        </nav>
        <div className="text-sm text-base-content/70 italic hidden sm:block">
          Press <kbd className="border rounded px-1">P</kbd> for Performance, <kbd className="border rounded px-1">R</kbd> for Risk
        </div>
      </div>
      <Outlet />
    </MainBlock>
  );
}