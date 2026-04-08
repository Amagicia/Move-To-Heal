import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import FeatureCard from "../components/FeatureCard";
import StatBadge from "../components/StatBadge";
import {
    Eye,
    Dna,
    MessageSquareText,
    Camera,
    Zap,
    ClipboardList,
    AlertTriangle,
} from "lucide-react";

const Home = () => {
    // Cursor background state
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        setMousePos({ x: e.clientX, y: e.clientY });
    };

    // --- ROTATING TEXT LOGIC ---
    const dynamicWords = [
        "Reimagined.",
        "Elevated.",
        "Secured.",
        "Decoded.",
        "Prioritized.",
    ];
    const [wordIndex, setWordIndex] = useState(0);
    const [fadeProp, setFadeProp] = useState(true);

    useEffect(() => {
        const wordInterval = setInterval(() => {
            // 1. Trigger fade out
            setFadeProp(false);

            // 2. Wait for fade out to complete, change word, and fade back in
            setTimeout(() => {
                setWordIndex(
                    (prevIndex) => (prevIndex + 1) % dynamicWords.length
                );
                setFadeProp(true);
            }, 500); // 500ms matches the Tailwind duration-500 class
        }, 3500); // Change word every 3.5 seconds

        return () => clearInterval(wordInterval);
    }, [dynamicWords.length]);

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
                <header className="text-center w-full max-w-5xl mt-12 mb-28 border-b border-[#EAEAEA]/10 pb-20">
                    <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-[#08D9D6]/35 bg-[#08D9D6]/15 text-[#08D9D6] text-xs font-bold tracking-widest uppercase mb-10 shadow-lg">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FF2E63] animate-pulse"></span>
                        Intelligence Meets Compassion: Move to Heal
                    </div>

                    {/* ANIMATED HEADLINE */}
                    <h1 className="text-6xl md:text-8xl font-extrabold text-[#EAEAEA] mb-8 tracking-tighter leading-tight md:leading-none min-h-[140px] md:min-h-[192px]">
                        Precision Path. <br />
                        <span className="text-[#EAEAEA]/90">Your Health, </span>
                        <br className="block md:hidden" />
                        <span
                            className={`inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#08D9D6] to-[#08D9D6]/50 transition-all duration-500 ease-in-out transform ${
                                fadeProp
                                    ? "opacity-100 translate-y-0"
                                    : "opacity-0 translate-y-6"
                            }`}
                        >
                            {dynamicWords[wordIndex]}
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-[#EAEAEA]/75 mb-14 max-w-3xl mx-auto leading-relaxed">
                        Move towards a healthier you. AegisMed's neural engine
                        analyzes scans and symptoms instantly, paving the way
                        for proactive wellness and confident healthcare
                        decisions.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                        <Link
                            to="/diagnose"
                            className="px-12 py-5 bg-[#08D9D6] text-[#252A34] font-black rounded-lg hover:scale-105 transition-all hover:shadow-[0_0_40px_rgba(8,217,214,0.5)] w-full sm:w-auto text-lg uppercase tracking-wider"
                        >
                            Start Your Healing Scan
                        </Link>
                        <Link
                            to="/about"
                            className="px-12 py-5 border-2 border-[#EAEAEA]/25 text-[#EAEAEA] font-bold rounded-lg hover:border-[#FF2E63] hover:text-[#FF2E63] transition-all w-full sm:w-auto text-lg uppercase tracking-wider hover:scale-105"
                        >
                            Explore Our Approach
                        </Link>
                    </div>
                </header>

                {/* --- STATS SECTION --- */}
                <section className="flex flex-wrap justify-center gap-10 mb-32 w-full max-w-6xl">
                    <StatBadge value="99.8%" label="Accuracy Rate" />
                    <StatBadge value="< 2s" label="Processing Time" />
                    <StatBadge value="2.4M+" label="Parameters Scanned" />
                    <StatBadge value="Secure" label="Data Encryption" />
                </section>

                {/* --- THE HEALING PIPELINE (Feature Flow) --- */}
                <section className="w-full max-w-7xl mb-32 border-t border-[#EAEAEA]/10 pt-24 pb-16 px-6 relative">
                    <div className="text-center mb-20">
                        <h2 className="text-[#08D9D6] text-sm font-bold uppercase tracking-widest mb-3">
                            The Diagnostic Flow
                        </h2>
                        <h3 className="text-4xl md:text-5xl font-black text-[#EAEAEA] tracking-tight">
                            From Symptoms to Clarity
                        </h3>
                        <p className="text-lg text-[#EAEAEA]/70 mt-5 max-w-2xl mx-auto">
                            A seamless, private, and instantaneous process
                            designed to give you answers when you need them
                            most.
                        </p>
                    </div>

                    {/* Connected Grid Flow */}
                    <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Connecting Line (Desktop Only) */}
                        <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-[#08D9D6]/30 to-transparent z-0"></div>

                        {/* Step 1 */}
                        <div className="relative z-10 flex flex-col items-center text-center group">
                            <div className="w-24 h-24 rounded-2xl bg-[#252A34] border border-[#08D9D6]/30 flex items-center justify-center text-4xl mb-6 shadow-[0_0_20px_rgba(8,217,214,0.1)] group-hover:scale-110 group-hover:border-[#08D9D6] group-hover:shadow-[0_0_30px_rgba(8,217,214,0.3)] transition-all duration-300 transform rotate-3 group-hover:rotate-0">
                                💬
                            </div>
                            <h4 className="text-xl font-bold text-[#EAEAEA] mb-3">
                                1. NLP Symptom Tracking
                            </h4>
                            <p className="text-[#EAEAEA]/60 text-sm leading-relaxed px-2">
                                Type how you're feeling naturally. Our Natural
                                Language Processor translates your words into
                                standardized clinical markers.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="relative z-10 flex flex-col items-center text-center group mt-8 md:mt-0">
                            <div className="w-24 h-24 rounded-2xl bg-[#252A34] border border-[#08D9D6]/30 flex items-center justify-center text-4xl mb-6 shadow-[0_0_20px_rgba(8,217,214,0.1)] group-hover:scale-110 group-hover:border-[#08D9D6] group-hover:shadow-[0_0_30px_rgba(8,217,214,0.3)] transition-all duration-300 transform -rotate-3 group-hover:rotate-0">
                                📷
                            </div>
                            <h4 className="text-xl font-bold text-[#EAEAEA] mb-3">
                                2. Visual AI Scans
                            </h4>
                            <p className="text-[#EAEAEA]/60 text-sm leading-relaxed px-2">
                                Securely upload photos of skin anomalies or
                                radiological scans. Our computer vision model
                                detects patterns invisible to the untrained eye.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="relative z-10 flex flex-col items-center text-center group mt-8 md:mt-0">
                            <div className="w-24 h-24 rounded-2xl bg-[#252A34] border border-[#FF2E63]/40 flex items-center justify-center text-4xl mb-6 shadow-[0_0_20px_rgba(255,46,99,0.15)] group-hover:scale-110 group-hover:border-[#FF2E63] group-hover:shadow-[0_0_30px_rgba(255,46,99,0.3)] transition-all duration-300 transform rotate-3 group-hover:rotate-0">
                                ⚡
                            </div>
                            <h4 className="text-xl font-bold text-[#EAEAEA] mb-3">
                                3. Instant Triage
                            </h4>
                            <p className="text-[#EAEAEA]/60 text-sm leading-relaxed px-2">
                                The neural engine cross-references your inputs
                                against millions of data points to instantly
                                assign a Low, Medium, or High risk level.
                            </p>
                        </div>

                        {/* Step 4 */}
                        <div className="relative z-10 flex flex-col items-center text-center group mt-8 md:mt-0">
                            <div className="w-24 h-24 rounded-2xl bg-[#252A34] border border-[#08D9D6]/30 flex items-center justify-center text-4xl mb-6 shadow-[0_0_20px_rgba(8,217,214,0.1)] group-hover:scale-110 group-hover:border-[#08D9D6] group-hover:shadow-[0_0_30px_rgba(8,217,214,0.3)] transition-all duration-300 transform -rotate-3 group-hover:rotate-0">
                                📋
                            </div>
                            <h4 className="text-xl font-bold text-[#EAEAEA] mb-3">
                                4. Actionable Reports
                            </h4>
                            <p className="text-[#EAEAEA]/60 text-sm leading-relaxed px-2">
                                Receive a clear, plain-English summary of
                                potential conditions and exact next steps to
                                take to your healthcare provider.
                            </p>
                        </div>
                    </div>
                </section>

                {/* --- SECURITY & TECHNOLOGY HIGHLIGHT --- */}
                <section className="w-full max-w-6xl mb-32 border-t border-[#EAEAEA]/10 pt-24 px-6 flex flex-col md:flex-row gap-16 items-center">
                    <div className="md:w-1/2">
                        <h2 className="text-[#08D9D6] text-sm font-bold uppercase tracking-widest mb-4">
                            Core Trust & Innovation
                        </h2>
                        <h3 className="text-4xl font-black text-[#EAEAEA] mb-6 leading-tight tracking-tight">
                            Advanced neural modeling{" "}
                            <br className="hidden md:block" /> for maximum
                            security.
                        </h3>
                        <p className="text-lg text-[#EAEAEA]/75 leading-relaxed mb-6">
                            AegisMed leverages proprietary neural network
                            architectures, trained ephemerally and utilizing
                            end-to-end encryption. Your medical telemetry and
                            personal data are processed in volatile memory and
                            instantly destroyed upon analysis completion,
                            ensuring unparalleled privacy and security. We
                            operate with zero data retention, prioritizing HIPAA
                            alignment at every level.
                        </p>
                        <p className="text-base text-[#FF2E63] font-semibold bg-[#FF2E63]/10 p-5 rounded-lg border border-[#FF2E63]/30">
                            <span className="font-extrabold text-lg mr-2">
                            <AlertTriangle size={20} className="inline mr-2 -mt-1" />
                            </span>{" "}
                            AegisMed is an AI-powered informational tool. It is
                            NOT a substitute for professional medical advice,
                            diagnosis, or treatment. Always seek the advice of
                            your physician or other qualified health provider.
                            If you think you may have a medical emergency, call
                            your doctor or emergency services immediately.
                        </p>
                    </div>
                    <div className="md:w-1/2 grid grid-cols-1 gap-8">
                        <FeatureCard
                            icon={<Eye size={36} />}
                            title="Aegis-Vision Neural Engine"
                            isAlert={false}
                            description="Proprietary CNN trained ephemerally on millions of radiological and dermatological images for unparalleled screening precision."
                        />
                        <FeatureCard
                            icon={<Dna size={36} />}
                            title="NLP-Core Symptom Synthesis"
                            isAlert={false}
                            description="Transformer-based language model, fine-tuned on vast medical corpora, translates descriptions into precise pathology matching."
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
                        Step Towards Healing Today
                    </h2>
                    <p className="text-xl text-[#EAEAEA]/70 mb-14 max-w-3xl mx-auto leading-relaxed relative z-10">
                        AegisMed's Move to Heal initiative is here to support
                        you. Instant, secure insights are just a click away.
                        Prioritize your well-being and let our AI assist your
                        proactive healthcare journey.
                    </p>
                    <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link
                            to="/diagnose"
                            className="px-14 py-6 bg-[#08D9D6] text-[#252A34] font-black tracking-widest uppercase rounded-lg hover:scale-105 transition-all hover:shadow-[0_0_50px_rgba(8,217,214,0.6)] text-xl w-full sm:w-auto"
                        >
                            Start Free Diagnosis
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Home;
