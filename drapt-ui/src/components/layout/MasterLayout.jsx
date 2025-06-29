import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function MasterLayout() {
    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);
    return (
        <div className="min-h-dvh flex flex-col">
            <Navbar></Navbar>

            <main className="flex-grow h-full">
                <Outlet />
            </main>

            <Footer></Footer>
        </div>
    );
}
