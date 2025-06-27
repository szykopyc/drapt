import { Navigate } from "react-router-dom";
import useUserStore from "../../stores/userStore";

export default function ProtectedRoute({ children }) {
    const user = useUserStore((state) => state.user);
    return user ? children : <Navigate to="/unauthorised" replace />;
}
