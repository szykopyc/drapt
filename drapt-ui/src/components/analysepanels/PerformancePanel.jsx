import { useState, useEffect } from "react";
import { AnalyseCard } from "../baseui/CustomCard";
import MetricCard from "../analyseui/MetricCard";
import { MetricHelper, CardHelper } from "../analysehelpers/DivHelper";
import ChartCard, { DualChartCard } from "../analyseui/ChartCard";
import { dummyPerformance, dummyDualChart } from "../../assets/dummy-data/chartData";

export default function PerformancePanel() {
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
          <AnalyseCard id={"welcome"} title={"Welcome to Performance."}>
            <div className="h-full flex flex-col justify-center">
              <p>This section is where you will be able to analyse the performance of your portfolio, across key metrics and graphs.</p> 
            </div>
          </AnalyseCard>
        </div>
      </CardHelper>
      {loaded && (
        <>
          <div className="divider my-0"></div>
          <ChartCard
            title="Performance Chart"
            data={dummyPerformance}
            size="large"
            tooltip="This chart visualizes your portfolio's performance over time."
          />
          <MetricHelper>
            <MetricCard metric="Sharpe" value="1.23" valuestatus="positive" tooltip="Measures return per unit of risk. Higher is better." />
            <MetricCard metric="Sortino" value="1" valuestatus="neutral" tooltip="Like Sharpe, but only penalizes downside volatility." />
            <MetricCard metric="Treynor" value="0.3" valuestatus="negative" tooltip="Measures return per unit of market risk (beta). Higher is better." />
          </MetricHelper>
          <DualChartCard
            title="Portfolio vs Benchmark"
            data={dummyDualChart}
            dataKey1="value"
            dataKey2="value2"
            label1="Portfolio"
            label2="Benchmark"
            size="large"
            tooltip="Compare your portfolio's returns to a benchmark index."
          />
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