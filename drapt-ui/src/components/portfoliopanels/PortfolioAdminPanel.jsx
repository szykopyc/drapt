import { useParams } from "react-router-dom";

export function PortfolioAdminPanel(){
    const {portfolioID} = useParams();

    return (
        <p>Portfolio admin panel for {portfolioID}</p>
    );
}