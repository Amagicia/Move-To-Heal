import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import FeatureCard from "../components/FeatureCard";
import StatBadge from "../components/StatBadge";
import ThreeDStats from "../components/ThreeDStats";
import {
    Eye,
    Dna,
    MessageSquareText,
    Camera,
    Zap,
    ClipboardList,
    AlertTriangle,
    Activity,
    ShieldCheck,
} from "lucide-react";
import MedicalHelix from "../components/MedicalHelix";
const Home = () => {
    const { t } = useTranslation();
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const dynamicWords = t('hero.dynamicWords', { returnObjects: true });

    const [wordIndex, setWordIndex] = useState(0);
    const [fadeProp, setFadeProp] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setFadeProp(false);

            setTimeout(() => {
                setWordIndex((prev) => (prev + 1) % dynamicWords.length);
                setFadeProp(true);
            }, 300);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });

    return (
        <div
            className="relative overflow-hidden w-full bg-[#252A34]"
            onMouseMove={handleMouseMove}
        >
            {/* Interactive Cursor Background */}
            <div
                className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300 h-full w-full "
                style={{
                    background: `
            radial-gradient(700px circle at ${mousePos.x}px ${
                        mousePos.y
                    }px, rgba(8, 217, 214, 0.06), transparent 50%),
            radial-gradient(500px circle at ${mousePos.x + 150}px ${
                        mousePos.y + 150
                    }px, rgba(255, 46, 99, 0.03), transparent 60%)
          `,
                }}
            />

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 flex flex-col items-center">
                {/* --- HERO SECTION --- */}
          

                <section className="relative w-full min-h-[80vh] flex flex-col md:flex-row items-center justify-between gap-12 mb-20 px-6 md:px-12">
                    {/* LEFT CONTENT */}
                    <div className="md:w-3/5 text-left z-20">
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-[#08D9D6]/30 bg-[#08D9D6]/10 text-[#08D9D6] text-xs font-bold tracking-widest uppercase mb-8">
                            <span className="w-2 h-2 rounded-full bg-[#FF2E63] animate-ping"></span>
                            {t('hero.badge')}
                        </div>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-[#EAEAEA] mb-6 tracking-tighter leading-none">
                            {t('hero.heading1')} <br />
                            <span className="text-[#EAEAEA]/80">
                                {t('hero.heading2')}{" "}
                            </span>
                            <span
                                className={`inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#08D9D6] to-[#00FFF0] transition-all duration-500 ${
                                    fadeProp
                                        ? "opacity-100 translate-x-0"
                                        : "opacity-0 -translate-x-4"
                                }`}
                            >
                                {dynamicWords[wordIndex]}
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-[#EAEAEA]/70 mb-10 max-w-xl leading-relaxed">
                            {t('hero.subtitle')}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-5">
                            <Link
                                to="/diagnose"
                                className="px-8 py-4 bg-[#08D9D6] text-[#252A34] font-black rounded-xl hover:scale-105 transition-all shadow-[0_0_30px_rgba(8,217,214,0.4)] text-center uppercase tracking-widest"
                            >
                                {t('hero.ctaScan')}
                            </Link>

                            <Link
                                to="/about"
                                className="px-8 py-4 border-2 border-[#EAEAEA]/20 text-[#EAEAEA] font-bold rounded-xl hover:border-[#FF2E63] hover:text-[#FF2E63] transition-all text-center uppercase tracking-widest"
                            >
                                {t('hero.ctaTech')}
                            </Link>
                        </div>
                    </div>

                    {/* RIGHT SIDE - SPLINE */}
                    <div className="md:w-2/5 w-full h-[400px] md:h-[500px] lg:h-[600px] relative flex items-center justify-center">
                        {/* Glow effect */}
                        <div className="absolute w-80 h-80 bg-[#08D9D6]/20 blur-3xl rounded-full"></div>

                        {/* Spline Model */}
                        <div className="relative w-full h-full">
                            <MedicalHelix />
                        </div>
                    </div>
                </section>
                {/* --- STATS SECTION --- */}
                <ThreeDStats />

                {/* --- THE HEALING PIPELINE (Feature Flow) --- */}
                <section className="w-full max-w-7xl mb-32 border-t border-[#EAEAEA]/10 pt-24 pb-16 px-6 relative">
                    <div className="text-center mb-20">
                        <h2 className="text-[#08D9D6] text-sm font-bold uppercase tracking-widest mb-3">
                            {t('flow.label')}
                        </h2>
                        <h3 className="text-4xl md:text-5xl font-black text-[#EAEAEA] tracking-tight">
                            {t('flow.heading')}
                        </h3>
                        <p className="text-lg text-[#EAEAEA]/70 mt-5 max-w-2xl mx-auto">
                            {t('flow.subtitle')}
                        </p>
                    </div>

                    {/* Connected Grid Flow */}
                    <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Connecting Line (Desktop Only) */}
                        <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-[#08D9D6]/30 to-transparent z-0"></div>

                        {/* Step 1 */}
                        <div className="relative z-10 flex flex-col items-center text-center group">
                            <div className="w-24 h-24 rounded-2xl bg-[#252A34] border border-[#08D9D6]/30 flex items-center justify-center text-[#08D9D6] mb-6 shadow-[0_0_20px_rgba(8,217,214,0.1)] group-hover:scale-110 group-hover:border-[#08D9D6] group-hover:shadow-[0_0_30px_rgba(8,217,214,0.3)] transition-all duration-300 transform rotate-3 group-hover:rotate-0">
                                <MessageSquareText size={40} />
                            </div>
                            <h4 className="text-xl font-bold text-[#EAEAEA] mb-3">
                                {t('flow.step1Title')}
                            </h4>
                            <p className="text-[#EAEAEA]/60 text-sm leading-relaxed px-2">
                                {t('flow.step1Desc')}
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="relative z-10 flex flex-col items-center text-center group mt-8 md:mt-0">
                            <div className="w-24 h-24 rounded-2xl bg-[#252A34] border border-[#08D9D6]/30 flex items-center justify-center text-[#08D9D6] mb-6 shadow-[0_0_20px_rgba(8,217,214,0.1)] group-hover:scale-110 group-hover:border-[#08D9D6] group-hover:shadow-[0_0_30px_rgba(8,217,214,0.3)] transition-all duration-300 transform -rotate-3 group-hover:rotate-0">
                                <Camera size={40} />
                            </div>
                            <h4 className="text-xl font-bold text-[#EAEAEA] mb-3">
                                {t('flow.step2Title')}
                            </h4>
                            <p className="text-[#EAEAEA]/60 text-sm leading-relaxed px-2">
                                {t('flow.step2Desc')}
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="relative z-10 flex flex-col items-center text-center group mt-8 md:mt-0">
                            <div className="w-24 h-24 rounded-2xl bg-[#252A34] border border-[#FF2E63]/40 flex items-center justify-center text-[#FF2E63] mb-6 shadow-[0_0_20px_rgba(255,46,99,0.15)] group-hover:scale-110 group-hover:border-[#FF2E63] group-hover:shadow-[0_0_30px_rgba(255,46,99,0.3)] transition-all duration-300 transform rotate-3 group-hover:rotate-0">
                                <Zap size={40} />
                            </div>
                            <h4 className="text-xl font-bold text-[#EAEAEA] mb-3">
                                {t('flow.step3Title')}
                            </h4>
                            <p className="text-[#EAEAEA]/60 text-sm leading-relaxed px-2">
                                {t('flow.step3Desc')}
                            </p>
                        </div>

                        {/* Step 4 */}
                        <div className="relative z-10 flex flex-col items-center text-center group mt-8 md:mt-0">
                            <div className="w-24 h-24 rounded-2xl bg-[#252A34] border border-[#08D9D6]/30 flex items-center justify-center text-[#08D9D6] mb-6 shadow-[0_0_20px_rgba(8,217,214,0.1)] group-hover:scale-110 group-hover:border-[#08D9D6] group-hover:shadow-[0_0_30px_rgba(8,217,214,0.3)] transition-all duration-300 transform -rotate-3 group-hover:rotate-0">
                                <ClipboardList size={40} />
                            </div>
                            <h4 className="text-xl font-bold text-[#EAEAEA] mb-3">
                                {t('flow.step4Title')}
                            </h4>
                            <p className="text-[#EAEAEA]/60 text-sm leading-relaxed px-2">
                                {t('flow.step4Desc')}
                            </p>
                        </div>
                    </div>
                </section>

                {/* --- NEW SECTION: SUPPORTED CAPABILITIES --- */}
                <section className="w-full max-w-6xl mb-32 border-t border-[#EAEAEA]/10 pt-24 px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-[#08D9D6] text-sm font-bold uppercase tracking-widest mb-3">
                            {t('capabilities.label')}
                        </h2>
                        <h3 className="text-4xl font-black text-[#EAEAEA] tracking-tight">
                            {t('capabilities.heading')}
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-[#EAEAEA]/5 border border-[#EAEAEA]/10 rounded-2xl p-8 hover:bg-[#EAEAEA]/10 transition-colors">
                            <Activity
                                className="text-[#08D9D6] mb-6"
                                size={36}
                            />
                            <h4 className="text-2xl font-bold text-[#EAEAEA] mb-4">
                                {t('capabilities.generalTitle')}
                            </h4>
                            <p className="text-[#EAEAEA]/70 leading-relaxed">
                                {t('capabilities.generalDesc')}
                            </p>
                        </div>
                        <div className="bg-[#EAEAEA]/5 border border-[#EAEAEA]/10 rounded-2xl p-8 hover:bg-[#EAEAEA]/10 transition-colors">
                            <Eye className="text-[#FF2E63] mb-6" size={36} />
                            <h4 className="text-2xl font-bold text-[#EAEAEA] mb-4">
                                {t('capabilities.dermaTitle')}
                            </h4>
                            <p className="text-[#EAEAEA]/70 leading-relaxed">
                                {t('capabilities.dermaDesc')}
                            </p>
                        </div>
                        <div className="bg-[#EAEAEA]/5 border border-[#EAEAEA]/10 rounded-2xl p-8 hover:bg-[#EAEAEA]/10 transition-colors">
                            <ShieldCheck
                                className="text-[#08D9D6] mb-6"
                                size={36}
                            />
                            <h4 className="text-2xl font-bold text-[#EAEAEA] mb-4">
                                {t('capabilities.radioTitle')}
                            </h4>
                            <p className="text-[#EAEAEA]/70 leading-relaxed">
                                {t('capabilities.radioDesc')}
                            </p>
                        </div>
                    </div>
                </section>

                {/* --- SECURITY & TECHNOLOGY HIGHLIGHT --- */}
                <section className="w-full max-w-6xl mb-32 border-t border-[#EAEAEA]/10 pt-24 px-6 flex flex-col md:flex-row gap-16 items-center">
                    <div className="md:w-1/2">
                        <h2 className="text-[#08D9D6] text-sm font-bold uppercase tracking-widest mb-4">
                            {t('trust.label')}
                        </h2>
                        <h3 className="text-4xl font-black text-[#EAEAEA] mb-6 leading-tight tracking-tight">
                            {t('trust.heading')}
                        </h3>
                        <p className="text-lg text-[#EAEAEA]/75 leading-relaxed mb-6">
                            {t('trust.description')}
                        </p>
                        <p className="text-base text-[#FF2E63] font-semibold bg-[#FF2E63]/10 p-5 rounded-lg border border-[#FF2E63]/30">
                            <span className="font-extrabold text-lg mr-2">
                                <AlertTriangle
                                    size={20}
                                    className="inline mr-2 -mt-1"
                                />
                            </span>{" "}
                            {t('trust.disclaimer')}
                        </p>
                    </div>
                    <div className="md:w-1/2 grid grid-cols-1 gap-8">
                        <FeatureCard
                            icon={<Eye size={36} />}
                            title={t('trust.feature1Title')}
                            isAlert={false}
                            description={t('trust.feature1Desc')}
                        />
                        <FeatureCard
                            icon={<Dna size={36} />}
                            title={t('trust.feature2Title')}
                            isAlert={false}
                            description={t('trust.feature2Desc')}
                        />
                    </div>
                </section>

                {/* --- FINAL CALL TO ACTION --- */}
                <section className="text-center w-full max-w-4xl border-t border-[#EAEAEA]/10 pt-24 px-6 relative overflow-hidden bg-[#EAEAEA]/1 rounded-2xl p-16">
                    <div className="absolute inset-0 z-0 pointer-events-none">
                        <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-[#08D9D6]/10 blur-3xl opacity-50"></div>
                        <div className="absolute -top-20 -left-20 w-48 h-48 rounded-full bg-[#FF2E63]/5 blur-3xl opacity-30"></div>
                    </div>
                    <h2 className="text-5xl font-black text-[#EAEAEA] mb-10 tracking-tight relative z-10">
                        {t('cta.heading')}
                    </h2>
                    <p className="text-xl text-[#EAEAEA]/70 mb-14 max-w-3xl mx-auto leading-relaxed relative z-10">
                        {t('cta.subtitle')}
                    </p>
                    <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link
                            to="/diagnose"
                            className="px-14 py-6 bg-[#08D9D6] text-[#252A34] font-black tracking-widest uppercase rounded-lg hover:scale-105 transition-all hover:shadow-[0_0_50px_rgba(8,217,214,0.6)] text-xl w-full sm:w-auto"
                        >
                            {t('cta.button')}
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Home;
