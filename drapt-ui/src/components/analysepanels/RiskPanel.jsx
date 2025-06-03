import { useState, useEffect } from "react";
import { AnalyseCard } from "../baseui/CustomCard";
import MetricCard from "../analyseui/MetricCard";
import { MetricHelper, CardHelper, ChartHelper } from "../analysehelpers/DivHelper";
import ChartCard from "../analyseui/ChartCard";
import { dummyAsset1, dummyAsset2, dummyAsset3 } from "../../assets/dummy-data/chartData";

export default function RiskPanel() {
  const [selectedPortfolio, setSelectedPortfolio] = useState(
    () => localStorage.getItem("selectedPortfolio") || ""
  );
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (selectedPortfolio) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setLoaded(true);
        setTimeout(() => setAnimate(true), 200);
      }, 1000);
    }
  }, []);

  function mockLoadPortfolio() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setLoaded(true);
      setTimeout(() => setAnimate(true), 200);
    }, 1000);
  }

  function handlePortfolioChange(e) {
    setSelectedPortfolio(e.target.value);
    localStorage.setItem("selectedPortfolio", e.target.value);
    setLoading(false);
    setLoaded(false);
    setAnimate(false);
  }

  return (
    <div className="flex flex-col gap-3">
      <CardHelper>
        <div className={`transition-all duration-700 ${loaded && animate ? "opacity-100 w-full" : "w-full opacity-100"}`}>
          <AnalyseCard id={"select"} title={"Select Portfolio."}>
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-3 h-full"> 
                <select value={selectedPortfolio} onChange={handlePortfolioChange} className="select w-full">
                  <option value="" disabled={true}>Select portfolio</option>
                  <option>Industrial Portfolio</option>
                  <option>TMT Portfolio</option>
                  <option>Europe Portfolio</option>
                  <option>US & Canada Portfolio</option>
                  <option>Metals, Mining and Commodities Portfolio</option>
                </select>
                <button type="button" className="btn btn-primary rounded-lg self-middle shadow-md hover:shadow-lg transition-shadow text-primary-content" onClick={mockLoadPortfolio} disabled={loading || loaded || !selectedPortfolio}>
                  Analyse
                </button>
            </div>
          </AnalyseCard>
        </div>
        <div className={`transition-all duration-700 ${loaded && animate ? "flex-col opacity-100 w-full" : "opacity-0 pointer-events-none w-full"}`}>
          <AnalyseCard id={"welcome"} title={"Welcome to Risk."}>
            <div className="h-full flex flex-col justify-center">
              <p>This section is where you will be able to analyse the risk of your portfolio, across key metrics and graphs.</p> 
            </div>
          </AnalyseCard>
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
        <div className="flex justify-center items-center min-h-[100px]">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      )}
    </div>
  );
}