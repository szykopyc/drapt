import { useParams } from "react-router-dom";

export function TradeBookerPanel(){
    const {portfolioID} = useParams();

    return (
        <p>Trade booker panel for {portfolioID}</p>
    );
}