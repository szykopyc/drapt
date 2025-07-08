import { CardOne } from "../baseui/CustomCard";
import CustomButton from "../baseui/CustomButton";

export default function GlobalPortfolioCard({
    id,
    portfolio_string_id,
    name,
    description,
    created_at,
    members,
    portfolioID, // not needed for now
    portfolioName, // not needed for now
    portfolioType, // not needed for now
    portfolioManager, // not needed for now
    portfolioCreationDate, // not needed for now
    portfolioLastModified, // not needed for now
    portfolioCurrentValue, // not needed for now
    portfolio1MonthChange, // not needed for now
    portfolio1MonthVolatility, // not needed for now
    portfolioHoldingsNumber, // not needed for now
}) {
    // Format currency
    {
        /**
    const formattedValue =
        typeof portfolioCurrentValue === "number"
            ? `£${portfolioCurrentValue.toLocaleString()}`
            : portfolioCurrentValue;
     */
    }
    // Format return with sign and color
    let returnClass = "text-info";
    //if (portfolio1MonthChange > 0) returnClass = "text-success";
    //else if (portfolio1MonthChange < 0) returnClass = "text-error";

    {
        /**
    const formattedReturn =
        (portfolio1MonthChange > 0 ? "+" : "") +
        portfolio1MonthChange.toFixed(2) +
        "%";
     */
    }

    // Format volatility
    //const formattedVolatility = portfolio1MonthVolatility.toFixed(2) + "%";

    return (
        <CardOne title={name}>
            <div className="flex flex-col md:flex-row gap-y-1 w-full">
                <div className="w-full md:w-1/2 text-left">
                    <div className="grid grid-cols-2 gap-y-1">
                        <span>Type</span>
                        <span className="font-semibold">Equity</span>
                        <span>Manager</span>
                        <span className="font-semibold">
                            {members[0]["fullname"]}
                        </span>
                        <span>Created On</span>
                        <span className="font-semibold">
                            {new Date(created_at).toISOString().split("T")[0]}
                        </span>
                        <span>Last Modified</span>
                        <span className="font-semibold">
                            Yet To Create
                            {/*{portfolioLastModified}*/}
                        </span>
                    </div>
                </div>
                <div className="w-full md:w-1/2 text-left">
                    <div className="grid grid-cols-2 gap-y-1">
                        <span>Current value</span>
                        <span className="font-semibold">
                            {/*{formattedValue}*/}Yet To Create
                        </span>
                        <span>1 Month Return</span>
                        <span className={`font-semibold ${returnClass}`}>
                            {/*{formattedReturn}*/}Yet To Create
                        </span>
                        <span>1 Month Volatility</span>
                        <span className="font-semibold">
                            {/*{formattedVolatility}*/}Yet To Create
                        </span>
                        <span>Holdings</span>
                        <span className="font-semibold">
                            {/*{portfolioHoldingsNumber}*/}Yet To Create
                        </span>
                    </div>
                </div>
            </div>
            <div className="flex flex-row gap-1 md:gap-3 justify-between">
                <CustomButton
                    to={`/analyse/${portfolio_string_id}`}
                    tabIndex={0}
                >
                    Analyse
                </CustomButton>
                <CustomButton
                    to={`/portfolio/${portfolio_string_id}`}
                    tabIndex={0}
                >
                    Manage
                </CustomButton>
            </div>
        </CardOne>
    );
}
