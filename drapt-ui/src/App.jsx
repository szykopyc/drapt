import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import MasterLayout from "./components/layout/MasterLayout";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import About from "./pages/About";
import Contact from "./pages/Contact";
import MaintenanceError from "./errorpages/MaintenanceError";
import MaintenanceGuard from "./errorpages/MaintenanceGuard";
import Unauthorised from "./errorpages/401Unauthorised";
import Forbidden from "./errorpages/403Forbidden";
import NotFound from "./errorpages/404NotFound";
import InternalServerError from "./errorpages/500InternalServerError";
import ErrorBoundary from "./errorpages/ErrorBoundary";
import Login from "./pages/Login";
import LogoutHandler from "./pages/Logout";
import ForgotPassword from "./pages/ForgotPassword";
import Analyse from "./pages/AnalyseWrapper";
import AnalyseIndex from "./pages/AnalyseIndex";
import PerformancePanel from "./components/analysepanels/PerformancePanel";
import RiskPanel from "./components/analysepanels/RiskPanel";
import Portfolio from "./pages/PortfolioWrapper";
import PortfolioIndex from "./pages/PortfolioIndex";
import { OverviewPanel } from "./components/portfoliopanels/OverviewPanel";
import { TradeBookerPanel } from "./components/portfoliopanels/TradeBookerPanel";
import { PortfolioAdminPanel } from "./components/portfoliopanels/PortfolioAdminPanel";
import PositionMonitoringPanel from "./components/portfoliopanels/PositionMonitoringPanel";
import AdminWrapper from "./pages/AdminWrapper";
import UserEngagementPanel from "./components/adminpanel/UserEngagement";
import UserManagementPanel from "./components/adminpanel/UserManagementPanel";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/authcomponents/ProtectedRoute";
import ProtectedPortfolioRoute from "./components/authcomponents/PortfolioProtectedRoute";

import useUserStore from "./stores/userStore";

function App() {
    const user = useUserStore((state) => state.user);

    return (
        <ErrorBoundary>
            <>
                <Routes>
                    <Route element={<MasterLayout />}>
                        <Route path="/" element={<Index />} />
                        <Route path="about" element={<About />} />
                        <Route path="contact" element={<Contact />} />
                        <Route path="login" element={<Login />} />
                        <Route
                            path="forgot-password"
                            element={<ForgotPassword />}
                        />

                        <Route
                            path="/landing"
                            element={
                                <ProtectedRoute>
                                    <Landing />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="analyse"
                            element={
                                user ? (
                                    ["vd", "director", "dev"].includes(
                                        user?.role
                                    ) ? (
                                        <ProtectedRoute>
                                            <AnalyseIndex />
                                        </ProtectedRoute>
                                    ) : (
                                        <Navigate
                                            to={`/analyse/${user?.team}`}
                                            replace
                                        />
                                    )
                                ) : (
                                    <Navigate to="/unauthorised" replace />
                                )
                            }
                        />
                        <Route
                            path="analyse/:portfolioID"
                            element={
                                <ProtectedRoute>
                                    <ProtectedPortfolioRoute>
                                        <Analyse />
                                    </ProtectedPortfolioRoute>
                                </ProtectedRoute>
                            }
                        >
                            <Route
                                index
                                element={
                                    <Navigate to={"performance"} replace />
                                }
                            ></Route>
                            <Route
                                path="performance"
                                element={<PerformancePanel />}
                            ></Route>
                            <Route path="risk" element={<RiskPanel />}></Route>
                        </Route>
                        <Route
                            path="portfolio"
                            element={
                                user ? (
                                    ["vd", "director", "dev"].includes(
                                        user.role
                                    ) ? (
                                        <ProtectedRoute>
                                            <PortfolioIndex />
                                        </ProtectedRoute>
                                    ) : (
                                        <Navigate
                                            to={`/portfolio/${user.team}`}
                                            replace
                                        />
                                    )
                                ) : (
                                    <Navigate to="/unauthorised" replace />
                                )
                            }
                        />
                        <Route
                            path="portfolio/create"
                            element={
                                ["vd", "director", "dev"].includes(
                                    user?.role
                                ) ? (
                                    <ProtectedRoute>
                                        <MaintenanceError />
                                    </ProtectedRoute>
                                ) : (
                                    <Navigate
                                        to={`/portfolio/${user?.team}`}
                                        replace
                                    />
                                )
                            }
                        />

                        <Route
                            path="portfolio/:portfolioID"
                            element={
                                <ProtectedRoute>
                                    <ProtectedPortfolioRoute user={user}>
                                        <Portfolio />
                                    </ProtectedPortfolioRoute>
                                </ProtectedRoute>
                            }
                        >
                            <Route
                                index
                                element={<Navigate to={"overview"} replace />}
                            ></Route>
                            <Route
                                path="overview"
                                element={<OverviewPanel />}
                            ></Route>
                            <Route
                                path="monitor"
                                element={<PositionMonitoringPanel />}
                            ></Route>
                            <Route
                                path="tradebooker"
                                element={<TradeBookerPanel />}
                            ></Route>
                            <Route
                                path="administration"
                                element={<PortfolioAdminPanel />}
                            ></Route>
                        </Route>
                        <Route
                            path="admin"
                            element={
                                ["vd", "director", "dev"].includes(
                                    user?.role
                                ) ? (
                                    <ProtectedRoute>
                                        <AdminWrapper />
                                    </ProtectedRoute>
                                ) : (
                                    <Navigate to={"/forbidden"} replace />
                                )
                            }
                        >
                            <Route
                                index
                                element={<Navigate to={"management"} replace />}
                            ></Route>
                            <Route
                                path="management"
                                element={<UserManagementPanel />}
                            ></Route>
                            <Route
                                path="engagement"
                                element={<UserEngagementPanel />}
                            ></Route>
                        </Route>
                        <Route
                            path="profile"
                            element={
                                <ProtectedRoute>
                                    <Profile />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="logout" element={<LogoutHandler />} />
                        <Route path="ise" element={<InternalServerError />} />
                        <Route path="unauthorised" element={<Unauthorised />} />
                        <Route path="forbidden" element={<Forbidden />} />
                        <Route
                            path="maintenance"
                            element={<MaintenanceError />}
                        />
                        <Route path="*" element={<NotFound />} />
                    </Route>
                </Routes>
                <SpeedInsights />
                <Analytics />
            </>
        </ErrorBoundary>
    );
}

export default App;
