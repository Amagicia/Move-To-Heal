import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    Download, RefreshCw, FileText, Activity, Clock, 
    Loader2, AlertTriangle, Inbox, Search, Filter, Send 
} from 'lucide-react';

const API_BASE = 'http://localhost:5000';

const TYPE_LABELS = {
    general:     'General Health',
    respiratory: 'Breathing & Lungs',
    cardiology:  'Heart & Chest',
    dermatology: 'Skin & Rashes',
    brain:       'Brain (MRI)',
    chest:       'Chest (X-Ray)',
    skin:        'Skin (Photo)',
    neurology:   'Neurology',
};

const History = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [downloading, setDownloading] = useState(null);
    
    // --- NEW STATES FOR FILTERING & ESCALATION ---
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRisk, setFilterRisk] = useState('all');
    const [filterArea, setFilterArea] = useState('all');
    const [escalating, setEscalating] = useState(null);

    const fetchHistory = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${API_BASE}/api/history`);
            if (!res.ok) throw new Error('Failed to fetch history');
            const data = await res.json();
            setHistory(data);
        } catch (err) {
            setError(err.message || 'Could not load history.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchHistory(); }, []);

    const handleDownload = async (id) => {
        setDownloading(id);
        try {
            const res = await fetch(`${API_BASE}/api/history/${id}/report`, {
                method: 'POST',
            });
            if (!res.ok) throw new Error('PDF generation failed');
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `MoveToHeal_Report_${id}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Download error:', err);
            setError('Failed to download report. Please try again.');
        } finally {
            setDownloading(null);
        }
    };

    // --- NEW: HOSPITAL ESCALATION LOGIC ---
    const handleEscalate = async (scan) => {
        setEscalating(scan._id);
        try {
            // Mocking the escalation to a hospital dashboard
            const res = await fetch(`${API_BASE}/api/hospital/escalate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    scanId: scan._id,
                    patientData: scan,
                    priority: 'CRITICAL_HIGH_RISK',
                    timestamp: new Date().toISOString()
                }),
            });
            if (!res.ok) throw new Error('Escalation failed');
            alert(`SUCCESS: Case ${scan._id.slice(-6)} transmitted to Head Hospital Dashboard.`);
        } catch (err) {
            setError('Hospital transmission failed. Ensure manual contact.');
        } finally {
            setEscalating(null);
        }
    };

    // --- SEARCH & FILTER COMPUTATION ---
    const filteredHistory = history.filter(item => {
        const matchesSearch = (item._id + (item.symptoms || '') + item.type).toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRisk = filterRisk === 'all' || (item.risk_level || '').toLowerCase().includes(filterRisk.toLowerCase());
        const matchesArea = filterArea === 'all' || item.type === filterArea;
        return matchesSearch && matchesRisk && matchesArea;
    });

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        const now = new Date();
        const diffMs = now - d;
        const diffMin = Math.floor(diffMs / 60000);
        const diffHr  = Math.floor(diffMs / 3600000);
        if (diffMin < 1)  return 'Just now';
        if (diffMin < 60) return `${diffMin}m ago`;
        if (diffHr < 24)  return `${diffHr}h ago`;
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const getRiskBadge = (risk) => {
        const r = (risk || '').toLowerCase();
        if (r.includes('high'))   return 'text-[#FF2E63] border-[#FF2E63]/30 bg-[#FF2E63]/10';
        if (r.includes('medium')) return 'text-amber-400 border-amber-400/30 bg-amber-400/10';
        return 'text-[#08D9D6] border-[#08D9D6]/30 bg-[#08D9D6]/10';
    };

    const getModeBadge = (mode) => {
        if (mode === 'scan') return { label: 'AI Scan', color: 'text-[#a855f7] bg-[#a855f7]/10 border-[#a855f7]/30' };
        return { label: 'Symptom', color: 'text-[#08D9D6] bg-[#08D9D6]/10 border-[#08D9D6]/30' };
    };

    return (
        <div className="w-full max-w-6xl mx-auto py-12 px-6 lg:px-12 relative z-10 min-h-screen">
            {/* Header */}
            <div className="mb-12 border-b border-[#EAEAEA]/10 pb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black text-[#EAEAEA] mb-3 tracking-tight">Diagnostic Logs</h1>
                    <p className="text-[#08D9D6] tracking-widest uppercase text-sm font-bold">
                        Historical Telemetry & Reports
                        {history.length > 0 && (
                            <span className="text-[#EAEAEA]/40 ml-3">— {history.length} records</span>
                        )}
                    </p>
                </div>
                <div className="flex gap-3">
                    <button onClick={fetchHistory} disabled={loading} className="px-5 py-3 bg-[#252A34] border border-[#EAEAEA]/20 text-[#EAEAEA]/70 font-bold rounded-lg hover:border-[#08D9D6] hover:text-[#08D9D6] transition-all text-sm uppercase tracking-wider flex items-center gap-2 disabled:opacity-50">
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh
                    </button>
                    <Link to="/diagnose" className="px-6 py-3 bg-[#08D9D6] text-[#252A34] font-bold rounded-lg hover:scale-105 transition-all text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(8,217,214,0.3)]">
                        + New Scan
                    </Link>
                </div>
            </div>

            {/* --- NEW: SEARCH & FILTER BAR --- */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="md:col-span-2 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#EAEAEA]/30" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search by ID or symptoms..."
                        className="w-full bg-[#1A1D24] border border-[#EAEAEA]/10 rounded-xl py-3 pl-12 pr-4 text-[#EAEAEA] focus:outline-none focus:border-[#08D9D6] transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select 
                    className="bg-[#1A1D24] border border-[#EAEAEA]/10 rounded-xl py-3 px-4 text-[#EAEAEA] focus:outline-none focus:border-[#08D9D6]"
                    onChange={(e) => setFilterRisk(e.target.value)}
                >
                    <option value="all">All Risk Levels</option>
                    <option value="high">High Risk</option>
                    <option value="medium">Medium Risk</option>
                    <option value="low">Low Risk</option>
                </select>
                <select 
                    className="bg-[#1A1D24] border border-[#EAEAEA]/10 rounded-xl py-3 px-4 text-[#EAEAEA] focus:outline-none focus:border-[#08D9D6]"
                    onChange={(e) => setFilterArea(e.target.value)}
                >
                    <option value="all">All Focus Areas</option>
                    {Object.keys(TYPE_LABELS).map(key => (
                        <option key={key} value={key}>{TYPE_LABELS[key]}</option>
                    ))}
                </select>
            </div>

            {error && (
                <div className="bg-[#FF2E63]/10 border border-[#FF2E63] text-[#FF2E63] px-4 py-3 rounded-xl mb-8 text-sm font-medium flex items-center gap-2">
                    <AlertTriangle size={18} /> {error}
                </div>
            )}

            {loading ? (
                <div className="flex flex-col items-center justify-center py-24">
                    <Loader2 size={48} className="text-[#08D9D6] animate-spin mb-6" />
                    <p className="text-[#EAEAEA]/50 uppercase tracking-widest text-sm font-bold">Loading History...</p>
                </div>
            ) : filteredHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <Inbox size={40} className="text-[#EAEAEA]/20 mb-6" />
                    <h2 className="text-2xl font-bold text-[#EAEAEA]/50 mb-3">No Results Found</h2>
                    <p className="text-[#EAEAEA]/30">Adjust your search or filters to see more records.</p>
                </div>
            ) : (
                <div className="bg-[#1A1D24]/80 border border-[#EAEAEA]/10 rounded-2xl backdrop-blur-md overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#252A34] border-b border-[#EAEAEA]/10">
                                    <th className="p-5 text-xs font-bold text-[#EAEAEA]/50 uppercase tracking-widest">Scan ID</th>
                                    <th className="p-5 text-xs font-bold text-[#EAEAEA]/50 uppercase tracking-widest">Date / Time</th>
                                    <th className="p-5 text-xs font-bold text-[#EAEAEA]/50 uppercase tracking-widest">Focus Area</th>
                                    <th className="p-5 text-xs font-bold text-[#EAEAEA]/50 uppercase tracking-widest">Risk Level</th>
                                    <th className="p-5 text-xs font-bold text-[#EAEAEA]/50 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#EAEAEA]/5">
                                {filteredHistory.map((scan) => {
                                    const modeBadge = getModeBadge(scan.mode);
                                    const isHighRisk = (scan.risk_level || '').toLowerCase().includes('high');

                                    return (
                                        <tr key={scan._id} className="hover:bg-[#252A34]/50 transition-colors group">
                                            <td className="p-5">
                                                <span className="text-xs font-mono text-[#EAEAEA]/50 bg-[#252A34] px-3 py-1.5 rounded-md border border-[#EAEAEA]/10">
                                                    {scan._id.slice(-8).toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="p-5">
                                                <span className="text-sm font-medium text-[#EAEAEA]">{formatDate(scan.createdAt)}</span>
                                            </td>
                                            <td className="p-5 text-sm text-[#EAEAEA]/80 font-medium">
                                                {TYPE_LABELS[scan.type] || scan.type}
                                            </td>
                                            <td className="p-5">
                                                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border ${getRiskBadge(scan.risk_level)}`}>
                                                    {scan.risk_level || 'Unknown'}
                                                </span>
                                            </td>
                                            <td className="p-5 text-right">
                                                <div className="flex items-center justify-end gap-3">
                                                    {/* ESCALATE BUTTON FOR HIGH RISK */}
                                                    {isHighRisk && (
                                                        <button 
                                                            onClick={() => handleEscalate(scan)}
                                                            disabled={escalating === scan._id}
                                                            className="flex items-center gap-2 px-4 py-2 bg-[#FF2E63]/10 border border-[#FF2E63]/30 text-[#FF2E63] font-bold rounded-lg hover:bg-[#FF2E63] hover:text-white transition-all text-xs uppercase tracking-wider"
                                                        >
                                                            {escalating === scan._id ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                                                            Escalate
                                                        </button>
                                                    )}
                                                    <button 
                                                        onClick={() => handleDownload(scan._id)}
                                                        className="flex items-center gap-2 px-4 py-2 bg-[#08D9D6]/10 border border-[#08D9D6]/30 text-[#08D9D6] font-bold rounded-lg hover:bg-[#08D9D6] hover:text-[#252A34] transition-all text-xs uppercase tracking-wider"
                                                    >
                                                        <Download size={14} /> PDF
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default History;