import ProtectedRoute from "../components/authcomponents/ProtectedRoute";
import ProtectedPortfolioRoute from "../components/authcomponents/PortfolioProtectedRoute";
import Analyse from "../pages/AnalyseWrapper";
import UserRoleProtectedRoute from "../components/authcomponents/UserRoleProtectedRoute";
import { Route, Navigate } from "react-router-dom";
import PerformancePanel from "../components/analysepanels/PerformancePanel";
import RiskPanel from "../components/analysepanels/RiskPanel";

export default [
  <Route
    path="analyse"
    element={
      <UserRoleProtectedRoute
        otherwiseNavigateTo={"/analyse"}
      >
        <Navigate to="/portfolio" replace />
      </UserRoleProtectedRoute>
    }
  />,
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
    <Route
      path="risk"
      element={<RiskPanel />}
    ></Route>
  </Route>,
]
