import { CardOne } from "../baseui/CustomCard";
import CustomButton from "../baseui/CustomButton";

export default function GlobalPortfolioCard({
    portfolioID,
    portfolioName,
    portfolioType,
    portfolioManager,
    portfolioCreationDate,
    portfolioLastModified,
    currentPortfolioValue,
    portfolio1MChange,     
    portfolio1MVolatility,
    portfolioHoldingsNumber 
}) {
    // Format currency
    const formattedValue = typeof currentPortfolioValue === "number"
        ? `£${currentPortfolioValue.toLocaleString()}`
        : currentPortfolioValue;

    // Format return with sign and color
    let returnClass = "text-info";
    if (portfolio1MChange > 0) returnClass = "text-success";
    else if (portfolio1MChange < 0) returnClass = "text-error";

    const formattedReturn = 
        (portfolio1MChange > 0 ? "+" : "") + portfolio1MChange.toFixed(1) + "%";

    // Format volatility
    const formattedVolatility = portfolio1MVolatility.toFixed(2) + "%";

    return (
        <CardOne title={portfolioName}>
            <div className="flex flex-col md:flex-row w-full">
                <div className="w-full md:w-1/2 text-left">
                    <div className="grid grid-cols-2 gap-y-1">
                        <span>Type</span>
                        <span className="font-semibold">{portfolioType}</span>
                        <span>Manager</span>
                        <span className="font-semibold">{portfolioManager}</span>
                        <span>Created On</span>
                        <span className="font-semibold">{portfolioCreationDate}</span>
                        <span>Last Modified</span>
                        <span className="font-semibold">{portfolioLastModified}</span>
                    </div>
                </div>
                <div className="w-full md:w-1/2 text-left">
                    <div className="grid grid-cols-2 gap-y-1">
                        <span>Current value</span>
                        <span className="font-semibold">{formattedValue}</span>
                        <span>1 Month Return</span>
                        <span className={`font-semibold ${returnClass}`}>{formattedReturn}</span>
                        <span>1 Month Volatility</span>
                        <span className="font-semibold">{formattedVolatility}</span>
                        <span>Holdings</span>
                        <span className="font-semibold">{portfolioHoldingsNumber}</span>
                    </div>
                </div>
            </div>
            <CustomButton to={`/portfolio/${portfolioID}`}>
                Navigate to {portfolioName}
            </CustomButton>
        </CardOne>
    );
}