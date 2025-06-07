import { useState } from "react";
import { AnalyseCard } from "../baseui/CustomCard";
import MetricCard from "../analyseui/MetricCard";
import { MetricHelper, CardHelper, ChartHelper } from "../helperui/DivHelper";
import ChartCard from "../analyseui/ChartCard";
import { LoadingSpinner } from "../helperui/LoadingSpinnerHelper";
import { dummyAsset1, dummyAsset2, dummyAsset3 } from "../../assets/dummy-data/chartData";

export default function RiskPanel() {
  const [selectedPortfolio, setSelectedPortfolio] = useState("");
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  function mockLoadPortfolio() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setLoaded(true);
    }, 1000);
  }

  function handlePortfolioChange(e) {
    setSelectedPortfolio(e.target.value);
    setLoading(false);
    setLoaded(false);
  }

  return (
    <div className="flex flex-col gap-3">
      <CardHelper>
        <div className="flex flex-col md:flex-row gap-3 w-full">
          <div className="md:w-1/2 w-full">
            <AnalyseCard id={"select"} title={"Select Portfolio"}>
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-3 h-full"> 
                <select value={selectedPortfolio} onChange={handlePortfolioChange} className="select w-full">
                  <option value="" disabled={true}>Select portfolio</option>
                  <option>Industrial Portfolio</option>
                  <option>TMT Portfolio</option>
                  <option>Europe Portfolio</option>
                  <option>US & Canada Portfolio</option>
                  <option>Metals, Mining and Commodities Portfolio</option>
                </select>
                <button
                  type="button"
                  className="btn btn-primary rounded-lg self-middle shadow-md hover:shadow-lg transition-shadow text-primary-content"
                  onClick={mockLoadPortfolio}
                  disabled={loading || loaded || !selectedPortfolio}
                >
                  Analyse
                </button>
              </div>
            </AnalyseCard>
          </div>
          <div className="md:w-1/2 w-full">
            <AnalyseCard id={"welcome"} title={"Welcome to Risk"}>
              <div className="h-full flex flex-col justify-center">
                <p>This section is where you will be able to analyse the risk of your portfolio, across key metrics and graphs.</p> 
              </div>
            </AnalyseCard>
          </div>
        </div>
      </CardHelper>
      {loaded && (
        <>
          <div className="divider my-0"></div>
          <MetricHelper>
            <MetricCard metric="VaR 95" value="-1.26%" tooltip="Potential loss in worst 5% of cases over a given period." />
            <MetricCard metric="VaR 99" value="-2.1%" tooltip="Potential loss in worst 1% of cases over a given period." />
          </MetricHelper>
          <ChartCard
            title="Bullish Asset"
            data={dummyAsset1}
            size="large"
            tooltip="This chart shows the performance of a bullish asset over time."
          />
          <ChartHelper>
            <ChartCard title="Bearish Asset" data={dummyAsset2} size="medium" tooltip="This chart displays a bearish asset's recent trend."/>
            <ChartCard title="Neutral Asset" data={dummyAsset3} size="medium" tooltip="This chart represents a neutral asset's stability."/>
          </ChartHelper>
          <MetricHelper>
            <MetricCard metric="Beta" value="1.34" tooltip="Measures sensitivity to market movements. 1 means moves with the market." />
            <MetricCard metric="CVaR 95" value="-2.7%" tooltip="Expected loss in the worst 5% of cases. More conservative than VaR." />
          </MetricHelper>
        </>
      )}
      {!loaded && loading && (
        <>
          <div className="divider my-0"></div>
          <MetricHelper>
            <div className="skeleton flex-1 h-[150px]"></div>
            <div className="skeleton flex-1 h-[150px]"></div>
          </MetricHelper>
          <div className="skeleton w-full h-[461px]"></div>
          <ChartHelper>
            <div className="skeleton flex-1 h-[461px]"></div>
            <div className="skeleton flex-1 h-[461px]"></div>
          </ChartHelper>
          <MetricHelper>
            <div className="skeleton flex-1 h-[150px]"></div>
            <div className="skeleton flex-1 h-[150px]"></div>
          </MetricHelper>
        </>
      )}
    </div>
  );
}