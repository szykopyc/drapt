import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
    // API integration later. This is all dummy.
    const loggedIn = localStorage.getItem("loggedIn") === "true";
    return loggedIn ? children : <Navigate to="/unauthorised" replace />;
}