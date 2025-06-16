import { useParams } from "react-router-dom";
import SectionMaintenanceWarning from "../baseui/SectionMaintenanceWarning";

export function PortfolioAdminPanel(){
    const {portfolioID} = useParams();

    return (
        <SectionMaintenanceWarning />
    );
}