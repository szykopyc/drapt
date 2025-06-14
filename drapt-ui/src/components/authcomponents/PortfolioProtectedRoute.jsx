import { Navigate, useParams } from "react-router-dom";

export default function ProtectedPortfolioRoute({user, children}){
    const {portfolioID} = useParams();

    if (user.role == "vd" || user.role == "director" || user.role =="dev"){
        return children;
    } else {
        if (user.team.includes(portfolioID)){
            return children;
        } else {
            return <Navigate to="/forbidden"/>;
        }
    }
}