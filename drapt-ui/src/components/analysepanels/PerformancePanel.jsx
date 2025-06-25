import { useState, useEffect } from "react";
import { CardTwo } from "../baseui/CustomCard";
import { AnalyseCard } from "../baseui/CustomCard";
import MetricCard from "../analyseui/MetricCard";
import { MetricHelper, CardHelper } from "../helperui/DivHelper";
import ChartCard, { DualChartCard } from "../analyseui/ChartCard";
import { dummyPerformance, dummyDualChart } from "../../assets/dummy-data/chartData";
import FullscreenItem from "../helperui/FullscreenItemHelper";
import CustomButton from "../baseui/CustomButton";

export default function PerformancePanel() {
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const [fullScreenItem, setFullScreenItem] = useState(null);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setLoaded(true);
      if (metricsRef.current) {
        setMetricsHeight(metricsRef.current.clientHeight);
      }
    }, 1000);
  }, []);
  

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
      {loaded && (
        <>
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
          <CardTwo id={"bonusFeatures"} title={"Performance Attribution"} badge={"Bonus"}>
            <p>See which holdings are contributing most to your PnL.</p>
          </CardTwo>
        </>
      )}
      {!loaded && loading && (
        <>
          <div className="skeleton w-full h-[384px]"></div>
          <MetricHelper>
            <div className="skeleton flex-1 h-[150px]"></div>
            <div className="skeleton flex-1 h-[150px]"></div>
            <div className="skeleton flex-1 h-[150px]"></div>
          </MetricHelper>
          <div className="skeleton w-full h-[384px]"></div>
        </>
      )}
      {fullScreenItem && (
        <FullscreenItem
          reference={setFullScreenItem}
          width={
            ["sharpe", "sortino", "treynor"].includes(fullScreenItem)
              ? 30
              : 75
          }
        >
          {fullScreenItem === "performanceChart" && (
            <ChartCard
              title="Performance Chart"
              data={dummyPerformance}
              size="xlarge"
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
              size="xlarge"
              tooltip="Compare your portfolio's returns to a benchmark index."
            />
          )}
          {["sharpe", "sortino", "treynor"].includes(fullScreenItem) &&
            renderMetricFullScreen(fullScreenItem)}
        </FullscreenItem>
      )}
    </div>
  );
}