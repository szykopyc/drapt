import { useState, useEffect } from "react";
import UserEngagementPanel from "../components/adminpanel/UserEngagement";
import UserManagementPanel from "../components/adminpanel/UserManagementPanel";
import { MainBlock } from "../components/baseui/MainBlock";
import { BeginText } from "../components/baseui/BeginText";

export default function AdminWrapper() {
  const [activeTab, setActiveTab] = useState("userManagement");
  
  useEffect(() => {
    function handleKeyDown(e) {
      const tag = document.activeElement.tagName.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select" || document.activeElement.isContentEditable) {
        return;
      }
      if (e.key === "m" || e.key === "M") {
        setActiveTab("userManagement");
      } else if (e.key === "e" || e.key === "E") {
        setActiveTab("userEngagement");
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <MainBlock>
      <BeginText title={"User Administration"}>
      </BeginText>
      <div className="flex items-center justify-between border-b border-gray-300">
        <nav className="flex space-x-4">
          <button
            className={`pb-2 ${activeTab === "userManagement" ? "border-b-2 border-base font-semibold" : "text-base-content/70"}`}
            onClick={() => setActiveTab("userManagement")}
            aria-selected={activeTab === "userManagement"}
          >
            User Management
          </button>
          <button
            className={`pb-2 ${activeTab === "userEngagement" ? "border-b-2 border-base font-semibold" : "text-base-content/70"}`}
            onClick={() => setActiveTab("userEngagement")}
            aria-selected={activeTab === "userEngagement"}
          >
            User Engagement
          </button>
        </nav>
        <div className="text-sm text-base-content/70 italic hidden sm:block">
          <kbd className="border rounded px-1">M</kbd> for User Management, <kbd className="border rounded px-1">E</kbd> for User Engagement
        </div>
      </div>
      <section>
        {activeTab === "userEngagement" && <UserEngagementPanel />}
        {activeTab === "userManagement" && <UserManagementPanel />}
      </section>
    </MainBlock>
  );
}