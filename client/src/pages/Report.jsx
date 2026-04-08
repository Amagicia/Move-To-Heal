import { useLocation, Link, Navigate } from 'react-router-dom';

const Report = () => {
  const location = useLocation();
  const data = location.state?.reportData;
  const originalSymptoms = location.state?.originalSymptoms;

  // Protect route if accessed directly without data
  if (!data) {
    return <Navigate to="/diagnose" replace />;
  }

  const isHighRisk = data.risk_level === 'High' || data.risk_level === 'Medium';
  const accentColor = isHighRisk ? 'text-[#FF2E63] border-[#FF2E63]' : 'text-[#08D9D6] border-[#08D9D6]';
  const bgColor = isHighRisk ? 'bg-[#FF2E63]/10' : 'bg-[#08D9D6]/10';

  return (
    <div className="max-w-4xl mx-auto py-16 px-6">
      
      <div className="flex justify-between items-end border-b border-[#EAEAEA]/10 pb-6 mb-10">
        <div>
          <h1 className="text-4xl font-bold text-[#EAEAEA] mb-2">Diagnostic Output</h1>
          <p className="text-[#EAEAEA]/50 text-sm tracking-widest uppercase">Analysis Complete</p>
        </div>
        <div className={`px-6 py-2 border-2 ${accentColor} ${bgColor} rounded font-black tracking-widest uppercase`}>
          Risk Level: {data.risk_level}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Main Findings */}
        <div className="md:col-span-2 space-y-8">
          <div className="bg-[#252A34] border border-[#EAEAEA]/20 p-8 rounded-xl">
            <h2 className="text-[#EAEAEA]/50 text-xs font-bold uppercase tracking-widest mb-4">Detected Conditions Pattern Match</h2>
            <ul className="space-y-3">
              {data.possible_conditions.map((condition, idx) => (
                <li key={idx} className="flex items-center gap-3 text-xl text-[#EAEAEA] font-medium">
                  <span className={`w-2 h-2 rounded-full ${isHighRisk ? 'bg-[#FF2E63]' : 'bg-[#08D9D6]'}`}></span>
                  {condition}
                </li>
              ))}
            </ul>
          </div>

          <div className={`border-l-4 ${accentColor} ${bgColor} p-8 rounded-r-xl`}>
            <h2 className={`text-xs font-bold uppercase tracking-widest mb-3 ${accentColor}`}>Required Action Plan</h2>
            <p className="text-[#EAEAEA] leading-relaxed text-lg">{data.advice}</p>
          </div>
        </div>

        {/* Sidebar Data */}
        <div className="space-y-6">
          <div className="bg-[#252A34] border border-[#EAEAEA]/10 p-6 rounded-xl shadow-inner">
            <h3 className="text-[#EAEAEA]/50 text-xs font-bold uppercase tracking-widest mb-3">Input Vector</h3>
            <p className="text-[#EAEAEA]/80 italic text-sm">"{originalSymptoms || 'Visual data strictly analyzed.'}"</p>
          </div>
          
          <Link 
            to="/diagnose" 
            className="block w-full text-center py-4 border-2 border-[#EAEAEA]/20 text-[#EAEAEA] font-bold uppercase tracking-widest rounded hover:border-[#08D9D6] hover:text-[#08D9D6] transition-all"
          >
            New Scan
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Report;