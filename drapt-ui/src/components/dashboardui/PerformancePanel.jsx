// src/components/dashboardui/PerformancePanel.jsx
import MainCard from "./MainCard";
import MetricCard from "./MetricCard";
import ChartCard, { DualChartCard} from "./ChartCard";
import { dummyPerformance, dummyDualChart } from "../../assets/dummy-data/chartData";

export default function PerformancePanel() {
  return (
    <>
      <MainCard title="Portfolio Overview">
        <p>Sharpe Ratio: 0.98</p>
      </MainCard>
      <div className="my-6">
        <ChartCard title="Performance Chart" data={dummyPerformance} size="large" />
      </div>
      <div className="flex flex-wrap gap-4">
        <MetricCard metric="Sharpe" value="1.23" valuestatus="positive" tooltip="Measures return per unit of risk. Higher is better." />
        <MetricCard metric="Sortino" value="1" valuestatus="neutral" tooltip="Like Sharpe, but only penalizes downside volatility." />
        <MetricCard metric="Treynor" value="0.3" valuestatus="negative" tooltip="Measures return per unit of market risk (beta). Higher is better." />
      </div>
      <div className="mt-6"></div>
      <DualChartCard
      title="Portfolio vs Benchmark"
      data={dummyDualChart}
      dataKey1="value"
      dataKey2="value2"
      label1="Portfolio"
      label2="Benchmark"
      size="large"
    />
    </>
  );
}