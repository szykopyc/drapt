import { useState, useEffect, useRef } from "react";
import useUserStore from "../../stores/userStore";
import { Link } from "react-router-dom";

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    const user = useUserStore((state) => state.user);
    const loggedIn = !!user;

    const navRefs = useRef([]);
    const showAdmin = user && ["dev", "vd", "director"].includes(user?.role);

    {
        /* 

    useEffect(() => {
        const handleStorage = () => {
            setLoggedIn(localStorage.getItem("loggedIn") === "true");
        };
        window.addEventListener("storage", handleStorage);
        window.addEventListener("loggedInChange", handleStorage);
        return () => {
            window.removeEventListener("storage", handleStorage);
            window.removeEventListener("loggedInChange", handleStorage);
        };
    }, []);
    */
    }

    // Arrow key navigation for desktop nav links
    const navLinks = [
        { to: "/analyse", label: "Analyse" },
        { to: "/portfolio", label: "Portfolio" },
        ...(showAdmin ? [{ to: "/admin", label: "Admin" }] : []),
        { to: "/profile", label: "Profile" },
    ];

    const handleNavKeyDown = (e, idx) => {
        if (window.innerWidth < 768) return;
        if (e.key === "ArrowRight") {
            const nextIdx = (idx + 1) % navLinks.length;
            navRefs.current[nextIdx]?.focus();
            e.preventDefault();
        } else if (e.key === "ArrowLeft") {
            const prevIdx = (idx - 1 + navLinks.length) % navLinks.length;
            navRefs.current[prevIdx]?.focus();
            e.preventDefault();
        }
    };

    return (
        <header className="flex justify-between bg-base-200 text-base-content p-6 text-4xl font-bold border-b border-base-300 items-center relative">
            {!loggedIn && (
                <Link
                    tabIndex={0}
                    className="text-accent"
                    onClick={() => setMenuOpen(false)}
                    to="/"
                >
                    Drapt
                </Link>
            )}
            {loggedIn && (
                <>
                    <Link
                        tabIndex={0}
                        className="text-accent"
                        onClick={() => setMenuOpen(false)}
                        to="/landing"
                    >
                        Drapt
                    </Link>
                    {/* Desktop nav */}
                    <div className="hidden md:flex flex-row justify-between items-center gap-3 text-base font-normal">
                        {navLinks.map((nav, idx) => (
                            <Link
                                key={nav.to}
                                to={nav.to}
                                tabIndex={0}
                                ref={(el) => (navRefs.current[idx] = el)}
                                className="hover:underline"
                                onClick={() => setMenuOpen(false)}
                                onKeyDown={(e) => handleNavKeyDown(e, idx)}
                            >
                                {nav.label}
                            </Link>
                        ))}
                    </div>
                    {/* Mobile menu toggle */}
                    <button
                        className="md:hidden text-2xl"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle menu"
                    >
                        ☰
                    </button>
                    {/* Mobile menu */}
                    {menuOpen && (
                        <div className="flex flex-col items-end text-right gap-2 absolute top-full left-0 w-full bg-base-200 px-4 pb-4 pt-0 z-20 md:hidden text-base font-normal border-b border-base-300">
                            <Link
                                to="/analyse"
                                className="underline"
                                onClick={() => setMenuOpen(false)}
                            >
                                Analyse
                            </Link>
                            <Link
                                to="/portfolio"
                                className="underline"
                                onClick={() => setMenuOpen(false)}
                            >
                                Portfolio
                            </Link>
                            {showAdmin && (
                                <Link
                                    to="/admin"
                                    className="underline"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Admin
                                </Link>
                            )}
                            <Link
                                to="/profile"
                                className="underline"
                                onClick={() => setMenuOpen(false)}
                            >
                                Profile
                            </Link>
                        </div>
                    )}
                </>
            )}
        </header>
    );
}
