

import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Mail, Lock, User, ArrowRight } from "lucide-react";
import Logo from "../components/Logo";

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    if (token) {
        return <Navigate to="/diagnose" />;
    }
    useEffect(() => {
        /* global google */
        if (window.google) {
            google.accounts.id.initialize({
                client_id:
                    "901835681815-ggidtcgov7l9lfao918c5g9ivqoif4e5.apps.googleusercontent.com",
                callback: handleGoogleResponse,
            });
        }
    }, []);
    const handleGoogleResponse = (response) => {
        localStorage.setItem("user_token", response.credential);
        navigate("/diagnose");
    };

    // Custom function to trigger the Google Pop-up
    const triggerGoogleAuth = () => {
        google.accounts.id.prompt(); // Shows the "One Tap" UI
        // Or for the standard popup:
        const client = google.accounts.oauth2.initTokenClient({
            client_id:
                "901835681815-ggidtcgov7l9lfao918c5g9ivqoif4e5.apps.googleusercontent.com",
            scope: "email profile",
            callback: (tokenResponse) => {
                if (tokenResponse && tokenResponse.access_token) {
                    localStorage.setItem(
                        "user_token",
                        tokenResponse.access_token
                    );
                    navigate("/diagnose");
                }
            },
        });
        client.requestAccessToken();
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-6 bg-[#252A34] relative overflow-hidden">
            {/* Background Decorative Blurs */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#08D9D6]/10 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#FF2E63]/5 blur-[120px] rounded-full"></div>

            <div className="w-full max-w-md z-10">
                <div className="flex justify-center mb-10">
                    <Logo size="lg" />
                </div>

                <div className="bg-[#1A1D24]/80 border border-[#EAEAEA]/10 p-8 rounded-3xl backdrop-blur-xl shadow-2xl relative overflow-hidden">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-black text-[#EAEAEA]">
                            Welcome to Move{" "}
                            <span className="text-[#08D9D6]">to</span> Heal
                        </h2>
                        <p className="text-[#EAEAEA]/40 text-xs mt-2 uppercase tracking-widest font-bold">
                            Secure Medical Environment
                        </p>
                    </div>

                    {/* --- THE CUSTOM GOOGLE BUTTON --- */}
                    <button
                        onClick={triggerGoogleAuth}
                        className="group relative w-full flex items-center justify-center gap-3 py-4 bg-white rounded-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] active:scale-95 overflow-hidden"
                    >
                        {/* Animated background gradient shine */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none"></div>

                        <svg width="16" height="16" viewBox="0 0 24 24">
                            <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>

                        <span className="text-[#252A34] font-black text-sm uppercase tracking-wider z-10">
                            Continue with Google
                        </span>
                    </button>

                    {/* OR SEPARATOR */}
                    <div className="flex items-center gap-4 my-8">
                        <div className="h-[1px] bg-[#EAEAEA]/10 flex-1"></div>
                        <span className="text-[#EAEAEA]/30 text-[10px] font-black uppercase tracking-widest">
                            or use email
                        </span>
                        <div className="h-[1px] bg-[#EAEAEA]/10 flex-1"></div>
                    </div>

                    {/* Tab Selector */}
                    <div className="flex mb-6 bg-[#252A34] p-1 rounded-xl border border-[#EAEAEA]/5">
                        <button
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition-all ${
                                isLogin
                                    ? "bg-[#08D9D6] text-[#252A34]"
                                    : "text-[#EAEAEA]/40 hover:text-[#EAEAEA]"
                            }`}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition-all ${
                                !isLogin
                                    ? "bg-[#08D9D6] text-[#252A34]"
                                    : "text-[#EAEAEA]/40 hover:text-[#EAEAEA]"
                            }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    {/* Email Form */}
                    <form
                        className="space-y-4"
                        onSubmit={(e) => e.preventDefault()}
                    >
                        {!isLogin && (
                            <div className="relative group">
                                <User
                                    className="absolute left-4 top-4 text-[#EAEAEA]/30 group-focus-within:text-[#08D9D6] transition-colors"
                                    size={18}
                                />
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    className="w-full bg-[#252A34] border border-[#EAEAEA]/10 rounded-xl py-3.5 pl-12 pr-4 text-[#EAEAEA] focus:border-[#08D9D6] outline-none transition-all shadow-inner"
                                />
                            </div>
                        )}
                        <div className="relative group">
                            <Mail
                                className="absolute left-4 top-4 text-[#EAEAEA]/30 group-focus-within:text-[#08D9D6] transition-colors"
                                size={18}
                            />
                            <input
                                type="email"
                                placeholder="Email Address"
                                className="w-full bg-[#252A34] border border-[#EAEAEA]/10 rounded-xl py-3.5 pl-12 pr-4 text-[#EAEAEA] focus:border-[#08D9D6] outline-none transition-all shadow-inner"
                            />
                        </div>
                        <div className="relative group">
                            <Lock
                                className="absolute left-4 top-4 text-[#EAEAEA]/30 group-focus-within:text-[#08D9D6] transition-colors"
                                size={18}
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                className="w-full bg-[#252A34] border border-[#EAEAEA]/10 rounded-xl py-3.5 pl-12 pr-4 text-[#EAEAEA] focus:border-[#08D9D6] outline-none transition-all shadow-inner"
                            />
                        </div>

                        <button className="w-full py-4 bg-[#08D9D6] text-[#252A34] font-black uppercase tracking-widest rounded-xl hover:shadow-[0_0_25px_rgba(8,217,214,0.4)] transition-all flex items-center justify-center gap-2 mt-2">
                            {isLogin
                                ? "Initialize Session"
                                : "Create Credentials"}
                            <ArrowRight size={18} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Auth;
