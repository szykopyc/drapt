// src/components/dashboardui/PerformancePanel.jsx
import MainCard from "./MainCard";
import MetricCard from "./MetricCard";
import ChartCard from "./ChartCard";
import { dummyPerformance } from "../../assets/dummy-data/chartData";

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
        <MetricCard metric="Sharpe" value="1.23" tooltip="Measures return per unit of risk. Higher is better." />
        <MetricCard metric="Sortino" value="1" tooltip="Like Sharpe, but only penalizes downside volatility." />
      </div>
    </>
  );
}