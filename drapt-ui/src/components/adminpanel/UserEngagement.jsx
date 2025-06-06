import { useState, useEffect } from "react";
import { AnalyseCard } from "../baseui/CustomCard";
import MetricCard from "../analyseui/MetricCard";
import { MetricHelper, CardHelper } from "../helperui/DivHelper";
import ChartCard, { DualChartCard } from "../analyseui/ChartCard";
import { LoadingSpinner } from "../helperui/LoadingSpinnerHelper";
import { dummyPerformance, dummyDualChart } from "../../assets/dummy-data/chartData";

export default function UserEngagementPanel() {
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setLoaded(true);
    }, 1000);
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <CardHelper>
        <div className="flex-col w-full">
          <AnalyseCard id={"welcome"} title={"User Engagement"}>
            <div className="h-full flex flex-col justify-center">
              <p>
                Here you can monitor how users are engaging with <span className="text-accent font-semibold">Drapt</span>. Review key statistics and visualise trends to better understand user behaviour.
              </p>
            </div>
          </AnalyseCard>
        </div>
      </CardHelper>
      {loaded && (
        <>
          <div className="divider my-0"></div>
          <ChartCard
            title="Active Users Over Time"
            data={dummyPerformance}
            size="large"
            tooltip="Shows the number of active users on the platform over time."
            currencyEnabled={false}
          />
          <MetricHelper>
            <MetricCard
              metric="Daily Active Users"
              value="128"
              valuestatus="positive"
              tooltip="Number of unique users active today."
            />
            <MetricCard
              metric="Weekly Retention"
              value="67%"
              valuestatus="neutral"
              tooltip="Percentage of users returning within a week."
            />
            <MetricCard
              metric="Avg. Session Duration"
              value="5.2 min"
              valuestatus="positive"
              tooltip="Average time a user spends per session."
            />
            <MetricCard
              metric="Bounce Rate"
              value="18%"
              valuestatus="positive"
              tooltip="Percentage of users who leave after viewing only one page. Lower is better."
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
          />
        </>
      )}
      {!loaded && loading && (
        <LoadingSpinner/>
      )}
    </div>
  );
}