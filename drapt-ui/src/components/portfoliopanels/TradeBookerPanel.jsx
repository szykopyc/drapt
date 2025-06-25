import { useParams } from "react-router-dom";
import { useRef /*, useEffect*/ } from "react";
import SectionMaintenanceWarning from "../baseui/SectionMaintenanceWarning";
import BookTradeCard from "../portfolioui/BookTradeCard";
import TradeHistoryCard from "../portfolioui/TradeHistoryCard";

export function TradeBookerPanel() {
    const bookTradeRef = useRef(null);
    return (
        <>
            <BookTradeCard focusRef={bookTradeRef} />
            <TradeHistoryCard />
        </>
    );
}
