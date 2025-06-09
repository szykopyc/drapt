import { CardNoTitle } from "../baseui/CustomCard";
import { Link, useNavigate } from 'react-router-dom';

export default function LogoutCard(){
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.setItem('loggedIn', false);
        window.dispatchEvent(new Event('loggedInChange'));
        navigate("/");
    };

    return (
        <CardNoTitle id="logoutCard">
            <button
                className="btn btn-error"
                onClick={handleLogout}
            >
                Log out
            </button>
        </CardNoTitle>
    );
}