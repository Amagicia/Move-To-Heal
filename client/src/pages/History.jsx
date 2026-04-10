import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Download, RefreshCw, FileText, Activity, Clock, Loader2, AlertTriangle, Inbox } from 'lucide-react';

const API_BASE = 'http://localhost:5000';

// Label map for human-friendly display
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
    const [history, setHistory]     = useState([]);
    const [loading, setLoading]     = useState(true);
    const [error, setError]         = useState('');
    const [downloading, setDownloading] = useState(null); // track which ID is downloading

    // ─── Fetch history on mount ────────────────────────
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

    // ─── Download PDF for a specific record ────────────
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

    // ─── Format date ───────────────────────────────────
    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        const now = new Date();
        const diffMs = now - d;
        const diffMin = Math.floor(diffMs / 60000);
        const diffHr  = Math.floor(diffMs / 3600000);

        if (diffMin < 1)  return 'Just now';
        if (diffMin < 60) return `${diffMin}m ago`;
        if (diffHr < 24)  return `${diffHr}h ago`;

        return d.toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });
    };

    // ─── Risk badge color ──────────────────────────────
    const getRiskBadge = (risk) => {
        const r = (risk || '').toLowerCase();
        if (r.includes('high'))   return 'text-[#FF2E63] border-[#FF2E63]/30 bg-[#FF2E63]/10';
        if (r.includes('medium')) return 'text-amber-400 border-amber-400/30 bg-amber-400/10';
        return 'text-[#08D9D6] border-[#08D9D6]/30 bg-[#08D9D6]/10';
    };

    // ─── Mode badge ────────────────────────────────────
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
                            <span className="text-[#EAEAEA]/40 ml-3">— {history.length} record{history.length !== 1 ? 's' : ''}</span>
                        )}
                    </p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={fetchHistory}
                        disabled={loading}
                        className="px-5 py-3 bg-[#252A34] border border-[#EAEAEA]/20 text-[#EAEAEA]/70 font-bold rounded-lg hover:border-[#08D9D6] hover:text-[#08D9D6] transition-all text-sm uppercase tracking-wider flex items-center gap-2 disabled:opacity-50"
                    >
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                        Refresh
                    </button>
                    <Link to="/diagnose" className="px-6 py-3 bg-[#08D9D6]/10 border border-[#08D9D6]/30 text-[#08D9D6] font-bold rounded-lg hover:bg-[#08D9D6] hover:text-[#252A34] transition-all text-sm uppercase tracking-wider">
                        + New Scan
                    </Link>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="bg-[#FF2E63]/10 border border-[#FF2E63] text-[#FF2E63] px-4 py-3 rounded-xl mb-8 text-sm font-medium flex items-center gap-2">
                    <AlertTriangle size={18} /> {error}
                    <button onClick={() => setError('')} className="ml-auto text-[#FF2E63]/70 hover:text-[#FF2E63]">✕</button>
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="flex flex-col items-center justify-center py-24">
                    <Loader2 size={48} className="text-[#08D9D6] animate-spin mb-6" />
                    <p className="text-[#EAEAEA]/50 uppercase tracking-widest text-sm font-bold">Loading History...</p>
                </div>
            )}

            {/* Empty State */}
            {!loading && history.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="w-24 h-24 rounded-full bg-[#1A1D24] border-2 border-[#EAEAEA]/10 flex items-center justify-center mb-6">
                        <Inbox size={40} className="text-[#EAEAEA]/20" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#EAEAEA]/50 mb-3">No Diagnostics Yet</h2>
                    <p className="text-[#EAEAEA]/30 mb-8 max-w-md">
                        Your diagnostic history will appear here after you run your first analysis. Each scan is saved automatically.
                    </p>
                    <Link to="/diagnose" className="px-8 py-4 bg-[#08D9D6] text-[#252A34] font-black uppercase tracking-widest rounded-xl hover:bg-[#08D9D6]/90 transition-all shadow-[0_0_15px_rgba(8,217,214,0.3)]">
                        Start Your First Scan
                    </Link>
                </div>
            )}

            {/* History Table */}
            {!loading && history.length > 0 && (
                <div className="bg-[#1A1D24]/80 border border-[#EAEAEA]/10 rounded-2xl backdrop-blur-md overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#252A34] border-b border-[#EAEAEA]/10">
                                    <th className="p-5 text-xs font-bold text-[#EAEAEA]/50 uppercase tracking-widest">Scan ID</th>
                                    <th className="p-5 text-xs font-bold text-[#EAEAEA]/50 uppercase tracking-widest">Date / Time</th>
                                    <th className="p-5 text-xs font-bold text-[#EAEAEA]/50 uppercase tracking-widest">Focus Area</th>
                                    <th className="p-5 text-xs font-bold text-[#EAEAEA]/50 uppercase tracking-widest">Mode</th>
                                    <th className="p-5 text-xs font-bold text-[#EAEAEA]/50 uppercase tracking-widest">Risk Level</th>
                                    <th className="p-5 text-xs font-bold text-[#EAEAEA]/50 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#EAEAEA]/5">
                                {history.map((scan) => {
                                    const modeBadge = getModeBadge(scan.mode);
                                    const isCurrentlyDownloading = downloading === scan._id;

                                    return (
                                        <tr key={scan._id} className="hover:bg-[#252A34]/50 transition-colors group">
                                            {/* ID */}
                                            <td className="p-5">
                                                <span className="text-xs font-mono text-[#EAEAEA]/50 bg-[#252A34] px-3 py-1.5 rounded-md border border-[#EAEAEA]/10">
                                                    {scan._id.slice(-8).toUpperCase()}
                                                </span>
                                            </td>

                                            {/* Date */}
                                            <td className="p-5">
                                                <div className="flex items-center gap-2">
                                                    <Clock size={14} className="text-[#EAEAEA]/30" />
                                                    <span className="text-sm font-medium text-[#EAEAEA]">{formatDate(scan.createdAt)}</span>
                                                </div>
                                            </td>

                                            {/* Focus Area */}
                                            <td className="p-5 text-sm text-[#EAEAEA]/80 font-medium">
                                                {TYPE_LABELS[scan.type] || scan.type}
                                            </td>

                                            {/* Mode Badge */}
                                            <td className="p-5">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${modeBadge.color}`}>
                                                    {modeBadge.label}
                                                </span>
                                            </td>

                                            {/* Risk */}
                                            <td className="p-5">
                                                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border ${getRiskBadge(scan.risk_level)}`}>
                                                    {scan.risk_level || 'Unknown'}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td className="p-5 text-right">
                                                <div className="flex items-center justify-end gap-3">
                                                    <button 
                                                        onClick={() => handleDownload(scan._id)}
                                                        disabled={isCurrentlyDownloading}
                                                        className="flex items-center gap-2 px-4 py-2 bg-[#08D9D6]/10 border border-[#08D9D6]/30 text-[#08D9D6] font-bold rounded-lg hover:bg-[#08D9D6] hover:text-[#252A34] transition-all text-xs uppercase tracking-wider disabled:opacity-50"
                                                    >
                                                        {isCurrentlyDownloading ? (
                                                            <Loader2 size={14} className="animate-spin" />
                                                        ) : (
                                                            <Download size={14} />
                                                        )}
                                                        {isCurrentlyDownloading ? 'Generating...' : 'PDF'}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer summary */}
                    <div className="border-t border-[#EAEAEA]/5 bg-[#252A34]/50 px-6 py-4 flex items-center justify-between">
                        <p className="text-xs text-[#EAEAEA]/30 uppercase tracking-widest flex items-center gap-2">
                            <FileText size={14} />
                            {history.length} diagnostic record{history.length !== 1 ? 's' : ''}
                        </p>
                        <p className="text-xs text-[#EAEAEA]/20 italic">
                            All scans are auto-saved • Download PDF for any record
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default History;