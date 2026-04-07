import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Stethoscope, Bell, Search } from 'lucide-react';

const Navbar = ({ isLanding }) => {
  const location = useLocation();

  return (
    <nav className={`fixed top-0 w-full z-40 transition-all duration-300 ${
      isLanding ? 'w-full bg-white/40 backdrop-blur-md border-b border-white/40' 
      : 'w-[calc(100%-250px)] left-[250px] bg-[#fafafa]/80 backdrop-blur-xl border-b border-slate-200/50'
    }`}>
      <div className="h-20 px-6 lg:px-12 flex items-center justify-between">
        
        {isLanding ? (
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-800">More to Heal</span>
          </Link>
        ) : (
          <div className="flex-1 max-w-xl">
            <div className="relative group">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Search diagnoses, symptoms, or reports..." 
                className="w-full bg-slate-100/50 border-transparent focus:bg-white focus:border-primary/30 rounded-2xl py-3 pl-12 pr-4 text-sm text-slate-700 outline-none transition-all duration-300 shadow-sm"
              />
            </div>
          </div>
        )}

        <div className="flex items-center gap-5 ml-auto">
          {!isLanding && (
            <button className="relative p-2.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-highlight border-2 border-white"></span>
            </button>
          )}

          <div className="flex items-center gap-3 pl-5 border-l border-slate-200/60">
            <div className="w-10 h-10 rounded-2xl overflow-hidden shadow-sm border border-slate-200/50 cursor-pointer hover:shadow-md transition-shadow">
              <img src="https://i.pravatar.cc/150?img=32" alt="Avatar" className="w-full h-full object-cover" />
            </div>
            {!isLanding && (
              <div className="hidden md:block text-sm cursor-pointer hover:opacity-80">
                <p className="font-bold text-slate-800 leading-tight">Jane Doe</p>
                <p className="text-slate-500 text-xs">Premium User</p>
              </div>
            )}
          </div>
        </div>
        
      </div>
    </nav>
  );
};

export default Navbar;
