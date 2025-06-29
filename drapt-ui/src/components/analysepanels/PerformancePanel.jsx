import { useState, useEffect } from "react";
import MetricRenderer from "../analyseui/MetricRenderer";
import ChartRenderer from "../analyseui/ChartRenderer";
import { MetricHelper } from "../helperui/DivHelper";
import ChartCard, { DualChartCard } from "../analyseui/ChartCard";
import CustomButton from "../baseui/CustomButton";
import CardEmptyState from "../errorui/CardEmptyState";
import portfolioAnalyseData from "../../assets/dummy-data/portfolioAnalyseData";
import FullscreenItem from "../helperui/FullscreenItemHelper";
import useUserStore from "../../stores/userStore";
import { useParams } from "react-router-dom";

export default function PerformancePanel() {
    const portfolioIDfromParams = useParams().portfolioID;

    const portfolioFromState = useUserStore(
        (state) => state.currentPortfolioBeingAnalysed
    );

    const user = useUserStore((state) => state.user);

    if (!user) return null;

    if (!portfolioFromState) return null;

    const portfolio = portfolioFromState;

    const [loaded, setLoaded] = useState(false);
    const [fullScreenItem, setFullScreenItem] = useState(null);

    const portfolioData = portfolioAnalyseData.find(
        (data) => data.portfolioID === portfolioIDfromParams
    );

    useEffect(() => {
        setTimeout(() => {
            setLoaded(true);
        }, 1000);
    }, []);

    if (!portfolioData) {
        return (
            <CardEmptyState
                title="No portfolio to analyse..."
                message={"We aren't sure if the portfolio you selected exists."}
            >
                {["vd", "director", "developer"].includes(user?.role) ? (
                    <>
                        <p className="mb-1">Please configure this portfolio.</p>
                        <div className="w-1/2">
                            <CustomButton
                                to={`/portfolio/${portfolioIDfromParams}/administration`}
                            >
                                Configure Portfolio
                            </CustomButton>
                        </div>
                    </>
                ) : ["pm"].includes(user?.role) ? (
                    <p>
                        Please contact the Executive team to configure your
                        portfolio.
                    </p>
                ) : (
                    <p>
                        Please contact your Portfolio Manager if you have any
                        questions. They will direct you to the right person if
                        they don't know themselves.
                    </p>
                )}
            </CardEmptyState>
        );
    }

    const metrics = [
        {
            key: "sharpe",
            metric: "Sharpe",
            value: portfolioData.portfolioSharpeMetric,
            tooltip: "Measures return per unit of risk. Higher is better.",
            valuestatus:
                portfolioData.portfolioSharpeMetric > 1
                    ? "positive"
                    : "negative",
        },
        {
            key: "sortino",
            metric: "Sortino",
            value: portfolioData.portfolioSortinoMetric,
            tooltip:
                "Like Sharpe, but only penalises downside volatility. Higher is better.",
            valuestatus:
                portfolioData.portfolioSortinoMetric > 1
                    ? "positive"
                    : "negative",
        },
        {
            key: "treynor",
            metric: "Treynor",
            value: portfolioData.portfolioTreynorMetric,
            tooltip:
                "Measures return per unit of market risk (beta). Higher is better.",
            valuestatus:
                portfolioData.portfolioTreynorMetric > 0.2
                    ? "positive"
                    : "negative",
        },
    ];

    return (
        <div className="flex flex-col gap-3">
            {portfolio ? (
                loaded ? (
                    <>
                        <ChartCard
                            title="Performance Chart"
                            data={portfolioData.portfolioPerformanceChart}
                            size="large"
                            tooltip="This chart visualises your portfolio's performance over time."
                            expandButton={true}
                            onExpand={() =>
                                setFullScreenItem("performanceChart")
                            }
                        />
                        <MetricHelper>
                            {metrics.map((metric) => (
                                <MetricRenderer
                                    key={metric.key}
                                    metric={metric.metric}
                                    value={metric.value}
                                    tooltip={metric.tooltip}
                                    valuestatus={metric.valuestatus}
                                    onExpand={() =>
                                        setFullScreenItem(metric.key)
                                    }
                                />
                            ))}
                        </MetricHelper>
                        <DualChartCard
                            title="Portfolio vs Benchmark"
                            data={portfolioData.portfolioBenchmarkComparison}
                            dataKey1="value"
                            dataKey2="value2"
                            label1="Portfolio"
                            label2="Benchmark"
                            size="large"
                            tooltip="Compare your portfolio's returns to a benchmark index."
                            expandButton={true}
                            onExpand={() =>
                                setFullScreenItem(
                                    "portfolioBenchmarkComparison"
                                )
                            }
                        />
                    </>
                ) : (
                    <>
                        <div className="skeleton w-full h-[384px]"></div>
                        <MetricHelper>
                            <div className="skeleton flex-1 h-[150px]"></div>
                            <div className="skeleton flex-1 h-[150px]"></div>
                            <div className="skeleton flex-1 h-[150px]"></div>
                        </MetricHelper>
                        <div className="skeleton w-full h-[384px]"></div>
                    </>
                )
            ) : null}
            {fullScreenItem && (
                <FullscreenItem
                    reference={setFullScreenItem}
                    width={
                        ["sharpe", "sortino", "treynor"].includes(
                            fullScreenItem
                        )
                            ? 30
                            : 75
                    }
                >
                    {fullScreenItem === "performanceChart" && (
                        <ChartCard
                            title="Performance Chart"
                            data={portfolioData.portfolioPerformanceChart}
                            size="xlarge"
                            isExpanded={true}
                            tooltip="This chart visualises your portfolio's performance over time."
                        />
                    )}
                    {fullScreenItem === "portfolioBenchmarkComparison" && (
                        <DualChartCard
                            title="Portfolio vs Benchmark"
                            data={portfolioData.portfolioBenchmarkComparison}
                            dataKey1="value"
                            dataKey2="value2"
                            label1="Portfolio"
                            label2="Benchmark"
                            size="xlarge"
                            isExpanded={true}
                            tooltip="Compare your portfolio's returns to a benchmark index."
                        />
                    )}
                    {metrics
                        .filter((metric) => metric.key === fullScreenItem)
                        .map((metric) => (
                            <MetricRenderer
                                key={metric.key}
                                metric={metric.metric}
                                value={metric.value}
                                tooltip={metric.tooltip}
                                valuestatus={metric.valuestatus}
                                isExpanded={true}
                            />
                        ))}
                </FullscreenItem>
            )}
        </div>
    );
}
