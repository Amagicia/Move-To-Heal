import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import FileUpload from '../components/FileUpload';
import { 
    Dna, Clock, MessageSquareText, AlertTriangle, Camera, 
    CheckCircle2, BrainCircuit, Activity, FileText, 
    Stethoscope, ListChecks, ShieldAlert, Download, Zap, History,
    Mic, Volume2, Loader2, StopCircle 
} from 'lucide-react';

const FOCUS_AREAS = [
    { value: 'general',     label: 'General Health',       mode: 'symptom' },
    { value: 'respiratory', label: 'Breathing & Lungs',     mode: 'symptom' },
    { value: 'cardiology',  label: 'Heart & Chest Pain',    mode: 'symptom' },
    { value: 'dermatology', label: 'Skin & Rashes',         mode: 'symptom' },
    { value: 'brain',       label: 'Brain (MRI Scan)',      mode: 'scan'    },
    { value: 'chest',       label: 'Chest / Lungs (X-Ray)', mode: 'scan'    },
    { value: 'skin',        label: 'Skin (Photo)',          mode: 'scan'    },
];

const LANGUAGES = [
    { value: 'auto', label: 'Auto-Detect Language' },
    { value: 'en-IN', label: 'English' },
    { value: 'hi-IN', label: 'Hindi' },
    { value: 'bn-IN', label: 'Bengali' },
    { value: 'ta-IN', label: 'Tamil' },
    { value: 'te-IN', label: 'Telugu' },
    { value: 'mr-IN', label: 'Marathi' },
    { value: 'gu-IN', label: 'Gujarati' },
    { value: 'kn-IN', label: 'Kannada' },
    { value: 'ml-IN', label: 'Malayalam' },
    { value: 'pa-IN', label: 'Punjabi' }
];

