import { useState } from 'react';
import FileUpload from '../components/FileUpload';
import { Dna, Clock, MessageSquareText, AlertTriangle,Camera, UploadCloud, CheckCircle2, BrainCircuit } from 'lucide-react';


const Diagnose = () => {
  // --- Form States ---
  const [category, setCategory] = useState('general');
  const [days, setDays] = useState(1); // Set default to 1 so the slider has a starting point
  const [symptoms, setSymptoms] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  // --- UI Progression States ---
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reportData, setReportData] = useState(null);

  // --- Mock AI Logic ---
  const processAI = async () => {
    await new Promise(resolve => setTimeout(resolve, 3000));
    const text = symptoms.toLowerCase();
    
    if (text.includes('chest') || category === 'cardiology') {
      return {
        risk_level: "High Risk",
        conditions: ["Possible Cardiac Event", "Severe Angina"],
        advice: "Seek immediate emergency medical attention. Do not wait."
      };
    } else if (text.includes('pain') || parseInt(days) > 7) {
      return {
        risk_level: "Medium Risk",
        conditions: ["Chronic Inflammation", "Muscular Strain"],
        advice: "Rest and hydration recommended. Since symptoms have persisted, schedule a physical evaluation within 48 hours."
      };
    } else {
      return {
        risk_level: "Low Risk",
        conditions: ["General Fatigue", "Minor Viral Activity"],
        advice: "No immediate critical indicators detected. Ensure adequate sleep, hydration, and monitor for changes."
      };
    }
  };


const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Validation
    if (!symptoms.trim() && !file) {
      setError('Please provide symptoms or upload a scan.');
      return;
    }
  
    // 2. MOCK AUTH CHECK (Change 'false' to 'true' to simulate being logged in)
    const isUserLoggedIn = false; 
  
    if (!isUserLoggedIn) {
      // If not logged in, save their progress to 'sessionStorage' 
      // and redirect to login page
      sessionStorage.setItem('pendingSymptoms', symptoms);
      sessionStorage.setItem('pendingCategory', category);
      navigate('/auth'); 
      return;
    }
  
    // 3. If logged in, proceed to analysis as normal
    setError('');
    setIsSubmitting(true);
    try {
      const result = await processAI();
      setReportData(result);
    } catch (err) {
      setError('Analysis failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetScan = () => {
    setReportData(null);
    setSymptoms('');
    setDays(1); // Reset back to 1
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
          <div className="absolute inset-0 flex items-center justify-center text-3xl">🧠</div>
        </div>
        <h2 className="text-3xl font-black text-[#EAEAEA] mb-3 tracking-widest uppercase">Analyzing Data</h2>
        <p className="text-[#08D9D6] font-mono animate-pulse">Cross-referencing parameters with neural databases...</p>
      </div>
    );
  }

  // ==========================================
  // STATE 3: REPORT UI
  // ==========================================
  if (reportData) {
    const isHighRisk = reportData.risk_level === 'High Risk' || reportData.risk_level === 'Medium Risk';
    const accentColor = isHighRisk ? 'text-[#FF2E63] border-[#FF2E63]' : 'text-[#08D9D6] border-[#08D9D6]';
    const bgColor = isHighRisk ? 'bg-[#FF2E63]/10' : 'bg-[#08D9D6]/10';

    return (
      <div className="w-full max-w-5xl mx-auto py-12 px-6 lg:px-12 relative z-10 min-h-screen animate-[fadeIn_0.5s_ease-in-out]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[#EAEAEA]/10 pb-6 mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-[#EAEAEA] mb-2">Diagnostic Output</h1>
            <p className="text-[#EAEAEA]/50 text-sm tracking-widest uppercase">Analysis Complete for: {category}</p>
          </div>
          <div className={`px-6 py-2 border-2 ${accentColor} ${bgColor} rounded font-black tracking-widest uppercase shadow-[0_0_15px_currentColor]`}>
            {reportData.risk_level}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="md:col-span-2 space-y-8">
            <div className="bg-[#1A1D24]/80 border border-[#EAEAEA]/20 p-8 rounded-xl backdrop-blur-md">
              <h2 className="text-[#EAEAEA]/50 text-xs font-bold uppercase tracking-widest mb-4">Detected Conditions</h2>
              <ul className="space-y-4">
                {reportData.conditions.map((condition, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-xl text-[#EAEAEA] font-medium">
                    <span className={`w-3 h-3 rounded-full ${isHighRisk ? 'bg-[#FF2E63]' : 'bg-[#08D9D6]'}`}></span>
                    {condition}
                  </li>
                ))}
              </ul>
            </div>

            <div className={`border-l-4 ${accentColor} ${bgColor} p-8 rounded-r-xl backdrop-blur-sm`}>
              <h2 className={`text-xs font-bold uppercase tracking-widest mb-3 ${accentColor}`}>Action Plan</h2>
              <p className="text-[#EAEAEA] leading-relaxed text-lg">{reportData.advice}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-[#1A1D24] border border-[#EAEAEA]/10 p-6 rounded-xl shadow-inner">
              <h3 className="text-[#EAEAEA]/50 text-xs font-bold uppercase tracking-widest mb-3">Input Vector</h3>
              <p className="text-[#EAEAEA]/80 italic text-sm mb-2">"{symptoms || 'Visual data analyzed.'}"</p>
              <p className="text-[#08D9D6] text-xs font-bold">Duration: {days} {days == 1 ? 'Day' : 'Days'}{days == 30 ? '+' : ''}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-[#EAEAEA]/10 pt-8 flex justify-center">
          <button 
            onClick={resetScan}
            className="px-12 py-4 border-2 border-[#08D9D6] text-[#08D9D6] font-black uppercase tracking-widest rounded-xl hover:bg-[#08D9D6] hover:text-[#252A34] transition-all shadow-[0_0_15px_rgba(8,217,214,0.2)] hover:shadow-[0_0_30px_rgba(8,217,214,0.5)]"
          >
            Start New Scan
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
    
    {/* --- ADD THESE FOR THE 1000K LOOK --- */}
    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#08D9D6]/5 blur-[120px] rounded-full -z-10 pointer-events-none"></div>
    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#FF2E63]/5 blur-[100px] rounded-full -z-10 pointer-events-none"></div>
    
    <div className="mb-12 border-b border-[#EAEAEA]/10 pb-8">
      <h1 className="text-4xl md:text-5xl font-black text-[#EAEAEA] mb-3 tracking-tight">Initialize Analysis</h1>
      <p className="text-[#08D9D6] tracking-widest uppercase text-sm font-bold">Neural Engine Ready for Data Input</p>
    </div>

    {/* <div className="w-full max-w-5xl mx-auto py-12 px-6 lg:px-12 relative z-10 min-h-screen">
      
      <div className="mb-12 border-b border-[#EAEAEA]/10 pb-8">
        <h1 className="text-4xl md:text-5xl font-black text-[#EAEAEA] mb-3 tracking-tight">Initialize Analysis</h1>
        <p className="text-[#08D9D6] tracking-widest uppercase text-sm font-bold">Neural Engine Ready for Data Input</p>
      </div> */}
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

          {/* NEW: Slider Box */}
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