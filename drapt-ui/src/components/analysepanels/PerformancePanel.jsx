import { useState } from "react";
import { AnalyseCard } from "../baseui/CustomCard";
import MetricCard from "../analyseui/MetricCard";
import { MetricHelper, CardHelper } from "../helperui/DivHelper";
import ChartCard, { DualChartCard } from "../analyseui/ChartCard";
import { dummyPerformance, dummyDualChart } from "../../assets/dummy-data/chartData";
import { FullscreenItem } from "../helperui/FullscreenItemHelper";

export default function PerformancePanel() {
  const [selectedPortfolio, setSelectedPortfolio] = useState("");
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const [fullScreenItem, setFullScreenItem] = useState(null);

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

  function renderMetricFullScreen(item) {
    switch (item) {
      case "sharpe":
        return (
          <MetricCard
            metric="Sharpe"
            value="1.23"
            valuestatus="positive"
            tooltip="Measures return per unit of risk. Higher is better."
            className="text-2xl"
            expandButton={false}
          />
        );
      case "sortino":
        return (
          <MetricCard
            metric="Sortino"
            value="1"
            valuestatus="neutral"
            tooltip="Like Sharpe, but only penalises downside volatility."
            className="text-2xl"
            expandButton={false}
          />
        );
      case "treynor":
        return (
          <MetricCard
            metric="Treynor"
            value="0.3"
            valuestatus="negative"
            tooltip="Measures return per unit of market risk (beta). Higher is better."
            className="text-2xl"
            expandButton={false}
          />
        );
      default:
        return null;
    }
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
            <AnalyseCard id={"welcome"} title={"Welcome to Performance"}>
              <div className="h-full flex flex-col justify-center">
                <p>This section is where you will be able to analyse the performance of your portfolio, across key metrics and graphs.</p> 
              </div>
            </AnalyseCard>
          </div>
        </div>
      </CardHelper>
      {loaded && (
        <>
          <div className="divider my-0"></div>
          <ChartCard
            title="Performance Chart"
            data={dummyPerformance}
            size="large"
            tooltip="This chart visualises your portfolio's performance over time."
            expandButton={true}
            onExpand={() => setFullScreenItem("performanceChart")}
          />
          <MetricHelper>
            <MetricCard
              metric="Sharpe"
              value="1.23"
              valuestatus="positive"
              tooltip="Measures return per unit of risk. Higher is better."
              expandButton={true}
              onExpand={() => setFullScreenItem("sharpe")}
            />
            <MetricCard
              metric="Sortino"
              value="1"
              valuestatus="neutral"
              tooltip="Like Sharpe, but only penalises downside volatility."
              expandButton={true}
              onExpand={() => setFullScreenItem("sortino")}
            />
            <MetricCard
              metric="Treynor"
              value="0.3"
              valuestatus="negative"
              tooltip="Measures return per unit of market risk (beta). Higher is better."
              expandButton={true}
              onExpand={() => setFullScreenItem("treynor")}
            />
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
            expandButton={true}
            onExpand={() => setFullScreenItem("portfolioBenchmarkChart")}
          />
        </>
      )}
      {!loaded && loading && (
        <>
          <div className="divider my-0"></div>
          <div className="skeleton w-full h-[461px]"></div>
          <MetricHelper>
            <div className="skeleton flex-1 h-[150px]"></div>
            <div className="skeleton flex-1 h-[150px]"></div>
            <div className="skeleton flex-1 h-[150px]"></div>
          </MetricHelper>
          <div className="skeleton w-full h-[461px]"></div>
        </>
      )}
      {fullScreenItem && (
        <FullscreenItem reference={setFullScreenItem}>
          {fullScreenItem === "performanceChart" && (
            <ChartCard
              title="Performance Chart"
              data={dummyPerformance}
              size="large"
              tooltip="This chart visualises your portfolio's performance over time."
            />
          )}
          {fullScreenItem === "portfolioBenchmarkChart" && (
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
          )}
          {["sharpe", "sortino", "treynor"].includes(fullScreenItem) && renderMetricFullScreen(fullScreenItem)}
        </FullscreenItem>
      )}
    </div>
  );
}