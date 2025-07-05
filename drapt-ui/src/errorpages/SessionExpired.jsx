import { Link } from "react-router-dom";
import useUserStore from "../stores/userStore";
import { useEffect } from "react";

export default function SessionExpired() {
    const setUser = useUserStore((state) => state.setUser);
    const setSessionExpired = useUserStore((state) => state.setSessionExpired);

    useEffect(() => {
        setUser(null);
        setSessionExpired(false);
    }, []);

    return (
        <div className="flex flex-col gap-3 justify-center items-center min-h-[59vh] md:min-h-[calc(100vh-145px)] flex-grow px-4">
            <h1 className="text-7xl md:text-9xl font-extrabold text-error">
                Expired
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-center">
                Session Expired
            </h2>
            <div className="flex flex-col gap-2 text-base md:text-xl text-center max-w-xl w-full">
                <p>
                    Sorry, for security purposes your session has expired.
                    Please log back in to resume your session.
                </p>
            </div>
            <button className="btn btn-primary px-3 text-lg text-primary-content font-semibold rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <Link to="/login">Login</Link>
            </button>
        </div>
    );
}
