import MetricCard from "./MetricCard";
import ChartCard from "./ChartCard";
import HeatmapCard from "./HeatmapCard";
import { dummyAsset1, dummyAsset2, dummyAsset3 } from "../../assets/dummy-data/chartData";

export default function RiskPanel() {
  return (
    <>
      <div className="flex flex-wrap gap-4 mb-6">
        <MetricCard metric="VaR 95" value="-1.26%" tooltip="Potential loss in worst 5% of cases over a given period." />
        <MetricCard metric="VaR 99" value="-2.1%" tooltip="Potential loss in worst 1% of cases over a given period." />
      </div>
      <ChartCard title="Bullish Asset" data={dummyAsset1} size="large" />
      <div className="mb-6"></div>
      <div className="flex flex-col md:flex-row gap-4">
        <ChartCard title="Bearish Asset" data={dummyAsset2} size="medium" />
        <ChartCard title="Neutral Asset" data={dummyAsset3} size="medium" />
      </div>
    </>
  );
}