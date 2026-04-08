import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FileUpload from '../components/FileUpload';
import { 
    Dna, Clock, MessageSquareText, AlertTriangle, Camera, 
    CheckCircle2, BrainCircuit, Activity, FileText, 
    Stethoscope, ListChecks, ShieldAlert 
} from 'lucide-react';

const Diagnose = () => {
    const navigate = useNavigate();

    // --- Form States ---
    const [category, setCategory] = useState('general');
    const [days, setDays] = useState(1);
    const [symptoms, setSymptoms] = useState('');
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');

    // --- UI Progression States ---
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [reportData, setReportData] = useState(null);

    // --- Mock AI Logic (Expanded for Detailed UI) ---
    const processAI = async () => {
        await new Promise(resolve => setTimeout(resolve, 3000));
        const text = symptoms.toLowerCase();
        
        if (text.includes('chest') || category === 'cardiology') {
            return {
                risk_level: "High Risk",
                confidence: "94.8%",
                conditions: ["Possible Cardiac Event", "Severe Angina"],
                summary: "Neural analysis of your inputted symptoms strongly correlates with acute myocardial distress. The combination of targeted pain and duration flags critical thresholds.",
                specialists: ["Cardiologist", "Emergency Medicine"],
                next_steps: [
                    "Call emergency services immediately (112).",
                    "Do not attempt to drive yourself to the hospital.",
                    "Rest in a comfortable position while waiting for help.",
                    "Have a list of your current medications ready for paramedics."
                ],
                advice: "Seek immediate emergency medical attention. Do not wait."
            };
        } else if (text.includes('pain') || parseInt(days) > 7) {
            return {
                risk_level: "Medium Risk",
                confidence: "82.4%",
                conditions: ["Chronic Inflammation", "Muscular Strain"],
                summary: "Prolonged symptom duration indicates an underlying inflammatory response. While not immediately life-threatening, intervention is required to prevent degradation.",
                specialists: ["General Practitioner", "Orthopedist"],
                next_steps: [
                    "Schedule a physical evaluation within 48 hours.",
                    "Apply localized temperature therapy (ice/heat) as appropriate.",
                    "Monitor for secondary symptoms like fever or swelling."
                ],
                advice: "Rest and hydration recommended. Professional evaluation required soon."
            };
        } else {
            return {
                risk_level: "Low Risk",
                confidence: "89.1%",
                conditions: ["General Fatigue", "Minor Viral Activity"],
                summary: "Telemetry indicates normal immune system responses to minor external stressors. No critical anomalies detected in the current symptom vector.",
                specialists: ["Primary Care Physician (if persists)"],
                next_steps: [
                    "Ensure a minimum of 8 hours of sleep.",
                    "Increase water intake by 30%.",
                    "Re-evaluate symptoms using AegisMed in 48 hours if no improvement."
                ],
                advice: "No immediate critical indicators detected. Monitor and rest."
            };
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('====================================');
        console.log("Data",category,days,symptoms,file);
        console.log('====================================');
        // 1. Validation
        if (!symptoms.trim() && !file) {
            setError('Please provide symptoms or upload a scan.');
            return;
        }

        // 2. MOCK AUTH CHECK
        const isUserLoggedIn = true; // Change to true to bypass
        if (!isUserLoggedIn) {
            sessionStorage.setItem('pendingSymptoms', symptoms);
            sessionStorage.setItem('pendingCategory', category);
            navigate('/auth'); 
            return;
        }

        setError('');
        setIsSubmitting(true);
        
        try {
            // ==========================================
            // REAL BACKEND API CALL (Commented out)
            // ==========================================
            /*
            // We use FormData because we are transmitting a file along with text
            const formData = new FormData();
            formData.append('category', category);
            formData.append('durationDays', days);
            formData.append('symptoms', symptoms);
            if (file) {
                formData.append('telemetryFile', file);
            }

            const response = await fetch('https://api.aegismed.com/v1/analyze-symptoms', {
                method: 'POST',
                headers: {
                    // Note: When using FormData, DO NOT set 'Content-Type'. 
                    // The browser will automatically set it to 'multipart/form-data' with the correct boundary.
                    // 'Authorization': `Bearer ${userToken}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Analysis failed with status: ${response.status}`);
            }

            const result = await response.json();
            setReportData(result);
            */

            // ==========================================
            // MOCK FALLBACK (Remove when API is active)
            // ==========================================
            // const result = await processAI();
            // setReportData(result);

        } catch (err) {
            setError('Neural Engine Analysis failed. Please try again.');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetScan = () => {
        setReportData(null);
        setSymptoms('');
        setDays(1);
        setFile(null);
        setCategory('general');
    };

    // ==========================================
    // STATE 2: LOADING UI
    // ==========================================
    if (isSubmitting) {
        return (
            <div className="w-full max-w-5xl mx-auto py-24 px-6 flex flex-col items-center justify-center min-h-[70vh]">
                <div className="relative w-32 h-32 mb-8">
                    <div className="absolute inset-0 rounded-full border-t-4 border-[#08D9D6] animate-spin"></div>
                    <div className="absolute inset-2 rounded-full border-r-4 border-[#FF2E63] animate-[spin_1.5s_linear_infinite_reverse]"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-3xl">
                        <BrainCircuit size={40} className="text-[#08D9D6] animate-pulse" />
                    </div>
                </div>
                <h2 className="text-3xl font-black text-[#EAEAEA] mb-3 tracking-widest uppercase">Synthesizing Data</h2>
                <p className="text-[#08D9D6] font-mono animate-pulse text-center">
                    Cross-referencing parameters with global medical models... <br/>
                    Analyzing visual telemetry...
                </p>
            </div>
        );
    }

    // ==========================================
    // STATE 3: DETAILED REPORT UI
    // ==========================================
    if (reportData) {
        const isHighRisk = reportData.risk_level === 'High Risk' || reportData.risk_level === 'Medium Risk';
        const accentColor = isHighRisk ? 'text-[#FF2E63] border-[#FF2E63]' : 'text-[#08D9D6] border-[#08D9D6]';
        const bgColor = isHighRisk ? 'bg-[#FF2E63]/10' : 'bg-[#08D9D6]/10';

        return (
            <div className="w-full max-w-5xl mx-auto py-12 px-6 lg:px-12 relative z-10 min-h-screen animate-[fadeIn_0.5s_ease-in-out]">
                
                {/* Header & Risk Badge */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[#EAEAEA]/10 pb-6 mb-10 gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-[#EAEAEA] mb-2 flex items-center gap-3">
                            <Activity className={accentColor} size={36} /> Comprehensive Output
                        </h1>
                        <p className="text-[#EAEAEA]/50 text-sm tracking-widest uppercase">
                            Analysis Complete for: {category} | AI Confidence: <span className="text-[#08D9D6]">{reportData.confidence}</span>
                        </p>
                    </div>
                    <div className={`px-8 py-3 border-2 ${accentColor} ${bgColor} rounded-lg font-black tracking-widest uppercase shadow-[0_0_20px_currentColor] flex items-center gap-2`}>
                        {isHighRisk && <ShieldAlert size={20} />}
                        {reportData.risk_level}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    
                    {/* Left Column: Core Medical Details */}
                    <div className="md:col-span-2 space-y-6">
                        
                        {/* Summary Block */}
                        <div className="bg-[#1A1D24]/80 border border-[#EAEAEA]/10 p-8 rounded-xl backdrop-blur-md">
                            <h2 className="text-[#EAEAEA]/50 text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                                <FileText size={16} className="text-[#08D9D6]" /> Executive Summary
                            </h2>
                            <p className="text-[#EAEAEA]/90 leading-relaxed text-lg">
                                {reportData.summary}
                            </p>
                        </div>

                        {/* Conditions & Specialists Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="bg-[#1A1D24]/80 border border-[#EAEAEA]/10 p-6 rounded-xl">
                                <h2 className="text-[#EAEAEA]/50 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Activity size={16} className="text-[#FF2E63]" /> Detected Pathology
                                </h2>
                                <ul className="space-y-3">
                                    {reportData.conditions.map((condition, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-[#EAEAEA] font-medium">
                                            <span className={`mt-1.5 w-2 h-2 rounded-full ${isHighRisk ? 'bg-[#FF2E63]' : 'bg-[#08D9D6]'}`}></span>
                                            {condition}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-[#1A1D24]/80 border border-[#EAEAEA]/10 p-6 rounded-xl">
                                <h2 className="text-[#EAEAEA]/50 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Stethoscope size={16} className="text-[#08D9D6]" /> Recommended Specialists
                                </h2>
                                <ul className="space-y-3">
                                    {reportData.specialists.map((specialist, idx) => (
                                        <li key={idx} className="flex items-center gap-3 text-[#EAEAEA] font-medium">
                                            <CheckCircle2 size={16} className="text-[#08D9D6]/50" />
                                            {specialist}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Step-by-Step Action Plan */}
                        <div className={`border-l-4 ${accentColor} ${bgColor} p-8 rounded-r-xl backdrop-blur-sm`}>
                            <h2 className={`text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2 ${accentColor}`}>
                                <ListChecks size={18} /> Immediate Action Plan
                            </h2>
                            <p className="text-[#EAEAEA] font-bold text-lg mb-4">{reportData.advice}</p>
                            <ul className="space-y-3">
                                {reportData.next_steps.map((step, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-[#EAEAEA]/80">
                                        <span className="text-sm font-mono opacity-50 mt-0.5">0{idx + 1}.</span>
                                        {step}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Right Column: Input Context & Metadata */}
                    <div className="space-y-6">
                        <div className="bg-[#1A1D24] border border-[#EAEAEA]/10 p-6 rounded-xl shadow-inner">
                            <h3 className="text-[#EAEAEA]/50 text-xs font-bold uppercase tracking-widest mb-4 border-b border-[#EAEAEA]/10 pb-3">
                                Input Vector Profile
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs text-[#EAEAEA]/40 uppercase tracking-widest mb-1">Duration</p>
                                    <p className="text-[#08D9D6] font-bold">
                                        {days} {days == 1 ? 'Day' : 'Days'}{days == 30 ? '+' : ''}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-[#EAEAEA]/40 uppercase tracking-widest mb-1">Raw Symptom Data</p>
                                    <p className="text-[#EAEAEA]/80 italic text-sm">
                                        "{symptoms || 'No text provided. Visual data analyzed.'}"
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-[#EAEAEA]/40 uppercase tracking-widest mb-1">Telemetry File</p>
                                    <p className="text-[#EAEAEA]/80 text-sm">
                                        {file ? file.name : 'None uploaded'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Medical Disclaimer */}
                        <div className="bg-[#252A34] p-5 rounded-xl border border-[#EAEAEA]/5">
                            <p className="text-[10px] text-[#EAEAEA]/40 uppercase tracking-widest text-center leading-relaxed">
                                AegisMed AI is an informational tool. It does not provide medical diagnosis or replace professional consultation. Always seek advice from a qualified physician.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="border-t border-[#EAEAEA]/10 pt-8 flex justify-center">
                    <button 
                        onClick={resetScan}
                        className="px-12 py-4 border-2 border-[#08D9D6] text-[#08D9D6] font-black uppercase tracking-widest rounded-xl hover:bg-[#08D9D6] hover:text-[#252A34] transition-all shadow-[0_0_15px_rgba(8,217,214,0.2)] hover:shadow-[0_0_30px_rgba(8,217,214,0.5)]"
                    >
                        Initialize New Scan
                    </button>
                </div>
            </div>
        );
    }

    // ==========================================
    // STATE 1: FORM UI
    // ==========================================
    return (
        <div className="w-full max-w-5xl mx-auto py-12 px-6 lg:px-12 relative z-10 min-h-screen">
            
            {/* Background Glow Effects */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#08D9D6]/5 blur-[120px] rounded-full -z-10 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#FF2E63]/5 blur-[100px] rounded-full -z-10 pointer-events-none"></div>
            
            <div className="mb-12 border-b border-[#EAEAEA]/10 pb-8">
                <h1 className="text-4xl md:text-5xl font-black text-[#EAEAEA] mb-3 tracking-tight">Initialize Analysis</h1>
                <p className="text-[#08D9D6] tracking-widest uppercase text-sm font-bold">Neural Engine Ready for Data Input</p>
            </div>

            {error && (
                <div className="bg-[#FF2E63]/10 border border-[#FF2E63] text-[#FF2E63] px-4 py-3 rounded mb-8 text-sm font-medium">
                    <AlertTriangle size={20} className="inline mr-2 -mt-1" /> {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* Row: Category and Days */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* Dropdown Box */}
                    <div className="bg-[#1A1D24]/50 border border-[#EAEAEA]/10 p-6 rounded-2xl backdrop-blur-sm flex flex-col justify-center">
                        <label className=" text-sm font-bold uppercase tracking-widest text-[#EAEAEA]/70 mb-3 flex items-center gap-2">
                            <Dna size={18} className="text-[#08D9D6]" />Focus Area
                        </label>
                        <select 
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full bg-[#252A34] border border-[#EAEAEA]/20 rounded-xl p-4 text-[#EAEAEA] font-medium focus:outline-none focus:border-[#08D9D6] focus:ring-1 focus:ring-[#08D9D6] transition-all cursor-pointer"
                        >
                            <option value="general">General Symptoms</option>
                            <option value="dermatology">Dermatology (Skin/Rash)</option>
                            <option value="respiratory">Respiratory (Cough/Breathing)</option>
                            <option value="cardiology">Cardiology (Chest/Heart)</option>
                            <option value="radiology">Radiology (X-Ray Upload)</option>
                        </select>
                    </div>

                    {/* Slider Box */}
                    <div className="bg-[#1A1D24]/50 border border-[#EAEAEA]/10 p-6 rounded-2xl backdrop-blur-sm flex flex-col justify-center">
                        <div className="flex justify-between items-end mb-4">
                            <label className="text-sm font-bold uppercase tracking-widest text-[#EAEAEA]/70 flex items-center gap-2">
                                <Clock size={18} className="text-[#08D9D6]" /> Duration
                            </label>
                            
                            {/* Dynamic Number Display */}
                            <span className="text-[#08D9D6] font-black text-2xl leading-none">
                                {days} <span className="text-sm text-[#EAEAEA]/50 font-normal uppercase tracking-widest">
                                    {days == 1 ? 'Day' : 'Days'}{days == 30 ? '+' : ''}
                                </span>
                            </span>
                        </div>
                        
                        <input
                            type="range"
                            min="1"
                            max="30"
                            value={days}
                            onChange={(e) => setDays(e.target.value)}
                            className="w-full h-2 bg-[#252A34] rounded-lg appearance-none cursor-pointer accent-[#08D9D6]"
                        />
                        
                        <div className="flex justify-between text-xs text-[#EAEAEA]/30 mt-3 font-bold uppercase tracking-widest">
                            <span>1 Day</span>
                            <span>30+ Days</span>
                        </div>
                    </div>
                </div>

                {/* Symptom Input Area */}
                <div className="bg-[#1A1D24]/50 border border-[#EAEAEA]/10 p-8 rounded-2xl backdrop-blur-sm">
                    <label className=" text-sm font-bold uppercase tracking-widest text-[#EAEAEA]/70 mb-4 flex items-center gap-2">
                        <MessageSquareText size={18} className="text-[#08D9D6]" />  Describe Details
                    </label>
                    <textarea
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                        rows={5}
                        className="w-full bg-[#252A34] border border-[#EAEAEA]/20 rounded-xl p-5 text-[#EAEAEA] text-lg focus:outline-none focus:border-[#08D9D6] focus:ring-1 focus:ring-[#08D9D6] transition-all resize-none shadow-inner placeholder:text-[#EAEAEA]/30"
                        placeholder="Please be as detailed as possible. E.g., 'I have been experiencing a sharp pain in my lower back...'"
                    />
                </div>

                {/* File Upload Area */}
                <div className="bg-[#1A1D24]/50 border border-[#EAEAEA]/10 p-8 rounded-2xl backdrop-blur-sm">
                    <label className=" text-sm font-bold uppercase tracking-widest text-[#EAEAEA]/70 mb-4 flex items-center gap-2">
                        <Camera size={18} className="text-[#08D9D6]" /> Visual Telemetry (Optional)
                    </label>
                    <FileUpload file={file} setFile={setFile} />
                </div>

                {/* Submit Action */}
                <div className="pt-6 border-t border-[#EAEAEA]/10">
                    <button 
                        type="submit" 
                        disabled={!symptoms.trim() && !file}
                        className="w-full md:w-auto px-16 py-5 bg-[#08D9D6] text-[#252A34] font-black uppercase tracking-widest rounded-xl hover:bg-[#08D9D6]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-3 shadow-[0_0_20px_rgba(8,217,214,0.3)] hover:shadow-[0_0_40px_rgba(8,217,214,0.5)] text-lg"
                    >
                        Execute Analysis
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Diagnose;