const Diagnose = () => {
    const navigate = useNavigate();

    const [selectedLanguage, setSelectedLanguage] = useState('auto');
    const [detectedLangLabel, setDetectedLangLabel] = useState('');
    const [detectedLangCode, setDetectedLangCode] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessingAudio, setIsProcessingAudio] = useState(false);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const [isPlayingTTS, setIsPlayingTTS] = useState(false);
    const [isFetchingTTS, setIsFetchingTTS] = useState(false);
    const audioRef = useRef(null);

    const toggleRecording = async () => {
        if (isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        } else {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const mediaRecorder = new MediaRecorder(stream);
                mediaRecorderRef.current = mediaRecorder;
                audioChunksRef.current = [];

                mediaRecorder.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        audioChunksRef.current.push(event.data);
                    }
                };

                mediaRecorder.onstop = async () => {
                    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                    stream.getTracks().forEach(track => track.stop());
                    
                    setIsProcessingAudio(true);
                    const formData = new FormData();
                    formData.append('file', audioBlob, 'recording.webm');
                    formData.append('language_code', selectedLanguage);
                    try {
                        const res = await fetch('http://localhost:5001/api/stt', {
                            method: 'POST',
                            body: formData
                        });
                        const data = await res.json();
                        if (!res.ok) {
                             setError("STT error: " + (data.details || data.error || 'Unknown error'));
                        } else if (data.transcript) {
                             setSymptoms(prev => prev ? prev + ' ' + data.transcript : data.transcript);
                             // Store detected language for TTS and update UI
                             if (data.language_code) {
                                  setDetectedLangCode(data.language_code);
                                  const match = LANGUAGES.find(l => l.value === data.language_code);
                                  const langName = match ? match.label : data.language_code;
                                  const probText = data.language_probability 
                                       ? ` (${Math.round(data.language_probability * 100)}% confidence)` 
                                       : '';
                                  setDetectedLangLabel(langName + probText);
                                  // Auto-switch dropdown to the detected language
                                  if (data.language_code !== selectedLanguage) {
                                       setSelectedLanguage(data.language_code);
                                  }
                             }
                        } else {
                             setError("No speech detected. Please try again.");
                        }
                    } catch(e) {
                        console.error("STT Error", e);
                        setError("Speech service unavailable. Ensure it is running on port 5001.");
                    } finally {
                        setIsProcessingAudio(false);
                    }
                };

                mediaRecorder.start();
                setIsRecording(true);
            } catch (e) {
                 console.error("Mic Error", e);
                 setError("Microphone access denied or unavailable.");
            }
        }
    };

    const handleTTS = async (text) => {
        if (isPlayingTTS && audioRef.current) {
             audioRef.current.pause();
             setIsPlayingTTS(false);
             return;
        }
        
        if (!text) return;

        setIsFetchingTTS(true);
        try {
             // Always use STT-detected language first → then dropdown → then en-IN
             const languageToSend = detectedLangCode 
                  || (selectedLanguage !== 'auto' ? selectedLanguage : 'en-IN');
             const res = await fetch('http://localhost:5001/api/tts', {
                 method: 'POST',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify({ text, target_language_code: languageToSend })
             });
             const data = await res.json();
             if (data.audio) {
                 const audioSrc = "data:audio/wav;base64," + data.audio;
                 const audio = new Audio(audioSrc);
                 audioRef.current = audio;
                 audio.onended = () => setIsPlayingTTS(false);
                 audio.play();
                 setIsPlayingTTS(true);
             } else {
                 setError("Failed to generate audio summary. Ensure speech service is running on port 5001.");
             }
        } catch (e) {
             console.error("TTS Error", e);
             setError("Failed to play audio summary. Ensure speech service is running on port 5001.");
        } finally {
             setIsFetchingTTS(false);
        }
    };

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
    const [translatedReport, setTranslatedReport] = useState(null);
    const [isTranslating, setIsTranslating] = useState(false);

    // ==========================================
    // TRANSLATE REPORT — uses Sarvam mayura:v1
    // ==========================================
    const translateText = async (text, targetLang) => {
        if (!text || targetLang === 'en-IN') return text;
        try {
            const res = await fetch('http://localhost:5001/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text,
                    source_language_code: 'en-IN',
                    target_language_code: targetLang
                })
            });
            const data = await res.json();
            return data.translated_text || text;
        } catch {
            return text;
        }
    };

    const translateReport = async (report, targetLang) => {
        if (!report || targetLang === 'en-IN') return null;
        setIsTranslating(true);
        try {
            const [summary, advice] = await Promise.all([
                translateText(report.summary || '', targetLang),
                translateText(report.advice || '', targetLang)
            ]);

            // Translate conditions and next_steps arrays
            const conditions = report.conditions?.length
                ? await Promise.all(report.conditions.map(c => translateText(c, targetLang)))
                : [];
            const next_steps = report.next_steps?.length
                ? await Promise.all(report.next_steps.map(s => translateText(s, targetLang)))
                : [];

            const translated = { summary, advice, conditions, next_steps };
            setTranslatedReport(translated);
            return translated;
        } catch (e) {
            console.error('Translation error:', e);
            return null;
        } finally {
            setIsTranslating(false);
        }
    };

    // Derived state
    const currentArea = FOCUS_AREAS.find(a => a.value === category) || FOCUS_AREAS[0];
    const isScanMode = currentArea.mode === 'scan';

    // ==========================================
    // SUBMIT HANDLER — routes to correct API
    // ==========================================
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (isScanMode && !file) {
            setError('Please upload a medical scan image for AI model analysis.');
            return;
        }
        if (!isScanMode && !symptoms.trim() && !file) {
            setError('Please describe your symptoms or upload a file.');
            return;
        }

        setError('');
        setIsSubmitting(true);
        
        try {
            let data;

            if (isScanMode) {
                // ─── AI MODEL PATH ────────────────────────
                // Image → Python .h5 model → Groq report
                const formData = new FormData();
                formData.append('scanType', category);
                formData.append('scanImage', file);
                formData.append('symptoms', symptoms);
                formData.append('durationDays', Number(days));

                const res = await fetch('http://localhost:5000/api/ai-scan', {
                    method: 'POST',
                    body: formData,
                });
                data = await res.json();
                if (!res.ok) throw new Error(data.error || 'AI model analysis failed');

            } else {
                // ─── SYMPTOM PATH ─────────────────────────
                // Text symptoms → Groq API directly
                const formData = new FormData();
                formData.append('category', category);
                formData.append('durationDays', Number(days));
                formData.append('symptoms', symptoms);
                if (file) formData.append('telemetryFile', file);

                const res = await fetch('http://localhost:5000/api/diagnose', {
                    method: 'POST',
                    body: formData,
                });
                data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Symptom analysis failed');
            }

            setReportData(data);

            // Build full report text for TTS reading
            const buildReportText = (report) => {
                const parts = [];
                if (report.summary) parts.push(report.summary);
                if (report.conditions?.length) {
                    parts.push('Detected conditions: ' + report.conditions.join(', ') + '.');
                }
                if (report.advice) parts.push(report.advice);
                if (report.next_steps?.length) {
                    parts.push('Next steps: ' + report.next_steps.join('. ') + '.');
                }
                return parts.join(' ') || '';
            };

            // Determine target language for translation
            const targetLang = detectedLangCode 
                || (selectedLanguage !== 'auto' ? selectedLanguage : 'en-IN');

            if (targetLang !== 'en-IN') {
                // Translate report then auto-speak full translated report
                const translated = await translateReport(data, targetLang);
                if (translated) {
                    const fullText = buildReportText(translated);
                    if (fullText) setTimeout(() => handleTTS(fullText), 500);
                }
            } else {
                // English — auto-speak full original report
                const fullText = buildReportText(data);
                if (fullText) {
                    setTimeout(() => handleTTS(fullText), 500);
                }
            }

        } catch (err) {
            setError(err.message || 'Analysis failed. Please try again.');
            console.error('Analysis error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    // ==========================================
    // PDF DOWNLOAD
    // ==========================================
    const handleDownloadReport = async () => {
        setIsDownloading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:5000/api/diagnose/report', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ category, days, symptoms, report: reportData }),
            });

            if (!response.ok) throw new Error('Failed to generate report.');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `MoveToHeal_Report_${new Date().toISOString().split('T')[0]}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);

        } catch (err) {
            setError('Could not download the report. Please try again.');
        } finally {
            setIsDownloading(false);
        }
    };

    // ==========================================
    // RESET
    // ==========================================
    const resetScan = () => {
        setReportData(null);
        setSymptoms('');
        setDays(1);
        setFile(null);
        setCategory('general');
        setError('');
        setSelectedLanguage('auto');
        setDetectedLangCode('');
        setDetectedLangLabel('');
        setTranslatedReport(null);
        setIsTranslating(false);
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
                <h2 className="text-3xl font-black text-[#EAEAEA] mb-3 tracking-widest uppercase">
                    Analyzing...
                </h2>
                <p className="text-[#08D9D6] font-mono animate-pulse text-center">
                    Processing your {currentArea.label.toLowerCase()} report...<br/>
                    This usually takes a few seconds.
                </p>
            </div>
        );
    }

    // ==========================================
    // STATE 3: DETAILED REPORT UI
    // ==========================================
    if (reportData) {
        const riskString = reportData.risk_level || 'Unknown';
        const isHighRisk = riskString.includes('High') || riskString.includes('Medium');
        const accentColor = isHighRisk ? 'text-[#FF2E63] border-[#FF2E63]' : 'text-[#08D9D6] border-[#08D9D6]';
        const bgColor = isHighRisk ? 'bg-[#FF2E63]/10' : 'bg-[#08D9D6]/10';
        const modelResult = reportData.ai_model_result; // only present for scan mode

        return (
            <div className="w-full max-w-5xl mx-auto py-12 px-6 lg:px-12 relative z-10 min-h-screen animate-[fadeIn_0.5s_ease-in-out]">
                
                {error && (
                    <div className="bg-[#FF2E63]/10 border border-[#FF2E63] text-[#FF2E63] px-4 py-3 rounded mb-8 text-sm font-medium">
                        <AlertTriangle size={20} className="inline mr-2 -mt-1" /> {error}
                    </div>
                )}

                {/* Translation in progress indicator */}
                {isTranslating && (
                    <div className="bg-[#a855f7]/10 border border-[#a855f7]/30 text-[#a855f7] px-4 py-3 rounded mb-8 text-sm font-medium flex items-center gap-3">
                        <Loader2 size={18} className="animate-spin" /> Translating report to {detectedLangLabel || 'detected language'}...
                    </div>
                )}

                {/* Header & Risk Badge */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[#EAEAEA]/10 pb-6 mb-10 gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-[#EAEAEA] mb-2 flex items-center gap-3">
                            <Activity className={accentColor} size={36} /> Diagnostic Report
                        </h1>
                        <p className="text-[#EAEAEA]/50 text-sm tracking-widest uppercase">
                            {currentArea.label} | Confidence: <span className="text-[#08D9D6]">{reportData.confidence || 'N/A'}</span>
                        </p>
                    </div>
                    <div className={`px-8 py-3 border-2 ${accentColor} ${bgColor} rounded-lg font-black tracking-widest uppercase shadow-[0_0_20px_currentColor] flex items-center gap-2`}>
                        {isHighRisk && <ShieldAlert size={20} />}
                        {riskString}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {/* Left Column */}
                    <div className="md:col-span-2 space-y-6">

                        {/* AI Model Prediction Card — only for scan mode */}
                        {modelResult && (
                            <div className="border-2 border-[#a855f7]/30 bg-[#a855f7]/10 rounded-xl p-8 backdrop-blur-md">
                                <h2 className="text-[#a855f7] text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Zap size={16} /> AI Model Prediction
                                </h2>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-[#EAEAEA] text-2xl font-black">{modelResult.prediction}</span>
                                    <span className="px-4 py-2 rounded-full font-bold text-sm bg-[#a855f7]/20 text-[#a855f7]">
                                        {modelResult.confidence}% confidence
                                    </span>
                                </div>
                                {modelResult.class_probabilities && (
                                    <div className="space-y-3 mt-4">
                                        <p className="text-[#EAEAEA]/50 text-xs uppercase tracking-widest font-bold">Class Probabilities</p>
                                        {Object.entries(modelResult.class_probabilities)
                                            .sort(([,a], [,b]) => b - a)
                                            .map(([label, prob]) => (
                                            <div key={label} className="flex items-center gap-3">
                                                <span className="text-[#EAEAEA]/70 text-sm w-48 truncate">{label}</span>
                                                <div className="flex-1 bg-[#252A34] rounded-full h-2.5 overflow-hidden">
                                                    <div className="h-full rounded-full transition-all duration-1000"
                                                         style={{ width: `${prob}%`, background: label === modelResult.prediction ? '#a855f7' : '#EAEAEA30' }} />
                                                </div>
                                                <span className="text-[#EAEAEA]/50 text-xs font-mono w-14 text-right">{prob}%</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Summary */}
                        <div className="bg-[#1A1D24]/80 border border-[#EAEAEA]/10 p-8 rounded-xl backdrop-blur-md">
                            <div className="flex justify-between items-center mb-3">
                                <h2 className="text-[#EAEAEA]/50 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                    <FileText size={16} className="text-[#08D9D6]" /> Executive Summary
                                </h2>
                                <button
                                    onClick={() => handleTTS(translatedReport?.summary || reportData.summary || 'No summary provided.')}
                                    disabled={isFetchingTTS}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-bold text-xs uppercase tracking-widest transition-all ${
                                        isPlayingTTS 
                                        ? 'bg-[#a855f7]/20 text-[#a855f7] border border-[#a855f7]/50'
                                        : 'bg-[#08D9D6]/10 text-[#08D9D6] border border-[#08D9D6]/30 hover:bg-[#08D9D6] hover:text-[#252A34]'
                                    }`}
                                >
                                    {isFetchingTTS ? (
                                        <Loader2 size={14} className="animate-spin" />
                                    ) : isPlayingTTS ? (
                                        <StopCircle size={14} />
                                    ) : (
                                        <Volume2 size={14} />
                                    )}
                                    {isFetchingTTS ? 'Loading...' : isPlayingTTS ? 'Stop Audio' : 'Play Audio'}
                                </button>
                            </div>
                            <p className="text-[#EAEAEA]/90 leading-relaxed text-lg">
                                {translatedReport?.summary || reportData.summary || 'No summary provided.'}
                            </p>
                            {translatedReport?.summary && (
                                <p className="text-[#EAEAEA]/40 leading-relaxed text-sm mt-3 italic border-t border-[#EAEAEA]/10 pt-3">
                                    {reportData.summary}
                                </p>
                            )}
                        </div>

                        {/* Conditions & Specialists */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="bg-[#1A1D24]/80 border border-[#EAEAEA]/10 p-6 rounded-xl">
                                <h2 className="text-[#EAEAEA]/50 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Activity size={16} className="text-[#FF2E63]" /> Detected Pathology
                                </h2>
                                <ul className="space-y-3">
                                    {((translatedReport?.conditions?.length ? translatedReport.conditions : reportData.conditions) || []).length > 0 ? (
                                        ((translatedReport?.conditions?.length ? translatedReport.conditions : reportData.conditions) || []).map((c, i) => (
                                            <li key={i} className="flex items-start gap-3 text-[#EAEAEA] font-medium">
                                                <span className={`mt-1.5 w-2 h-2 rounded-full ${isHighRisk ? 'bg-[#FF2E63]' : 'bg-[#08D9D6]'}`}></span>
                                                {c}
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
                                    {(reportData.specialists || []).length > 0 ? (
                                        reportData.specialists.map((s, i) => (
                                            <li key={i} className="flex items-center gap-3 text-[#EAEAEA] font-medium">
                                                <CheckCircle2 size={16} className="text-[#08D9D6]/50" />
                                                {s}
                                            </li>
                                        ))
                                    ) : (
                                        <li className="text-[#EAEAEA]/50 italic">No specialist recommendations.</li>
                                    )}
                                </ul>
                            </div>
                        </div>

                        {/* Action Plan */}
                        <div className={`border-l-4 ${accentColor} ${bgColor} p-8 rounded-r-xl backdrop-blur-sm`}>
                            <h2 className={`text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2 ${accentColor}`}>
                                <ListChecks size={18} /> Immediate Action Plan
                            </h2>
                            <p className="text-[#EAEAEA] font-bold text-lg mb-4">
                                {translatedReport?.advice || reportData.advice || 'Please consult a healthcare professional.'}
                            </p>
                            <ul className="space-y-3">
                                {((translatedReport?.next_steps?.length ? translatedReport.next_steps : reportData.next_steps) || []).length > 0 ? (
                                    ((translatedReport?.next_steps?.length ? translatedReport.next_steps : reportData.next_steps) || []).map((step, i) => (
                                        <li key={i} className="flex items-start gap-3 text-[#EAEAEA]/80">
                                            <span className="text-sm font-mono opacity-50 mt-0.5">0{i + 1}.</span>
                                            {step}
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-[#EAEAEA]/50 italic">No immediate steps provided.</li>
                                )}
                            </ul>
                        </div>
                    </div>

                    {/* Right Column: Metadata */}
                    <div className="space-y-6">
                        <div className="bg-[#1A1D24] border border-[#EAEAEA]/10 p-6 rounded-xl shadow-inner">
                            <h3 className="text-[#EAEAEA]/50 text-xs font-bold uppercase tracking-widest mb-4 border-b border-[#EAEAEA]/10 pb-3">
                                Input Summary
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs text-[#EAEAEA]/40 uppercase tracking-widest mb-1">Focus Area</p>
                                    <p className="text-[#08D9D6] font-bold">{currentArea.label}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-[#EAEAEA]/40 uppercase tracking-widest mb-1">Analysis Mode</p>
                                    <p className="text-[#a855f7] font-bold text-sm">{isScanMode ? '🧠 AI Model Scan' : '💬 Symptom Analysis'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-[#EAEAEA]/40 uppercase tracking-widest mb-1">Duration</p>
                                    <p className="text-[#08D9D6] font-bold">
                                        {days} {days == 1 ? 'Day' : 'Days'}{days == 30 ? '+' : ''}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-[#EAEAEA]/40 uppercase tracking-widest mb-1">
                                        {isScanMode ? 'Patient Notes' : 'Symptom Data'}
                                    </p>
                                    <p className="text-[#EAEAEA]/80 italic text-sm">
                                        "{symptoms || 'No text provided.'}"
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-[#EAEAEA]/40 uppercase tracking-widest mb-1">Uploaded File</p>
                                    <p className="text-[#EAEAEA]/80 text-sm">
                                        {file ? file.name : 'None'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Disclaimer */}
                        <div className="bg-[#252A34] p-5 rounded-xl border border-[#EAEAEA]/5">
                            <p className="text-[10px] text-[#EAEAEA]/40 uppercase tracking-widest text-center leading-relaxed">
                                MoveToHeal AI is an informational tool. It does not provide medical diagnosis or replace professional consultation. Always seek advice from a qualified physician.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Saved to History Badge */}
                {reportData._id && (
                    <div className="flex items-center justify-center gap-3 mb-6 py-3 px-6 bg-emerald-500/10 border border-emerald-500/30 rounded-xl w-fit mx-auto">
                        <CheckCircle2 size={18} className="text-emerald-400" />
                        <span className="text-emerald-400 text-sm font-bold uppercase tracking-widest">Saved to History</span>
                    </div>
                )}

                {/* Bottom Actions */}
                <div className="border-t border-[#EAEAEA]/10 pt-8 flex flex-col sm:flex-row justify-center gap-6">
                    <button 
                        onClick={resetScan}
                        className="px-10 py-4 border-2 border-[#EAEAEA]/20 text-[#EAEAEA] font-bold uppercase tracking-widest rounded-xl hover:border-[#08D9D6] hover:text-[#08D9D6] transition-all"
                    >
                        New Analysis
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

                    <button 
                        onClick={() => navigate('/history')}
                        className="px-10 py-4 border-2 border-[#EAEAEA]/20 text-[#EAEAEA] font-bold uppercase tracking-widest rounded-xl hover:border-[#a855f7] hover:text-[#a855f7] transition-all flex items-center justify-center gap-3"
                    >
                        <History size={20} />
                        View All History
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
            
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#08D9D6]/5 blur-[120px] rounded-full -z-10 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#FF2E63]/5 blur-[100px] rounded-full -z-10 pointer-events-none"></div>
            
            <div className="mb-12 border-b border-[#EAEAEA]/10 pb-8">
                <h1 className="text-4xl md:text-5xl font-black text-[#EAEAEA] mb-3 tracking-tight">Start Diagnosis</h1>
                <p className="text-[#EAEAEA]/50 text-sm">Tell us what's going on or upload a medical scan — we'll generate a detailed report.</p>
            </div>

            {error && (
                <div className="bg-[#FF2E63]/10 border border-[#FF2E63] text-[#FF2E63] px-4 py-3 rounded mb-8 text-sm font-medium">
                    <AlertTriangle size={20} className="inline mr-2 -mt-1" /> {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* Language Selection */}
                <div className="bg-[#1A1D24]/50 border border-[#EAEAEA]/10 p-6 rounded-2xl backdrop-blur-sm flex flex-col justify-center">
                    <label className="text-sm font-bold uppercase tracking-widest text-[#EAEAEA]/70 mb-3 flex items-center gap-2">
                        <Volume2 size={18} className="text-[#08D9D6]" /> Preferred Language
                    </label>
                    <select 
                        value={selectedLanguage}
                        onChange={(e) => { setSelectedLanguage(e.target.value); setDetectedLangLabel(''); setDetectedLangCode(''); }}
                        className="w-full bg-[#252A34] border border-[#EAEAEA]/20 rounded-xl p-4 text-[#EAEAEA] font-medium focus:outline-none focus:border-[#08D9D6] focus:ring-1 focus:ring-[#08D9D6] transition-all cursor-pointer"
                    >
                        {LANGUAGES.map(lang => (
                            <option key={lang.value} value={lang.value}>{lang.label}</option>
                        ))}
                    </select>
                    {detectedLangLabel && (
                        <p className="text-xs text-[#08D9D6] mt-2 flex items-center gap-1.5">
                            <CheckCircle2 size={12} /> Detected: <span className="font-bold">{detectedLangLabel}</span> — report audio will play in this language
                        </p>
                    )}
                </div>

                {/* Row: Focus Area and Duration */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* What area? */}
                    <div className="bg-[#1A1D24]/50 border border-[#EAEAEA]/10 p-6 rounded-2xl backdrop-blur-sm flex flex-col justify-center">
                        <label className="text-sm font-bold uppercase tracking-widest text-[#EAEAEA]/70 mb-3 flex items-center gap-2">
                            <Dna size={18} className="text-[#08D9D6]" /> What area?
                        </label>
                        <select 
                            value={category}
                            onChange={(e) => { setCategory(e.target.value); setFile(null); setError(''); }}
                            className="w-full bg-[#252A34] border border-[#EAEAEA]/20 rounded-xl p-4 text-[#EAEAEA] font-medium focus:outline-none focus:border-[#08D9D6] focus:ring-1 focus:ring-[#08D9D6] transition-all cursor-pointer"
                        >
                            <optgroup label="Describe Symptoms">
                                {FOCUS_AREAS.filter(a => a.mode === 'symptom').map(area => (
                                    <option key={area.value} value={area.value}>{area.label}</option>
                                ))}
                            </optgroup>
                            <optgroup label="Upload a Scan / Photo">
                                {FOCUS_AREAS.filter(a => a.mode === 'scan').map(area => (
                                    <option key={area.value} value={area.value}>{area.label}</option>
                                ))}
                            </optgroup>
                        </select>
                    </div>

                    {/* Duration Slider */}
                    <div className="bg-[#1A1D24]/50 border border-[#EAEAEA]/10 p-6 rounded-2xl backdrop-blur-sm flex flex-col justify-center">
                        <div className="flex justify-between items-end mb-4">
                            <label className="text-sm font-bold uppercase tracking-widest text-[#EAEAEA]/70 flex items-center gap-2">
                                <Clock size={18} className="text-[#08D9D6]" /> Duration
                            </label>
                            <span className="text-[#08D9D6] font-black text-2xl leading-none">
                                {days} <span className="text-sm text-[#EAEAEA]/50 font-normal uppercase tracking-widest">
                                    {days == 1 ? 'Day' : 'Days'}{days == 30 ? '+' : ''}
                                </span>
                            </span>
                        </div>
                        <input
                            type="range" min="1" max="30" value={days}
                            onChange={(e) => setDays(e.target.value)}
                            className="w-full h-2 bg-[#252A34] rounded-lg appearance-none cursor-pointer accent-[#08D9D6]"
                        />
                        <div className="flex justify-between text-xs text-[#EAEAEA]/30 mt-3 font-bold uppercase tracking-widest">
                            <span>1 Day</span>
                            <span>30+ Days</span>
                        </div>
                    </div>
                </div>

                {/* Describe it */}
                <div className="bg-[#1A1D24]/50 border border-[#EAEAEA]/10 p-8 rounded-2xl backdrop-blur-sm">
                    <div className="flex justify-between items-center mb-4">
                        <label className="text-sm font-bold uppercase tracking-widest text-[#EAEAEA]/70 flex items-center gap-2">
                            <MessageSquareText size={18} className="text-[#08D9D6]" /> 
                            {isScanMode ? 'Anything else we should know?' : 'What are you experiencing?'}
                        </label>
                        <button 
                            type="button"
                            onClick={toggleRecording}
                            disabled={isProcessingAudio}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition-all ${
                                isRecording 
                                ? 'bg-[#FF2E63]/20 text-[#FF2E63] border border-[#FF2E63]/50 animate-pulse' 
                                : isProcessingAudio
                                    ? 'bg-[#08D9D6]/10 text-[#08D9D6]/50 border border-[#08D9D6]/20 cursor-not-allowed'
                                    : 'bg-[#08D9D6]/10 text-[#08D9D6] border border-[#08D9D6]/30 hover:bg-[#08D9D6] hover:text-[#252A34]'
                            }`}
                        >
                            {isProcessingAudio ? (
                                <><Loader2 size={14} className="animate-spin" /> Processing...</>
                            ) : isRecording ? (
                                <><StopCircle size={14} /> Stop Recording</>
                            ) : (
                                <><Mic size={14} /> Voice Input</>
                            )}
                        </button>
                    </div>
                    <textarea
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                        rows={isScanMode ? 3 : 5}
                        className="w-full bg-[#252A34] border border-[#EAEAEA]/20 rounded-xl p-5 text-[#EAEAEA] text-lg focus:outline-none focus:border-[#08D9D6] focus:ring-1 focus:ring-[#08D9D6] transition-all resize-none shadow-inner placeholder:text-[#EAEAEA]/30"
                        placeholder={isScanMode 
                            ? 'Optional — add any symptoms or context here...' 
                            : "E.g., 'I've had a sharp pain in my lower back for 3 days...'"
                        }
                    />
                </div>

                {/* Upload */}
                <div className="bg-[#1A1D24]/50 border border-[#EAEAEA]/10 p-8 rounded-2xl backdrop-blur-sm">
                    <label className="text-sm font-bold uppercase tracking-widest text-[#EAEAEA]/70 mb-4 flex items-center gap-2">
                        <Camera size={18} className="text-[#08D9D6]" /> 
                        {isScanMode ? 'Upload your scan / photo' : 'Attach a file (optional)'}
                    </label>
                    <FileUpload file={file} setFile={setFile} />
                    {isScanMode && !file && (
                        <p className="text-xs text-[#FF2E63]/70 mt-3">* A scan or photo is required for this area.</p>
                    )}
                </div>

                {/* Submit */}
                <div className="pt-6 border-t border-[#EAEAEA]/10">
                    <button 
                        type="submit" 
                        disabled={isScanMode ? !file : (!symptoms.trim() && !file)}
                        className="w-full md:w-auto px-16 py-5 bg-[#08D9D6] text-[#252A34] font-black uppercase tracking-widest rounded-xl hover:bg-[#08D9D6]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-3 shadow-[0_0_20px_rgba(8,217,214,0.3)] hover:shadow-[0_0_40px_rgba(8,217,214,0.5)] text-lg"
                    >
                        Get My Report
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Diagnose;