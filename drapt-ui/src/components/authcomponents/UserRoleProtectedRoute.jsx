import { Navigate } from "react-router-dom";
import useUserStore from "../../stores/userStore";

export default function UserRoleProtectedRoute({
    roles = ["vd", "director", "developer"],
    children,
    otherwiseNavigateTo,
}) {
    const user = useUserStore((state) => state.user);

    if (!user) {
        return <Navigate to="/unauthorised" replace />;
    }

    if (roles.includes(user?.role)) {
        return children;
    } else if (user && otherwiseNavigateTo) {
        return <Navigate to={`${otherwiseNavigateTo}/${user?.team}`} replace />;
    }

    return <Navigate to="/forbidden" replace />;
}
