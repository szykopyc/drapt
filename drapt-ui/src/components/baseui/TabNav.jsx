import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function TabNav({
  tabs = [],
  initialTab = null,
  keyboardShortcuts = true,
  className = "",
  onTabChange,
  showKeyboardShortcuts = true
}) {
  const [activeTab, setActiveTab] = useState(initialTab || (tabs[0]?.value ?? ""));
  const navigate = useNavigate();
  const tabRefs = useRef([]);

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

  // Arrow key navigation handler for tabs
  const handleTabKeyDown = (e, idx) => {
    if (e.key === "ArrowRight") {
      const nextIdx = (idx + 1) % tabs.length;
      setActiveTab(tabs[nextIdx].value);
      tabRefs.current[nextIdx]?.focus();
      if (tabs[nextIdx].to) navigate(tabs[nextIdx].to);
      e.preventDefault();
    } else if (e.key === "ArrowLeft") {
      const prevIdx = (idx - 1 + tabs.length) % tabs.length;
      setActiveTab(tabs[prevIdx].value);
      tabRefs.current[prevIdx]?.focus();
      if (tabs[prevIdx].to) navigate(tabs[prevIdx].to);
      e.preventDefault();
    }
  };

  return (
    <div className={`flex items-center justify-between border-b border-gray-300 ${className}`}>
      <nav className="flex space-x-3" role="tablist">
        {tabs.map((tab, idx) =>
          tab.to ? (
            <Link
              key={tab.value}
              ref={el => (tabRefs.current[idx] = el)}
              tabIndex={activeTab === tab.value ? 0 : -1}
              className={`pb-2 ${activeTab === tab.value ? "border-b-2 border-base font-semibold" : "text-base-content/70"}`}
              onClick={() => setActiveTab(tab.value)}
              aria-selected={activeTab === tab.value}
              to={tab.to}
              role="tab"
              onKeyDown={e => handleTabKeyDown(e, idx)}
            >
              {tab.label}
            </Link>
          ) : (
            <button
              key={tab.value}
              ref={el => (tabRefs.current[idx] = el)}
              tabIndex={activeTab === tab.value ? 0 : -1}
              className={`pb-2 ${activeTab === tab.value ? "border-b-2 border-base font-semibold" : "text-base-content/70"}`}
              onClick={() => setActiveTab(tab.value)}
              aria-selected={activeTab === tab.value}
              type="button"
              role="tab"
              onKeyDown={e => handleTabKeyDown(e, idx)}
            >
              {tab.label}
            </button>
          )
        )}
      </nav>
      {showKeyboardShortcuts && (
        <div className="text-sm text-base-content/70 italic hidden sm:block">
        {tabs
          .filter((tab) => tab.keyShortcut)
          .map((tab, i) => (
            <span key={tab.value}>
              {i > 0 && " "}
              <kbd className="border rounded px-1">{tab.keyShortcut.toUpperCase()}</kbd>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}