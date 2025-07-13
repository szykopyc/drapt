import { Route, Navigate } from "react-router-dom";
import UserRoleProtectedRoute from "../components/authcomponents/UserRoleProtectedRoute";
import ProtectedRoute from "../components/authcomponents/ProtectedRoute";

import UserManagementPanel from "../components/adminpanel/UserManagementPanel";
import UserEngagementPanel from "../components/adminpanel/UserEngagementPanel";
import AdminWrapper from "../pages/AdminWrapper.jsx";

export default [

  <Route
    path="admin"
    element={
      <UserRoleProtectedRoute>
        <ProtectedRoute>
          <AdminWrapper />
        </ProtectedRoute>
      </UserRoleProtectedRoute>
    }
  >,
    <Route
      index
      element={
        <Navigate to={"management"} replace />
      }
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
];
