import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FileUpload from '../components/FileUpload';
import { 
    Dna, Clock, MessageSquareText, AlertTriangle, Camera, 
    CheckCircle2, BrainCircuit, Activity, FileText, 
    Stethoscope, ListChecks, ShieldAlert, Download 
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
    const [isDownloading, setIsDownloading] = useState(false);
    const [reportData, setReportData] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        console.log("=== 1. FORM SUBMITTED ===");
        console.log("Category:", category, "| Days:", days);
        console.log("Symptoms:", symptoms);
        console.log("File:", file ? file.name : "No file attached");

        // 1. Validation
        if (!symptoms.trim() && !file) {
            setError('Please provide symptoms or upload a scan.');
            return;
        }

        // 2. MOCK AUTH CHECK
        const isUserLoggedIn = true; 
        if (!isUserLoggedIn) {
            sessionStorage.setItem('pendingSymptoms', symptoms);
            sessionStorage.setItem('pendingCategory', category);
            navigate('/auth'); 
            return;
        }

        setError('');
        setIsSubmitting(true);
        
        try {
            console.log("=== 2. PREPARING DATA FOR BACKEND ===");
            const formData = new FormData();
            formData.append('category', category);
            formData.append('durationDays', Number(days));
            formData.append('symptoms', symptoms);
            
            if (file) {
                formData.append('telemetryFile', file);
            }

            console.log("Sending POST request to http://localhost:5000/analyze_symptoms...");
            const response = await fetch("http://localhost:5000/analyze_symptoms", {
                method: "POST",
                body: formData, 
            });
              
            const data = await response.json();
            
            console.log("=== 3. DATA RECEIVED FROM BACKEND ===");
            console.log(data); // 👈 THIS WILL SHOW YOU EXACTLY WHAT GROQ SENT BACK
              
            if (!response.ok) {
                throw new Error(data.error || "Unknown server error");
            }
              
            setReportData(data);

        } catch (err) {
            setError(err.message || 'Neural Engine Analysis failed. Please try again.');
            console.error("=== API CRASH / ERROR ===", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDownloadReport = async () => {
        setIsDownloading(true);
        setError('');

        try {
            console.log("=== DOWNLOADING REPORT ===");
            const response = await fetch("http://localhost:5000/download_report", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    category,
                    days,
                    symptoms,
                    report: reportData
                })
            });

            if (!response.ok) {
                throw new Error("Failed to generate report document.");
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `AegisMed_Report_${new Date().toISOString().split('T')[0]}.pdf`;
            document.body.appendChild(a);
            a.click();
            
            a.remove();
            window.URL.revokeObjectURL(url);
            console.log("Download successful!");

        } catch (err) {
            console.error("Download Error:", err);
            setError("Could not download the report. Please try again.");
        } finally {
            setIsDownloading(false);
        }
    };

    const resetScan = () => {
        setReportData(null);
        setSymptoms('');
        setDays(1);
        setFile(null);
        setCategory('general');
        setError('');
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
        // Fallback checks just in case the AI messes up the risk level string
        const riskString = reportData.risk_level || "Unknown";
        const isHighRisk = riskString.includes('High') || riskString.includes('Medium');
        const accentColor = isHighRisk ? 'text-[#FF2E63] border-[#FF2E63]' : 'text-[#08D9D6] border-[#08D9D6]';
        const bgColor = isHighRisk ? 'bg-[#FF2E63]/10' : 'bg-[#08D9D6]/10';

        return (
            <div className="w-full max-w-5xl mx-auto py-12 px-6 lg:px-12 relative z-10 min-h-screen animate-[fadeIn_0.5s_ease-in-out]">
                
                {error && (
                    <div className="bg-[#FF2E63]/10 border border-[#FF2E63] text-[#FF2E63] px-4 py-3 rounded mb-8 text-sm font-medium">
                        <AlertTriangle size={20} className="inline mr-2 -mt-1" /> {error}
                    </div>
                )}

                {/* Header & Risk Badge */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[#EAEAEA]/10 pb-6 mb-10 gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-[#EAEAEA] mb-2 flex items-center gap-3">
                            <Activity className={accentColor} size={36} /> Comprehensive Output
                        </h1>
                        <p className="text-[#EAEAEA]/50 text-sm tracking-widest uppercase">
                            Analysis Complete for: {category} | AI Confidence: <span className="text-[#08D9D6]">{reportData.confidence || "N/A"}</span>
                        </p>
                    </div>
                    <div className={`px-8 py-3 border-2 ${accentColor} ${bgColor} rounded-lg font-black tracking-widest uppercase shadow-[0_0_20px_currentColor] flex items-center gap-2`}>
                        {isHighRisk && <ShieldAlert size={20} />}
                        {riskString}
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
                                {reportData.summary || "No summary provided by the neural engine."}
                            </p>
                        </div>

                        {/* Conditions & Specialists Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="bg-[#1A1D24]/80 border border-[#EAEAEA]/10 p-6 rounded-xl">
                                <h2 className="text-[#EAEAEA]/50 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Activity size={16} className="text-[#FF2E63]" /> Detected Pathology
                                </h2>
                                <ul className="space-y-3">
                                    {/* DEFENSIVE MAPPING: Fallback to an empty array if missing */}
                                    {(reportData.conditions || []).length > 0 ? (
                                        reportData.conditions.map((condition, idx) => (
                                            <li key={idx} className="flex items-start gap-3 text-[#EAEAEA] font-medium">
                                                <span className={`mt-1.5 w-2 h-2 rounded-full ${isHighRisk ? 'bg-[#FF2E63]' : 'bg-[#08D9D6]'}`}></span>
                                                {condition}
                                            </li>
                                        ))
                                    ) : (
                                        <li className="text-[#EAEAEA]/50 italic">No specific conditions flagged.</li>
                                    )}
                                </ul>
                            </div>

                            <div className="bg-[#1A1D24]/80 border border-[#EAEAEA]/10 p-6 rounded-xl">
                                <h2 className="text-[#EAEAEA]/50 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Stethoscope size={16} className="text-[#08D9D6]" /> Recommended Specialists
                                </h2>
                                <ul className="space-y-3">
                                    {/* DEFENSIVE MAPPING: Fallback to an empty array if missing */}
                                    {(reportData.specialists || []).length > 0 ? (
                                        reportData.specialists.map((specialist, idx) => (
                                            <li key={idx} className="flex items-center gap-3 text-[#EAEAEA] font-medium">
                                                <CheckCircle2 size={16} className="text-[#08D9D6]/50" />
                                                {specialist}
                                            </li>
                                        ))
                                    ) : (
                                        <li className="text-[#EAEAEA]/50 italic">No specialist recommendations.</li>
                                    )}
                                </ul>
                            </div>
                        </div>

                        {/* Step-by-Step Action Plan */}
                        <div className={`border-l-4 ${accentColor} ${bgColor} p-8 rounded-r-xl backdrop-blur-sm`}>
                            <h2 className={`text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2 ${accentColor}`}>
                                <ListChecks size={18} /> Immediate Action Plan
                            </h2>
                            <p className="text-[#EAEAEA] font-bold text-lg mb-4">
                                {reportData.advice || "Please consult a healthcare professional."}
                            </p>
                            <ul className="space-y-3">
                                {/* DEFENSIVE MAPPING: THE PREVIOUS CRASH WAS HERE */}
                                {(reportData.next_steps || []).length > 0 ? (
                                    reportData.next_steps.map((step, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-[#EAEAEA]/80">
                                            <span className="text-sm font-mono opacity-50 mt-0.5">0{idx + 1}.</span>
                                            {step}
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-[#EAEAEA]/50 italic">No immediate steps provided. Monitor symptoms.</li>
                                )}
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

                {/* --- Bottom Actions: Reset & Download --- */}
                <div className="border-t border-[#EAEAEA]/10 pt-8 flex flex-col sm:flex-row justify-center gap-6">
                    <button 
                        onClick={resetScan}
                        className="px-10 py-4 border-2 border-[#EAEAEA]/20 text-[#EAEAEA] font-bold uppercase tracking-widest rounded-xl hover:border-[#08D9D6] hover:text-[#08D9D6] transition-all"
                    >
                        Initialize New Scan
                    </button>
                    
                    <button 
                        onClick={handleDownloadReport}
                        disabled={isDownloading}
                        className="px-10 py-4 bg-[#08D9D6] text-[#252A34] font-black uppercase tracking-widest rounded-xl hover:bg-[#08D9D6]/90 transition-all flex items-center justify-center gap-3 shadow-[0_0_15px_rgba(8,217,214,0.3)] disabled:opacity-50"
                    >
                        {isDownloading ? (
                            <div className="w-5 h-5 border-2 border-[#252A34]/20 border-t-[#252A34] rounded-full animate-spin"></div>
                        ) : (
                            <Download size={20} />
                        )}
                        Download PDF Report
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