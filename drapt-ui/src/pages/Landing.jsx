import MainBlock from "../components/layout/MainBlock";
import { BeginText } from "../components/baseui/BeginText";
import { CardOne } from "../components/baseui/CustomCard";
import { ChartNoBorderCard } from "../components/analyseui/ChartCard";
import { dummyPerformance } from "../assets/dummy-data/chartData";
import CustomButton from "../components/baseui/CustomButton";
import CustomTable from "../components/baseui/CustomTable";
import { dummyPortfolioMetrics } from "../assets/dummy-data/tableData";
import { dummyNews } from "../assets/dummy-data/tableData";
import { CardHelper } from "../components/helperui/DivHelper";
import InnerEmptyState from "../components/errorui/InnerEmptyState";
import React, { useState, useEffect, useRef } from "react";
import useUserStore from "../stores/userStore";
import { checkAuth } from "../lib/AuthService";
import { useNavigate } from "react-router-dom";

export default function Landing() {
    const user = useUserStore((state) => state.user);
    const setUser = useUserStore((state) => state.setUser);
    const setSessionExpired = useUserStore((state) => state.setSessionExpired);
    const navigate = useNavigate();

    const dummyPerformanceToRender = dummyPerformance;

    const [loading, setLoading] = useState(false);

    const metricsRef = useRef(null);
    const [metricsHeight, setMetricsHeight] = useState(0);

    useEffect(() => {
        const authCheck = async () => {
            try {
                const response = await checkAuth();
                if (response) {
                    setUser(response);
                    setSessionExpired(false);
                }
            } catch {
                if (user) {
                    setSessionExpired(true);
                    navigate("/session-expired", { replace: true });
                } else {
                    setUser(null);
                    navigate("/unauthorised", { replace: true });
                }
            }
        };
        authCheck();
    }, []);

    try {
        var theme = localStorage.getItem("theme");
        if (theme) {
            document.documentElement.setAttribute("data-theme", theme);
        }
    } catch (e) {}

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            if (metricsRef.current) {
                setMetricsHeight(metricsRef.current.clientHeight);
            }
        }, 1000);
    }, []);

    if (!user) return null;

    return (
        <MainBlock>
            <BeginText
                title={
                    user ? `Welcome back, ${user?.fullname}` : `Welcome back`
                }
            >
                <p>
                    Get a broad sense of how your portfolio is currently
                    performing, and view any news you may have missed.
                </p>
            </BeginText>
            {!loading && (
                <>
                    <div className="divider my-0"></div>
                    {dummyPerformanceToRender.length == 0 ? (
                        <CardOne
                            id={"portfolioOverview"}
                            title={"Portfolio Overview"}
                        >
                            <InnerEmptyState
                                title="No portfolio created yet"
                                message="Create a portfolio, or add holdings to see a performance overview"
                            />
                        </CardOne>
                    ) : (
                        <CardOne
                            id={"portfolioOverview"}
                            title={
                                ["vd", "director", "developer"].includes(
                                    user?.role
                                )
                                    ? "NEFSIF Index Performance"
                                    : `${
                                          user?.team.charAt(0).toUpperCase() +
                                          user?.team.slice(1)
                                      } Portfolio Performance`
                            }
                        >
                            <ChartNoBorderCard
                                data={dummyPerformanceToRender}
                            />
                            {["vd", "director", "developer"].includes(
                                user?.role
                            ) ? (
                                <div className="flex md:flex-row justify-between gap-1 md:gap-3">
                                    <CustomButton to="/portfolio">
                                        Navigate to Fund Scope
                                    </CustomButton>
                                </div>
                            ) : (
                                <div className="flex md:flex-row justify-between gap-1 md:gap-3">
                                    <CustomButton to="/analyse">
                                        Analyse
                                    </CustomButton>
                                    <CustomButton to="/portfolio">
                                        Portfolio
                                    </CustomButton>
                                </div>
                            )}
                        </CardOne>
                    )}
                    <CardHelper>
                        <CardOne title={"Aggregate Portfolio Metrics"}>
                            <div ref={metricsRef}>
                                <CustomTable data={dummyPortfolioMetrics} />
                            </div>
                        </CardOne>
                        <CardOne title={"News Catchup"}>
                            <CustomTable
                                data={dummyNews}
                                maxHeight={
                                    metricsHeight
                                        ? `${metricsHeight}px`
                                        : "389px"
                                }
                            />
                        </CardOne>
                    </CardHelper>
                </>
            )}

            {loading && (
                <>
                    <div className="divider my-0"></div>
                    <div className="skeleton w-full h-[542px]"></div>
                    <CardHelper>
                        <div className="skeleton w-full h-[477px]"></div>
                        <div className="skeleton w-full h-[477px]"></div>
                    </CardHelper>
                </>
            )}
        </MainBlock>
    );
}
