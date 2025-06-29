import { useNavigate } from "react-router-dom";

export default function LogoutCard() {
    const navigate = useNavigate();
    return (
        <div className="w-full">
            <button
                className="btn btn-error w-full"
                onClick={() => navigate("/logout")}
                style={{ borderRadius: "var(--border-radius)" }}
            >
                Log out
            </button>
        </div>
    );
}
