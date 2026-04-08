import { Routes, Route, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import SOSButton from "./components/SOSButton";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import Diagnose from "./pages/Diagnose";
import History from "./pages/History";
import About from "./pages/About";
import Auth from "./pages/Auth";
import Settings from "./pages/Settings";
import Emergency from './pages/Emergency';

/**
 * Helper component to reset scroll position on every route change.
 * Essential for "1000k dollar" UX.
 */
const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
};

// --- LAYOUTS ---

/**
 * Public Layout: For landing pages, auth, and about.
 * Uses a traditional top-down scrolling flow.
 */
const PublicLayout = () => {
    return (
        <div className="flex flex-col min-h-screen relative bg-[#252A34]">
            <Navbar />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
            {/* SOS remains accessible but less intrusive on landing pages */}
            <SOSButton />
        </div>
    );
};

/**
 * App Layout: For the dashboard experience.
 * Uses a fixed sidebar and a scrollable internal content area.
 */
const AppLayout = () => {
    return (
        <div className="flex h-screen overflow-hidden bg-[#252A34] relative">
            <Sidebar />
            {/* flex-1 makes the main content take up remaining width */}
            <main className="flex-1 overflow-y-auto relative custom-scrollbar">
                <div className="min-h-full pb-20">
                    {" "}
                    {/* pb-20 prevents SOS from covering content */}
                    <Outlet />
                </div>
            </main>
            <SOSButton />
        </div>
    );
};

// --- MAIN APP ---

function App() {
    return (
        <div className="bg-[#252A34] text-[#EAEAEA] font-sans selection:bg-[#FF2E63] selection:text-white">
            <ScrollToTop />
            <Routes>
            <Route path="/emergency" element={<Emergency />} />
                {/* PUBLIC ROUTES */}
                <Route element={<PublicLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                </Route>

                <Route path="/auth" element={<Auth />} />
                {/* PRIVATE/APP ROUTES */}
                <Route
                    element={
                        <ProtectedRoute>
                            <AppLayout />
                        </ProtectedRoute>
                    }
                />

                <Route element={<AppLayout />}>
                    <Route path="/diagnose" element={<Diagnose />} />
                    <Route path="/history" element={<History />} />
                    <Route path="/settings" element={<Settings />} />
                </Route>

                {/* 404 CATCH-ALL (Optional but recommended) */}
                <Route
                    path="*"
                    element={
                        <div className="h-screen flex items-center justify-center flex-col">
                            <h1 className="text-6xl font-black text-[#08D9D6]">
                                404
                            </h1>
                            <p className="mt-4 opacity-50 uppercase tracking-widest">
                                Signal Lost in Deep Space
                            </p>
                        </div>
                    }
                />
            </Routes>
        </div>
    );
}

export default App;
