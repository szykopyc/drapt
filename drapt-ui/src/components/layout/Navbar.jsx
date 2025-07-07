import { useState, useRef, useMemo } from "react";
import useUserStore from "../../stores/userStore";
import { Link } from "react-router-dom";

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    const user = useUserStore((state) => state.user);
    const loggedIn = !!user;

    const navRefs = useRef([]);
    const showAdmin =
        user && ["developer", "vd", "director"].includes(user?.role);

    const navLinks = useMemo(() => {
        return [
            ...(!showAdmin ? [{ to: "/analyse", label: "Analyse" }] : []),
            ...(!showAdmin
                ? [{ to: "/portfolio", label: "Portfolio" }]
                : [{ to: "/portfolio", label: "Fund Scope" }]),
            ...(showAdmin ? [{ to: "/admin", label: "Administration" }] : []),
            { to: "/profile", label: "Profile" },
        ];
    }, [showAdmin]);

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

    const handleMenuToggle = () => {
        setMenuOpen((prev) => !prev);
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
                    drapt
                </Link>
            )}
            {loggedIn && (
                <>
                    <Link
                        tabIndex={0}
                        className="text-accent"
                        onClick={() => setMenuOpen(false)}
                        to="/"
                    >
                        drapt
                    </Link>
                    {/* Desktop nav */}
                    <div className="hidden md:flex flex-row justify-between items-center gap-3 text-base font-normal">
                        {navLinks.map((nav, idx) => (
                            <Link
                                key={nav.to}
                                to={nav.to}
                                tabIndex={0}
                                ref={(el) => (navRefs.current[idx] = el)}
                                className="hover:underline font-medium"
                                onClick={() => setMenuOpen(false)}
                                onKeyDown={(e) => handleNavKeyDown(e, idx)}
                            >
                                {nav.label}
                            </Link>
                        ))}
                    </div>
                    <button
                        className="md:hidden text-2xl"
                        onClick={handleMenuToggle}
                        aria-label="Toggle menu"
                    >
                        ☰
                    </button>
                    {/* Mobile menu */}
                    {menuOpen && (
                        <div className="flex flex-col items-end text-right gap-2 absolute top-full left-0 w-full bg-base-200 px-4 pb-4 pt-0 z-20 md:hidden text-base font-normal border-b border-base-300 animate-[mobileMenuOpen_0.1s_ease-in_forwards]">
                            {navLinks.map((nav, idx) => (
                                <Link
                                    key={nav.to}
                                    to={nav.to}
                                    className="underline font-medium"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    {nav.label}
                                </Link>
                            ))}
                        </div>
                    )}
                </>
            )}
        </header>
    );
}
