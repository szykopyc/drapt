import { CardOne } from "../baseui/CustomCard";
import CustomButton from "../baseui/CustomButton";

export default function GlobalAnalysisCard({
    portfolioID,
    portfolioName,
    portfolioManager
}) {
    return (
        <CardOne title={portfolioName}>
            <p>Manager - <span className="font-semibold">{portfolioManager}</span></p>
            <CustomButton to={`/analyse/${portfolioID}`}>
                Analyse {portfolioName}
            </CustomButton>
        </CardOne>
    );
}