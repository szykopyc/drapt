import { Navigate, useParams } from "react-router-dom";
import useUserStore from "../../stores/userStore";

export default function ProtectedPortfolioRoute({ children }) {
    const user = useUserStore((state) => state.user);
    const { portfolioID } = useParams();

    if (!user) {
        return <Navigate to="/unauthorised" replace />;
    }

    if (["vd", "director", "dev"].includes(user.role)) {
        return children;
    }

    if (
        Array.isArray(user.team)
            ? user.team.includes(portfolioID)
            : user.team === portfolioID
    ) {
        return children;
    }

    return <Navigate to="/forbidden" replace />;
}
