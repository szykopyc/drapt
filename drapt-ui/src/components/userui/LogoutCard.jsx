import { useNavigate } from "react-router-dom";
import { CardNoTitle } from "../baseui/CustomCard";

export default function LogoutCard() {
    const navigate = useNavigate();
    return (
        <CardNoTitle id="logoutCard">
            <button
                className="btn btn-error"
                onClick={() => navigate("/logout")}
            >
                Log out
            </button>
        </CardNoTitle>
    );
}
