import { useState, useEffect } from "react";
import RiskPanel from "../components/dashboardui/RiskPanel";
import PerformancePanel from "../components/dashboardui/PerformancePanel";
import { MainBlock } from "../components/baseui/MainBlock"

export default function Analyse() {
  const [activeTab, setActiveTab] = useState("performance");

  // Keyboard shortcut handler
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "p" || e.key === "P") {
        setActiveTab("performance");
      } else if (e.key === "r" || e.key === "R") {
        setActiveTab("risk");
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <MainBlock>
      <div className="flex mt-4 items-center justify-between border-b border-gray-300 mb-1">
        <nav className="flex space-x-4">
          <button
            className={`pb-2 ${activeTab === "performance" ? "border-b-2 border-base font-semibold" : "text-gray-500"}`}
            onClick={() => setActiveTab("performance")}
            aria-selected={activeTab === "performance"}
          >
            Performance
          </button>
          <button
            className={`pb-2 ${activeTab === "risk" ? "border-b-2 border-base font-semibold" : "text-gray-500"}`}
            onClick={() => setActiveTab("risk")}
            aria-selected={activeTab === "risk"}
          >
            Risk
          </button>
        </nav>

        <div className="text-sm text-gray-500 italic hidden sm:block">
          Press <kbd className="border rounded px-1">P</kbd> for Performance, <kbd className="border rounded px-1">R</kbd> for Risk
        </div>
      </div>

      {/* Panel Content */}
      <section>
        {activeTab === "performance" && <PerformancePanel />}
        {activeTab === "risk" && <RiskPanel />}
      </section>
    </MainBlock>
  );
}