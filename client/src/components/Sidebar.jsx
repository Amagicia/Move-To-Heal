import { Link, useLocation } from 'react-router-dom';
import { Home, Zap, Clock, Settings, LogOut, Activity } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { name: 'Home', path: '/', icon: <Home size={22} /> },
    { name: 'Diagnose', path: '/diagnose', icon: <Zap size={22} /> },
    { name: 'History', path: '/history', icon: <Clock size={22} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={22} /> },
  ];

  return (
    <aside className="w-64 bg-[#1A1D24] border-r border-[#EAEAEA]/10 h-screen hidden md:flex flex-col sticky top-0 z-50">
      {/* Brand Logo */}
      <div className="h-24 flex items-center px-8 border-b border-[#EAEAEA]/10">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="p-2 bg-[#08D9D6]/10 rounded-lg group-hover:bg-[#08D9D6]/20 transition-all">
            <Activity className="text-[#08D9D6]" size={24} />
          </div>
          <span className="text-xl font-black text-[#EAEAEA] tracking-tighter">
            MOVE <span className="text-[#08D9D6]">TO</span> HEAL
          </span>
        </Link>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 px-4 py-8 space-y-2">
        {navItems.map((item) => {
          const isActive = currentPath === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                isActive
                  ? 'bg-[#08D9D6] text-[#252A34] shadow-[0_0_20px_rgba(8,217,214,0.3)]'
                  : 'text-[#EAEAEA]/50 hover:bg-[#252A34] hover:text-[#EAEAEA]'
              }`}
            >
              {item.icon}
              <span className="tracking-widest uppercase text-xs">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Profile / Logout */}
      <div className="p-4 border-t border-[#EAEAEA]/10">
        <div className="flex items-center gap-3 px-4 py-3 bg-[#252A34] rounded-xl border border-[#EAEAEA]/5 mb-4">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#08D9D6] to-[#FF2E63] flex items-center justify-center text-[10px] font-black text-white">
            JD
          </div>
          <div className="truncate">
            <p className="text-xs font-bold text-[#EAEAEA] truncate">John Doe</p>
            <p className="text-[10px] text-[#08D9D6] font-bold uppercase tracking-tighter">Pro Member</p>
          </div>
        </div>
        
        <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-[#FF2E63] font-bold text-xs uppercase tracking-widest hover:bg-[#FF2E63]/10 transition-all">
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
      
    </aside>
  );
};

export default Sidebar;