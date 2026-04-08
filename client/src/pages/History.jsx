import { Link } from 'react-router-dom';

const History = () => {
  // Mock data for past scans
  const scanHistory = [
    { id: 'SCN-8821', date: 'Today, 10:42 AM', focus: 'Cardiology', risk: 'High Risk', status: 'Pending Review' },
    { id: 'SCN-8704', date: 'Oct 14, 2023', focus: 'General', risk: 'Low Risk', status: 'Archived' },
    { id: 'SCN-8651', date: 'Sep 02, 2023', focus: 'Dermatology', risk: 'Medium Risk', status: 'Resolved' },
    { id: 'SCN-8110', date: 'Jun 11, 2023', focus: 'Respiratory', risk: 'Low Risk', status: 'Archived' },
  ];
  
  return (
    <div className="w-full max-w-6xl mx-auto py-12 px-6 lg:px-12 relative z-10 min-h-screen">
      
      <div className="mb-12 border-b border-[#EAEAEA]/10 pb-8 flex justify-between items-end">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-[#EAEAEA] mb-3 tracking-tight">Diagnostic Logs</h1>
          <p className="text-[#08D9D6] tracking-widest uppercase text-sm font-bold">Historical Telemetry & Reports</p>
        </div>
        <Link to="/diagnose" className="px-6 py-3 bg-[#08D9D6]/10 border border-[#08D9D6]/30 text-[#08D9D6] font-bold rounded-lg hover:bg-[#08D9D6] hover:text-[#252A34] transition-all text-sm uppercase tracking-wider hidden md:block">
          + New Scan
        </Link>
      </div>

      {/* History Table */}
      <div className="bg-[#1A1D24]/80 border border-[#EAEAEA]/10 rounded-2xl backdrop-blur-md overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#252A34] border-b border-[#EAEAEA]/10">
                <th className="p-6 text-xs font-bold text-[#EAEAEA]/50 uppercase tracking-widest">Scan ID</th>
                <th className="p-6 text-xs font-bold text-[#EAEAEA]/50 uppercase tracking-widest">Date / Time</th>
                <th className="p-6 text-xs font-bold text-[#EAEAEA]/50 uppercase tracking-widest">Focus Area</th>
                <th className="p-6 text-xs font-bold text-[#EAEAEA]/50 uppercase tracking-widest">Calculated Risk</th>
                <th className="p-6 text-xs font-bold text-[#EAEAEA]/50 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAEAEA]/5">
              {scanHistory.map((scan) => {
                const isHigh = scan.risk === 'High Risk';
                const isMed = scan.risk === 'Medium Risk';
                
                let badgeColor = 'text-[#08D9D6] border-[#08D9D6]/30 bg-[#08D9D6]/10';
                if (isHigh) badgeColor = 'text-[#FF2E63] border-[#FF2E63]/30 bg-[#FF2E63]/10';
                if (isMed) badgeColor = 'text-amber-400 border-amber-400/30 bg-amber-400/10';

                return (
                  <tr key={scan.id} className="hover:bg-[#252A34]/50 transition-colors group">
                    <td className="p-6 text-sm font-mono text-[#EAEAEA]/70">{scan.id}</td>
                    <td className="p-6 text-sm font-medium text-[#EAEAEA]">{scan.date}</td>
                    <td className="p-6 text-sm text-[#EAEAEA]/70">{scan.focus}</td>
                    <td className="p-6">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border ${badgeColor}`}>
                        {scan.risk}
                      </span>
                    </td>
                    <td className="p-6 text-right">
                      <button className="text-[#EAEAEA]/40 group-hover:text-[#08D9D6] font-bold text-sm tracking-wider uppercase transition-colors">
                        View Report
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default History;