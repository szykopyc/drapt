import { useState, useEffect } from "react";
import { AnalyseCard } from "../baseui/CustomCard";
import MetricCard from "../analyseui/MetricCard";
import { MetricHelper, CardHelper, ChartHelper } from "../helperui/DivHelper";
import ChartCard from "../analyseui/ChartCard";
import FullscreenItem from "../helperui/FullscreenItemHelper";
import { dummyAsset1, dummyAsset2, dummyAsset3 } from "../../assets/dummy-data/chartData";
import CustomButton from "../baseui/CustomButton";
import { CardTwo } from "../baseui/CustomCard";

export default function RiskPanel() {
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

  // Helper for rendering metric content in fullscreen
  function renderMetricFullScreen(item) {
    switch (item) {
      case "var95":
        return (
          <MetricCard
            metric="VaR 95"
            value="-1.26%"
            tooltip="Potential loss in worst 5% of cases over a given period."
            className="text-2xl"
          />
        );
      case "var99":
        return (
          <MetricCard
            metric="VaR 99"
            value="-2.1%"
            tooltip="Potential loss in worst 1% of cases over a given period."
            className="text-2xl"
          />
        );
      case "beta":
        return (
          <MetricCard
            metric="Beta"
            value="1.34"
            tooltip="Measures sensitivity to market movements. 1 means moves with the market."
            className="text-2xl"
          />
        );
      case "cvar95":
        return (
          <MetricCard
            metric="CVaR 95"
            value="-2.7%"
            tooltip="Expected loss in the worst 5% of cases. More conservative than VaR."
            className="text-2xl"
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
          <MetricHelper>
            <div className="flex-1 cursor-pointer" onClick={() => setFullScreenItem("var95")}>
              <MetricCard
                metric="VaR 95"
                value="-1.26%"
                tooltip="Potential loss in worst 5% of cases over a given period."
                expandButton={true}
              />
            </div>
            <div className="flex-1 cursor-pointer" onClick={() => setFullScreenItem("var99")}>
              <MetricCard
                metric="VaR 99"
                value="-2.1%"
                tooltip="Potential loss in worst 1% of cases over a given period."
                expandButton={true}
              />
            </div>
          </MetricHelper>
          <div onClick={() => setFullScreenItem("bullish")} className="cursor-pointer w-full">
            <ChartCard
              title="Bullish Asset"
              data={dummyAsset1}
              size="large"
              tooltip="This chart shows the performance of a bullish asset over time."
              expandButton={true}
            />
          </div>
          <ChartHelper>
            <div onClick={() => setFullScreenItem("bearish")} className="cursor-pointer w-full">
              <ChartCard
                title="Bearish Asset"
                data={dummyAsset2}
                size="large"
                tooltip="This chart displays a bearish asset's recent trend."
                expandButton={true}
              />
            </div>
            <div onClick={() => setFullScreenItem("neutral")} className="cursor-pointer w-full">
              <ChartCard
                title="Neutral Asset"
                data={dummyAsset3}
                size="large"
                tooltip="This chart represents a neutral asset's stability."
                expandButton={true}
              />
            </div>
          </ChartHelper>
          <MetricHelper>
            <div className="flex-1 cursor-pointer" onClick={() => setFullScreenItem("beta")}>
              <MetricCard
                metric="Beta"
                value="1.34"
                tooltip="Measures sensitivity to market movements. 1 means moves with the market."
                expandButton={true}
              />
            </div>
            <div className="flex-1 cursor-pointer" onClick={() => setFullScreenItem("cvar95")}>
              <MetricCard
                metric="CVaR 95"
                value="-2.7%"
                tooltip="Expected loss in the worst 5% of cases. More conservative than VaR."
                expandButton={true}
              />
            </div>
          </MetricHelper>
          <CardTwo id={"bonusFeatures"} title={"Risk Contribution"} badge={"Bonus"}>
            <p>See which holdings carry the most risk, and get actionable insights for better risk management.</p>
          </CardTwo>
        </>
      )}
      {!loaded && loading && (
        <>
          <MetricHelper>
            <div className="skeleton flex-1 h-[126px]"></div>
            <div className="skeleton flex-1 h-[126px]"></div>
          </MetricHelper>
          <div className="skeleton w-full h-[384px]"></div>
          <ChartHelper>
            <div className="skeleton w-full h-[384px]"></div>
            <div className="skeleton w-full h-[384px]"></div>
          </ChartHelper>
          <MetricHelper>
            <div className="skeleton flex-1 h-[126px]"></div>
            <div className="skeleton flex-1 h-[126px]"></div>
          </MetricHelper>
        </>
      )} 
      {fullScreenItem && (
        <FullscreenItem
          reference={setFullScreenItem}
          width={
            ["var95", "var99", "beta", "cvar95"].includes(fullScreenItem)
              ? 30
              : 75
          }
        >
          {fullScreenItem === "bearish" && (
            <ChartCard title="Bearish Asset" data={dummyAsset2} size="xlarge" tooltip="" />
          )}
          {fullScreenItem === "neutral" && (
            <ChartCard title="Neutral Asset" data={dummyAsset3} size="xlarge" tooltip="" />
          )}
          {fullScreenItem === "bullish" && (
            <ChartCard title="Bullish Asset" data={dummyAsset1} size="xlarge" tooltip="" />
          )}
          {["var95", "var99", "beta", "cvar95"].includes(fullScreenItem) &&
            renderMetricFullScreen(fullScreenItem)}
        </FullscreenItem>
      )}
    </div>
  );
}