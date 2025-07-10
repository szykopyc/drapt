import { Route, Navigate } from "react-router-dom";
import UserRoleProtectedRoute from "../components/authcomponents/UserRoleProtectedRoute";
import ProtectedPortfolioRoute from "../components/authcomponents/PortfolioProtectedRoute";
import ProtectedRoute from "../components/authcomponents/ProtectedRoute";

import Portfolio from "../pages/PortfolioWrapper";
import PortfolioIndex from "../pages/PortfolioIndex";
import CreatePortfolioPanel from "../components/portfoliopanels/CreatePortfolioPanel";
import { OverviewPanel } from "../components/portfoliopanels/OverviewPanel";
import PositionMonitoringPanel from "../components/portfoliopanels/PositionMonitoringPanel";
import { TradeBookerPanel } from "../components/portfoliopanels/TradeBookerPanel";
import { PortfolioAdminPanel } from "../components/portfoliopanels/PortfolioAdminPanel";

export default [

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
  />,
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
  />,
  <Route
    path="portfolio/:portfolioID"
    element={
      <ProtectedRoute>
        <ProtectedPortfolioRoute>
          <Portfolio />
        </ProtectedPortfolioRoute>
      </ProtectedRoute>
    }
  >,
    <Route
      index
      element={
        <Navigate to={"overview"} replace />
      }
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
          allowedRoles={[
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
          allowedRoles={[
            "vd",
            "director",
            "developer",
            "pm"
          ]}
        >
          <PortfolioAdminPanel />
        </UserRoleProtectedRoute>
      }
    ></Route>
  </Route>
];
