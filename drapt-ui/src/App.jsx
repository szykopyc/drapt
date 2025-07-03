import { Routes, Route, Navigate } from "react-router-dom";
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
import PerformancePanel from "./components/analysepanels/PerformancePanel";
import RiskPanel from "./components/analysepanels/RiskPanel";
import Portfolio from "./pages/PortfolioWrapper";
import PortfolioIndex from "./pages/PortfolioIndex";
import { OverviewPanel } from "./components/portfoliopanels/OverviewPanel";
import { TradeBookerPanel } from "./components/portfoliopanels/TradeBookerPanel";
import { PortfolioAdminPanel } from "./components/portfoliopanels/PortfolioAdminPanel";
import CreatePortfolioPanel from "./components/portfoliopanels/CreatePortfolioPanel";
import PositionMonitoringPanel from "./components/portfoliopanels/PositionMonitoringPanel";
import AdminWrapper from "./pages/AdminWrapper";
import UserEngagementPanel from "./components/adminpanel/UserEngagement";
import UserManagementPanel from "./components/adminpanel/UserManagementPanel";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/authcomponents/ProtectedRoute";
import ProtectedPortfolioRoute from "./components/authcomponents/PortfolioProtectedRoute";
import UserRoleProtectedRoute from "./components/authcomponents/UserRoleProtectedRoute";
import { useEffect } from "react";

import useUserStore from "./stores/userStore";
import { checkAuth } from "./services/AuthService";

function App() {
    const user = useUserStore((state) => state.user);
    const setUser = useUserStore((state) => state.setUser);

    useEffect(() => {
        if (!user) {
            checkAuth().then((userData) => {
                if (userData) setUser(userData);
            });
        }
    }, [user, setUser]);

    return (
        <ErrorBoundary>
            <>
                <Routes>
                    <Route element={<MasterLayout />}>
                        {user ? (
                            <Route
                                path="/"
                                element={
                                    <ProtectedRoute>
                                        <Landing />
                                    </ProtectedRoute>
                                }
                            />
                        ) : (
                            <Route path="/" element={<Index />} />
                        )}
                        <Route path="about" element={<About />} />
                        <Route path="contact" element={<Contact />} />
                        <Route path="login" element={<Login />} />
                        <Route
                            path="forgot-password"
                            element={<ForgotPassword />}
                        />
                        <Route
                            path="analyse"
                            element={
                                <UserRoleProtectedRoute
                                    otherwiseNavigateTo={"/analyse"}
                                >
                                    <Navigate to="/portfolio" replace />
                                </UserRoleProtectedRoute>
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
                                <UserRoleProtectedRoute
                                    otherwiseNavigateTo={"/portfolio"}
                                >
                                    <ProtectedRoute>
                                        <PortfolioIndex />
                                    </ProtectedRoute>
                                </UserRoleProtectedRoute>
                            }
                        />
                        <Route
                            path="portfolio/create"
                            element={
                                <UserRoleProtectedRoute
                                    otherwiseNavigateTo={"/portfolio"}
                                >
                                    <ProtectedRoute>
                                        <CreatePortfolioPanel />
                                    </ProtectedRoute>
                                </UserRoleProtectedRoute>
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
                                element={
                                    <UserRoleProtectedRoute
                                        roles={[
                                            "vd",
                                            "director",
                                            "developer",
                                            "pm",
                                        ]}
                                    >
                                        <TradeBookerPanel />
                                    </UserRoleProtectedRoute>
                                }
                            ></Route>
                            <Route
                                path="administration"
                                element={
                                    <UserRoleProtectedRoute
                                        roles={["vd", "director", "developer"]}
                                    >
                                        <PortfolioAdminPanel />
                                    </UserRoleProtectedRoute>
                                }
                            ></Route>
                        </Route>
                        <Route
                            path="admin"
                            element={
                                <UserRoleProtectedRoute>
                                    <ProtectedRoute>
                                        <AdminWrapper />
                                    </ProtectedRoute>
                                </UserRoleProtectedRoute>
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
