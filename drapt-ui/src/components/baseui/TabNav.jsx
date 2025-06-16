import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function TabNav({
  tabs = [],
  initialTab = null,
  keyboardShortcuts = true,
  className = "",
  onTabChange,
}) {
  const [activeTab, setActiveTab] = useState(initialTab || (tabs[0]?.value ?? ""));
  const navigate = useNavigate();

  useEffect(() => {
    if (onTabChange) onTabChange(activeTab);
  }, [activeTab, onTabChange]);

  useEffect(() => {
    if (!keyboardShortcuts) return;
    function handleKeyDown(e) {
      const tag = document.activeElement.tagName.toLowerCase();
      if (
        tag === "input" ||
        tag === "textarea" ||
        tag === "select" ||
        document.activeElement.isContentEditable
      ) {
        return;
      }
      for (const tab of tabs) {
        if (
          tab.keyShortcut &&
          (e.key === tab.keyShortcut || e.key === tab.keyShortcut.toUpperCase())
        ) {
          setActiveTab(tab.value);
          if (tab.to) navigate(tab.to);
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [tabs, navigate, keyboardShortcuts]);

  return (
    <div className={`flex items-center justify-between border-b border-gray-300 ${className}`}>
      <nav className="flex space-x-4">
        {tabs.map((tab) =>
          tab.to ? (
            <Link
              key={tab.value}
              className={`pb-2 ${activeTab === tab.value ? "border-b-2 border-base font-semibold" : "text-base-content/70"}`}
              onClick={() => setActiveTab(tab.value)}
              aria-selected={activeTab === tab.value}
              to={tab.to}
            >
              {tab.label}
            </Link>
          ) : (
            <button
              key={tab.value}
              className={`pb-2 ${activeTab === tab.value ? "border-b-2 border-base font-semibold" : "text-base-content/70"}`}
              onClick={() => setActiveTab(tab.value)}
              aria-selected={activeTab === tab.value}
              type="button"
            >
              {tab.label}
            </button>
          )
        )}
      </nav>
      <div className="text-sm text-base-content/70 italic hidden sm:block">
        {tabs
          .filter((tab) => tab.keyShortcut)
          .map((tab, i) => (
            <span key={tab.value}>
              {i > 0 && ", "}
              <kbd className="border rounded px-1">{tab.keyShortcut.toUpperCase()}</kbd> for {tab.label}
            </span>
          ))}
      </div>
    </div>
  );
}