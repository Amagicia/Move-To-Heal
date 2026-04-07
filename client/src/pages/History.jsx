import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ChevronRight, Search, Filter } from 'lucide-react';
import { Card } from '../components/Card';

const mockHistory = [
  { id: 1, date: 'Oct 24, 2024', type: 'skin', condition: 'Benign Nevus', risk: 'low' },
  { id: 2, date: 'Sep 15, 2024', type: 'general', condition: 'Viral Infection', risk: 'medium' },
  { id: 3, date: 'Aug 02, 2024', type: 'xray', condition: 'Clear Lungs', risk: 'low' },
  { id: 4, date: 'May 18, 2024', type: 'tumor', condition: 'Suspicious Mass', risk: 'high' }
];

const History = () => {
  const navigate = useNavigate();
  const listRef = useRef();
  const headerRef = useRef();

  useGSAP(() => {
    gsap.fromTo(headerRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 });
    
    gsap.fromTo(
      listRef.current.children,
      { x: -20, opacity: 0 },
      { x: 0, opacity: 1, stagger: 0.1, duration: 0.5, ease: 'power2.out', delay: 0.2 }
    );
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div ref={headerRef} className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">Diagnostic History</h1>
          <p className="text-lg text-slate-500 mt-2">Review your past clinical reports and AI evaluations.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-primary transition-colors" />
            <input type="text" placeholder="Search history..." className="input-field py-3 pl-12 pr-4 bg-white" />
          </div>
          <button className="btn-secondary py-3 px-4 flex items-center gap-2">
            <Filter className="w-5 h-5" /> Filter
          </button>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="py-5 px-8 font-bold text-slate-400 uppercase tracking-widest text-xs">Date</th>
                <th className="py-5 px-8 font-bold text-slate-400 uppercase tracking-widest text-xs">Category</th>
                <th className="py-5 px-8 font-bold text-slate-400 uppercase tracking-widest text-xs">Diagnosis</th>
                <th className="py-5 px-8 font-bold text-slate-400 uppercase tracking-widest text-xs">Risk</th>
                <th className="py-5 px-8 font-bold text-slate-400 uppercase tracking-widest text-xs text-right">Action</th>
              </tr>
            </thead>
            <tbody ref={listRef} className="divide-y divide-slate-50">
              {mockHistory.map((record) => (
                <tr 
                  key={record.id} 
                  onClick={() => navigate('/report', { state: { scanType: record.type } })}
                  className="hover:bg-primary/5 transition-colors cursor-pointer group"
                >
                  <td className="py-6 px-8 text-slate-500 font-medium whitespace-nowrap">
                    {record.date}
                  </td>
                  <td className="py-6 px-8">
                    <span className="capitalize px-4 py-1.5 rounded-xl bg-slate-100 text-slate-600 text-sm font-bold">
                      {record.type}
                    </span>
                  </td>
                  <td className="py-6 px-8 font-bold text-slate-800 text-lg">
                    {record.condition}
                  </td>
                  <td className="py-6 px-8">
                    <span className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest ${
                      record.risk === 'high' ? 'bg-red-100 text-red-600' : 
                      record.risk === 'medium' ? 'bg-orange-100 text-orange-600' : 
                      'bg-green-100 text-green-600'
                    }`}>
                      {record.risk}
                    </span>
                  </td>
                  <td className="py-6 px-8 text-right">
                    <button className="inline-flex items-center gap-1 text-primary font-bold group-hover:translate-x-1 transition-transform">
                      View Report <ChevronRight className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default History;
