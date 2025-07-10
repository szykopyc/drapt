import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import MasterLayout from "./components/layout/MasterLayout";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import MaintenanceError from "./errorpages/MaintenanceError";
import MaintenanceGuard from "./errorpages/MaintenanceGuard";
import Unauthorised from "./errorpages/401Unauthorised";
import Forbidden from "./errorpages/403Forbidden";
import NotFound from "./errorpages/404NotFound";
import InternalServerError from "./errorpages/500InternalServerError";
import ErrorBoundary from "./errorpages/ErrorBoundary";
import SessionExpired from "./errorpages/SessionExpired";
import LogoutHandler from "./pages/Logout";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/authcomponents/ProtectedRoute";
import { useEffect } from "react";
import useUserStore from "./stores/userStore";
import { checkAuth } from "./lib/AuthService";

import { AnimatePresence } from "framer-motion";

import UnprotectedRoutes from "./routes/UnprotectedRoutes";
import AnalyseRoutes from "./routes/AnalyseRoutes";
import PortfolioRoutes from "./routes/PortfolioRoutes";
import AdminRoutes from "./routes/AdminRoutes";

// List of protected route prefixes
const protectedRoutes = ["/analyse", "/portfolio", "/admin", "/profile"];

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const setSessionExpired = useUserStore((state) => state.setSessionExpired);

  const topLevelKey = location.pathname.split("/")[1];

  useEffect(() => {
    // Only check auth if the current path is protected
    const isProtected = protectedRoutes.some((route) =>
      location.pathname.startsWith(route)
    );
    if (!isProtected) return;

    const check = async () => {
      try {
        const response = await checkAuth();
        if (response) {
          setUser(response);
          setSessionExpired(false);
        } else {
          setUser(null);
          navigate("/unauthorised", { replace: true });
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
    check();
    // eslint-disable-next-line
  }, [location.pathname]);

  return (
    <ErrorBoundary>
      <>
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={topLevelKey}>
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
              {UnprotectedRoutes}
              {AnalyseRoutes}
              {PortfolioRoutes}
              {AdminRoutes}
              <Route
                path="profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route path="logout" element={<LogoutHandler />} />
              <Route
                path="ise"
                element={<InternalServerError />}
              />
              <Route
                path="unauthorised"
                element={<Unauthorised />}
              />
              <Route path="forbidden" element={<Forbidden />} />
              <Route
                path="maintenance"
                element={<MaintenanceError />}
              />
              <Route
                path="session-expired"
                element={<SessionExpired />}
              />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </AnimatePresence>
        <SpeedInsights />
        <Analytics />
      </>
    </ErrorBoundary>
  );
}

export default App;
