import { useParams } from "react-router-dom";
import SectionMaintenanceWarning from "../baseui/SectionMaintenanceWarning";
import BookTradeCard from "../portfolioui/BookTradeCard";
import TradeHistoryCard from "../portfolioui/TradeHistoryCard";

export function TradeBookerPanel(){
    const {portfolioID} = useParams();

    return (
        <>
            <BookTradeCard />
        </>
    );
}