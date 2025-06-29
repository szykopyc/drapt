import { useState, useEffect } from "react";
import { MetricHelper, ChartHelper } from "../helperui/DivHelper";
import MetricRenderer from "../analyseui/MetricRenderer";
import ChartRenderer from "../analyseui/ChartRenderer";
import FullscreenItem from "../helperui/FullscreenItemHelper";
import portfolioAnalyseData from "../../assets/dummy-data/portfolioAnalyseData";
import CardEmptyState from "../errorui/CardEmptyState";
import CustomButton from "../baseui/CustomButton";
import { useParams } from "react-router-dom";
import useUserStore from "../../stores/userStore";

export default function RiskPanel() {
    const { portfolioID } = useParams();

    const user = useUserStore((state) => state.user);
    if (!user) return null;

    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [fullScreenItem, setFullScreenItem] = useState(null);

    const portfolioData = portfolioAnalyseData.find(
        (data) => data.portfolioID === portfolioID
    );

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
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
                                to={`/portfolio/${portfolioID}/administration`}
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
                    ""
                )}
            </CardEmptyState>
        );
    }

    const metrics = [
        {
            key: "var95",
            metric: "VaR 95",
            value: portfolioData.portfolioVaR95,
            tooltip: "Potential loss in worst 5% of cases over a given period.",
        },
        {
            key: "var99",
            metric: "VaR 99",
            value: portfolioData.portfolioVaR99,
            tooltip: "Potential loss in worst 1% of cases over a given period.",
        },
        {
            key: "beta",
            metric: "Beta",
            value: portfolioData.portfolioBeta,
            tooltip:
                "Measures sensitivity to market movements. 1 means moves with the market.",
        },
        {
            key: "cvar95",
            metric: "CVaR 95",
            value: portfolioData.portfolioCVaR95,
            tooltip:
                "Expected loss in the worst 5% of cases. More conservative than VaR.",
        },
    ];

    const metricsToRenderFirst = metrics.slice(0, 2);
    const metricsToRenderSecond = metrics.slice(2, 4);

    const charts = [
        {
            key: "bullishChart",
            title: "Bullish Asset",
            data: portfolioData.portfolioPerformanceChart,
            tooltip:
                "This chart shows the performance of a bullish asset over time.",
        },
        {
            key: "bearishChart",
            title: "Bearish Asset",
            data: portfolioData.portfolioPerformanceChart,
            tooltip: "This chart displays a bearish asset's recent trend.",
        },
    ];

    return (
        <div className="flex flex-col gap-3">
            {loaded && (
                <>
                    <MetricHelper>
                        {metricsToRenderFirst.map((metric) => (
                            <MetricRenderer
                                key={metric.key}
                                metric={metric.metric}
                                value={metric.value}
                                tooltip={metric.tooltip}
                                onExpand={() => setFullScreenItem(metric.key)}
                            />
                        ))}
                    </MetricHelper>
                    <ChartHelper>
                        {charts.map((chart) => (
                            <ChartRenderer
                                key={chart.key}
                                title={chart.title}
                                data={chart.data}
                                tooltip={chart.tooltip}
                                onExpand={() => setFullScreenItem(chart.key)}
                            />
                        ))}
                    </ChartHelper>
                    <MetricHelper>
                        {metricsToRenderSecond.map((metric) => (
                            <MetricRenderer
                                key={metric.key}
                                metric={metric.metric}
                                value={metric.value}
                                tooltip={metric.tooltip}
                                onExpand={() => setFullScreenItem(metric.key)}
                            />
                        ))}
                    </MetricHelper>
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
                </>
            )}
            {fullScreenItem && (
                <FullscreenItem
                    reference={setFullScreenItem}
                    width={
                        ["var95", "var99", "beta", "cvar95"].includes(
                            fullScreenItem
                        )
                            ? 30
                            : 75
                    }
                >
                    {metrics
                        .filter((metric) => metric.key === fullScreenItem)
                        .map((metric) => (
                            <MetricRenderer
                                key={metric.key}
                                metric={metric.metric}
                                value={metric.value}
                                tooltip={metric.tooltip}
                            />
                        ))}
                    {charts
                        .filter((chart) => chart.key === fullScreenItem)
                        .map((chart) => (
                            <ChartRenderer
                                key={chart.key}
                                title={chart.title}
                                data={chart.data}
                                tooltip={chart.tooltip}
                            />
                        ))}
                </FullscreenItem>
            )}
        </div>
    );
}
