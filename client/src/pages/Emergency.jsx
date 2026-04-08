import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, MapPin, AlertTriangle, X, ShieldAlert, Zap, Car, CheckCircle2, MessageSquare } from 'lucide-react';

const Emergency = () => {
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(10);
    const [location, setLocation] = useState('Acquiring GPS Signal...');
    const [coords, setCoords] = useState(null); // Store actual coords for the API
    
    // Advanced Dispatch States: 'idle' | 'dispatching' | 'confirmed'
    const [dispatchStatus, setDispatchStatus] = useState('idle');
    const [ambulanceData, setAmbulanceData] = useState(null);

    // --- SOUND EFFECTS ---
    // Make sure to add these audio files to your public/sounds directory
    const playAlertSound = () => {
        const audio = new Audio('/sounds/alert-siren.mp3'); 
        audio.play().catch(e => console.warn('Audio blocked by browser policy:', e));
    };

    const playSuccessSound = () => {
        const audio = new Audio('/sounds/success-chime.mp3'); 
        audio.play().catch(e => console.warn('Audio blocked by browser policy:', e));
    };

    // Countdown Timer
    useEffect(() => {
        if (countdown > 0 && dispatchStatus === 'idle') {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown, dispatchStatus]);

    // Geolocation
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
                    setLocation(`LAT: ${position.coords.latitude.toFixed(4)} | LNG: ${position.coords.longitude.toFixed(4)}`);
                },
                () => setLocation('Location Access Denied.')
            );
        } else {
            setLocation('GPS Not Supported.');
        }
    }, []);

    // --- FEATURE 1: The Zero-Voice API Integration ---
    const handleSilentDispatch = async () => {
        setDispatchStatus('dispatching');
        playAlertSound(); // Trigger immediate auditory feedback on click
        
        try {
            // ==========================================
            // REAL BACKEND API CALL (Commented out)
            // ==========================================
            /*
            const payload = {
                latitude: coords?.lat,
                longitude: coords?.lng,
                patientId: "usr_987654321", // Replace with actual user ID from your global state
                emergencyType: "High Risk Cardiac Event",
                timestamp: new Date().toISOString()
            };

            const response = await fetch('https://api.aegismed.com/v1/dispatch', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${yourAuthToken}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`Dispatch failed with status: ${response.status}`);
            }

            const data = await response.json();
            
            // Assuming the backend returns the vehicle details
            setAmbulanceData({
                eta: data.estimatedTimeOfArrival,
                vehicleId: data.vehiclePlate,
                paramedic: data.assignedParamedic,
                distance: data.distance
            });
            
            setDispatchStatus('confirmed');
            playSuccessSound(); // Play confirmation sound when data arrives
            */

            // ==========================================
            // MOCK FALLBACK (Remove when API is active)
            // ==========================================
            setTimeout(() => {
                setAmbulanceData({
                    eta: "4 Mins",
                    vehicleId: "MP-09-ER-4112",
                    paramedic: "Dr. Sharma (ICU Special)",
                    distance: "1.2 km away"
                });
                setDispatchStatus('confirmed');
                playSuccessSound(); // Play confirmation sound when data arrives
            }, 3000);

        } catch (error) {
            console.error("Critical System Failure: Unable to dispatch.", error);
            // In a real app, you would set an error state here and prompt the user to call 112 directly.
            setLocation("CONNECTION FAILED - CALL 112 DIRECTLY");
        }
    };

    // --- FEATURE 2: The Medical SMS Payload ---
    const handleSMSNotify = () => {
        const patientName = "John Doe";
        const bloodType = "O-";
        const gpsLink = coords ? `https://maps.google.com/?q=$${coords.lat},${coords.lng}` : "Location Unknown";
        
        const message = `🚨 EMERGENCY: ${patientName} requires immediate help. \n\nLocation: ${gpsLink}\nBlood: ${bloodType}\nAI Scan: High Risk Cardiac Event.\n\nPlease send help immediately.`;
        
        const smsUrl = `sms:?body=${encodeURIComponent(message)}`;
        window.open(smsUrl, '_blank');
    };

    return (
        <div className="fixed inset-0 z-[100] bg-[#1A0B10] flex flex-col items-center justify-center p-6 animate-fade-in overflow-hidden">
            
            {/* Background Warning Pulses */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] blur-[150px] rounded-full pointer-events-none transition-colors duration-1000 ${dispatchStatus === 'confirmed' ? 'bg-[#08D9D6]/20' : 'bg-[#FF2E63]/20 animate-pulse'}`}></div>

            {/* Cancel Button */}
            <button 
                onClick={() => navigate(-1)}
                className="absolute top-8 right-8 text-[#EAEAEA]/50 hover:text-[#EAEAEA] flex items-center gap-2 font-bold uppercase tracking-widest text-xs transition-all z-20"
            >
                <X size={20} /> Abort Override
            </button>

            <div className="w-full max-w-3xl relative z-10 text-center">
                
                {/* Urgent Icon Header */}
                <div className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(255,46,99,0.4)] transition-all ${dispatchStatus === 'confirmed' ? 'bg-[#08D9D6]/10 border-[#08D9D6]/30 shadow-[#08D9D6]/40' : 'bg-[#FF2E63]/10 border border-[#FF2E63]/30'}`}>
                    {dispatchStatus === 'confirmed' ? (
                         <CheckCircle2 size={48} className="text-[#08D9D6]" />
                    ) : (
                         <ShieldAlert size={48} className="text-[#FF2E63] animate-pulse" />
                    )}
                </div>

                <h1 className="text-4xl md:text-6xl font-black text-[#EAEAEA] mb-2 tracking-tighter">
                    {dispatchStatus === 'confirmed' ? 'AMBULANCE DISPATCHED' : (
                        <>EMERGENCY <span className="text-[#FF2E63]">PROTOCOL</span></>
                    )}
                </h1>
                <p className={`text-lg font-bold mb-10 uppercase tracking-widest ${dispatchStatus === 'confirmed' ? 'text-[#08D9D6]' : 'text-[#FF2E63]'}`}>
                    {dispatchStatus === 'confirmed' ? 'Help is on the way. Stay calm.' : 'Do not close this window.'}
                </p>

                {/* --- STATE: IDLE (Waiting for User Action) --- */}
                {dispatchStatus === 'idle' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 animate-fade-in">
                        {/* National Emergency */}
                        <a href="tel:112" className="glass-card bg-[#252A34]/50 border-[#EAEAEA]/10 p-8 rounded-3xl flex flex-col items-center justify-center group hover:border-[#EAEAEA]/30 transition-all">
                            <Phone size={32} className="text-[#EAEAEA]/70 mb-4" />
                            <h2 className="text-2xl font-black text-[#EAEAEA] mb-1">CALL 112</h2>
                            <p className="text-[#EAEAEA]/50 text-xs font-bold uppercase tracking-widest text-center">Standard Dispatch<br/>(Requires Speaking)</p>
                        </a>

                        {/* Zero-Voice Premium Dispatch */}
                        <button 
                            onClick={handleSilentDispatch}
                            className="glass-card bg-[#FF2E63]/10 border-[#FF2E63]/50 p-8 rounded-3xl flex flex-col items-center justify-center group hover:bg-[#FF2E63] hover:border-[#FF2E63] transition-all duration-300 cursor-pointer"
                        >
                            <Zap size={36} className="text-[#FF2E63] group-hover:text-white mb-4" />
                            <h2 className="text-2xl font-black text-[#EAEAEA] group-hover:text-white mb-1">SILENT SOS</h2>
                            <p className="text-[#EAEAEA]/60 group-hover:text-white/80 text-xs font-bold uppercase tracking-widest text-center">Auto-Dispatch ICU Unit<br/>(Uses GPS Coordinates)</p>
                        </button>
                    </div>
                )}

                {/* --- STATE: DISPATCHING (API Loading) --- */}
                {dispatchStatus === 'dispatching' && (
                    <div className="glass-card border-[#FF2E63]/30 p-12 rounded-3xl flex flex-col items-center justify-center mb-8 animate-fade-in">
                         <div className="w-16 h-16 border-4 border-[#FF2E63]/20 border-t-[#FF2E63] rounded-full animate-spin mb-6"></div>
                         <h3 className="text-xl font-bold text-[#EAEAEA] uppercase tracking-widest mb-2">Transmitting Coordinates...</h3>
                         <p className="text-[#FF2E63] font-mono text-sm">{location}</p>
                    </div>
                )}

                {/* --- STATE: CONFIRMED (API Success) --- */}
                {dispatchStatus === 'confirmed' && (
                    <div className="glass-card bg-[#08D9D6]/5 border-[#08D9D6]/30 p-8 rounded-3xl mb-8 animate-fade-in text-left">
                        <div className="flex items-center justify-between mb-6 border-b border-[#08D9D6]/20 pb-4">
                            <div className="flex items-center gap-3">
                                <Car size={24} className="text-[#08D9D6]" />
                                <span className="font-black text-[#EAEAEA] uppercase tracking-widest">ALS Unit Secured</span>
                            </div>
                            <span className="text-3xl font-black text-[#08D9D6]">{ambulanceData.eta}</span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-[#EAEAEA]/50 text-xs font-bold uppercase tracking-widest mb-1">Vehicle Plate</p>
                                <p className="text-lg font-mono text-[#EAEAEA]">{ambulanceData.vehicleId}</p>
                            </div>
                            <div>
                                <p className="text-[#EAEAEA]/50 text-xs font-bold uppercase tracking-widest mb-1">Lead Paramedic</p>
                                <p className="text-lg font-bold text-[#EAEAEA]">{ambulanceData.paramedic}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- BOTTOM ACTIONS (Location & SMS) --- */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
                    <div className="flex items-center gap-2 px-6 py-3 bg-[#252A34]/50 border border-[#EAEAEA]/10 rounded-full text-sm font-mono text-[#08D9D6]">
                         <MapPin size={16} /> {location}
                    </div>
                    
                    <button 
                        onClick={handleSMSNotify}
                        className="flex items-center gap-2 px-6 py-3 bg-[#EAEAEA] text-[#252A34] border border-[#EAEAEA] rounded-full text-sm font-bold uppercase tracking-widest hover:bg-transparent hover:text-[#EAEAEA] transition-all"
                    >
                         <MessageSquare size={16} /> Text Contacts
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Emergency;