import { CardOne } from "../baseui/CustomCard";
import CustomButton from "../baseui/CustomButton";
import { currencyMapperDict } from "../../helperfunctions/CurrencyMapper";
// this
export default function GlobalPortfolioCard({
  portfolio_string_id,
  name,
  created_at,
  members,
  initial_cash,
  currency
}) {

  return (
    <CardOne title={name}>
      <div className="flex flex-col md:flex-row gap-y-1 w-full">
        <div className="w-full md:w-1/2 text-left">
          <div className="grid grid-cols-2 gap-y-1">
            <span>Type</span>
            <span className="font-semibold">Equity</span>
            <span>Manager</span>
            <span className="font-semibold">
              {members.length !== 0 ? members[0]["fullname"] : "N/A"}
            </span>
            <span>Created On</span>
            <span className="font-semibold">
              {new Date(created_at).toISOString().split("T")[0]}
            </span>
            <span>Initial Cash</span>
            <span className="font-semibold">
              {currencyMapperDict[currency]}{initial_cash}
            </span>
          </div>
        </div>
        <div className="w-full md:w-1/2 text-left">
          <div className="grid grid-cols-2 gap-y-1">
            <span>Current value</span>
            <span className="font-semibold">
              {/*{formattedValue}*/}YTC
            </span>
            <span>1 Month Return</span>
            <span className={`font-semibold`}>
              {/*{formattedReturn}*/}YTC
            </span>
            <span>1 Month Volatility</span>
            <span className="font-semibold">
              {/*{formattedVolatility}*/}YTC
            </span>
            <span>Holdings</span>
            <span className="font-semibold">
              {/*{portfolioHoldingsNumber}*/}YTC
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
