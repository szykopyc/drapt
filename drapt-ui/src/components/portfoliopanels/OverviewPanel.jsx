import { useParams } from "react-router-dom";

export function OverviewPanel(){
    const {portfolioID} = useParams();

    return (
        <p>Overview of {portfolioID}</p>
    );
}