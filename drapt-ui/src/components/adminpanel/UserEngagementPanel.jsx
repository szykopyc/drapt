import { useState, useEffect } from "react";
import { AnalyseCard } from "../baseui/CustomCard";
import MetricCard from "../analyseui/MetricCard";
import { MetricHelper, CardHelper } from "../helperui/DivHelper";
import ChartCard, { DualChartCard } from "../analyseui/ChartCard";
import {
  dummyPerformance,
  dummyDualChart,
} from "../../assets/dummy-data/chartData";
import FullscreenItem from "../helperui/FullscreenItemHelper";

export default function UserEngagementPanel() {
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [fullScreenItem, setFullScreenItem] = useState(null);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setLoaded(true);
    }, 1000);
  }, []);

  function renderMetricFullScreen(item) {
    switch (item) {
      case "dau":
        return (
          <MetricCard
            metric="Daily Active Users"
            value="128"
            valuestatus="positive"
            tooltip="Number of unique users active today."
            expandButton={false}
            isExpanded={true}
          />
        );
      case "retention":
        return (
          <MetricCard
            metric="Weekly Retention"
            value="67%"
            valuestatus="neutral"
            tooltip="Percentage of users returning within a week."
            expandButton={false}
            isExpanded={true}
          />
        );
      case "duration":
        return (
          <MetricCard
            metric="Avg. Session Duration"
            value="5.2 min"
            valuestatus="positive"
            tooltip="Average time a user spends per session."
            expandButton={false}
            isExpanded={true}
          />
        );
      case "bounce":
        return (
          <MetricCard
            metric="Bounce Rate"
            value="18%"
            valuestatus="positive"
            tooltip="Percentage of users who leave after viewing only one page. Lower is better."
            expandButton={false}
            isExpanded={true}
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
            title="Active Users Over Time"
            data={dummyPerformance}
            size="large"
            tooltip="Shows the number of active users on the platform over time."
            currencyEnabled={false}
            expandButton={true}
            onExpand={() => setFullScreenItem("activeUsers")}
          />
          <MetricHelper>
            <MetricCard
              metric="Users"
              value="128"
              valuestatus="positive"
              tooltip="Number of unique users active today."
              expandButton={true}
              onExpand={() => setFullScreenItem("dau")}
            />
            <MetricCard
              metric="Retention"
              value="67%"
              valuestatus="neutral"
              tooltip="Percentage of users returning within a week."
              expandButton={true}
              onExpand={() => setFullScreenItem("retention")}
            />
            <MetricCard
              metric="Duration"
              value="5.2 min"
              valuestatus="positive"
              tooltip="Average time a user spends per session."
              expandButton={true}
              onExpand={() => setFullScreenItem("duration")}
            />
            <MetricCard
              metric="Bounce%"
              value="18%"
              valuestatus="positive"
              tooltip="Percentage of users who leave after viewing only one page. Lower is better."
              expandButton={true}
              onExpand={() => setFullScreenItem("bounce")}
            />
          </MetricHelper>
          <DualChartCard
            title="User Sign-ups vs. Logins"
            data={dummyDualChart}
            dataKey1="value"
            dataKey2="value2"
            label1="Sign-ups"
            label2="Logins"
            size="large"
            tooltip="Compare the number of new sign-ups to returning logins over time."
            currencyEnabled={false}
            expandButton={true}
            onExpand={() => setFullScreenItem("signupsVsLogins")}
          />
        </>
      )}
      {!loaded && loading && (
        <>
          <div className="skeleton w-full h-[461px]"></div>
          <MetricHelper>
            <div className="skeleton flex-1 h-[176px]"></div>
            <div className="skeleton flex-1 h-[176px]"></div>
            <div className="skeleton flex-1 h-[176px]"></div>
            <div className="skeleton flex-1 h-[176px]"></div>
          </MetricHelper>
          <div className="skeleton w-full h-[461px]"></div>
        </>
      )}
      {fullScreenItem && (
        <FullscreenItem
          reference={setFullScreenItem}
          width={
            ["dau", "retention", "duration", "bounce"].includes(
              fullScreenItem
            )
              ? 30
              : 75
          }
        >
          {fullScreenItem === "activeUsers" && (
            <ChartCard
              title="Active Users Over Time"
              data={dummyPerformance}
              size="xlarge"
              tooltip="Shows the number of active users on the platform over time."
              currencyEnabled={false}
              expandButton={false}
              isExpanded={true}
            />
          )}
          {fullScreenItem === "signupsVsLogins" && (
            <DualChartCard
              title="User Sign-ups vs. Logins"
              data={dummyDualChart}
              dataKey1="value"
              dataKey2="value2"
              label1="Sign-ups"
              label2="Logins"
              size="xlarge"
              tooltip="Compare the number of new sign-ups to returning logins over time."
              currencyEnabled={false}
              expandButton={false}
              isExpanded={true}
            />
          )}
          {["dau", "retention", "duration", "bounce"].includes(
            fullScreenItem
          ) && renderMetricFullScreen(fullScreenItem)}
        </FullscreenItem>
      )}
    </div>
  );
}
