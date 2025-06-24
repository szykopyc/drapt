import { useParams } from "react-router-dom";
import { useRef /*, useEffect*/ } from "react";
import SectionMaintenanceWarning from "../baseui/SectionMaintenanceWarning";
import BookTradeCard from "../portfolioui/BookTradeCard";
import TradeHistoryCard from "../portfolioui/TradeHistoryCard";

export function TradeBookerPanel() {
  const { portfolioID } = useParams();
  const bookTradeRef = useRef(null);

  /*
  useEffect(() => {
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
      if (e.key === "1") {
        bookTradeRef.current?.focus();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
  */

  return (
    <>
      <BookTradeCard focusRef={bookTradeRef} />
      <TradeHistoryCard />
    </>
  );
}