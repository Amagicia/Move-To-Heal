import React, { useRef } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, FileUp, Activity, History, Stethoscope, LogOut } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Diagnose', path: '/diagnose', icon: FileUp },
  { name: 'Latest Report', path: '/report', icon: Activity },
  { name: 'History', path: '/history', icon: History },
];

const Sidebar = () => {
  const sidebarRef = useRef();

  useGSAP(() => {
    gsap.fromTo(sidebarRef.current, 
      { x: -50, opacity: 0 }, 
      { x: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
    );
  }, []);

  return (
    <aside 
      ref={sidebarRef}
      className="fixed left-0 top-0 h-screen w-[250px] bg-white border-r border-slate-200/60 flex flex-col z-50 shadow-[4px_0_24px_rgba(0,0,0,0.02)]"
    >
      <div className="h-20 flex items-center px-8 border-b border-slate-100 mb-6">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-md shadow-primary/30">
            <Stethoscope className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold tracking-tight text-slate-800 text-lg">More to Heal</span>
        </Link>
      </div>

      <div className="px-4 flex-1">
        <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Main Menu</p>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold transition-all duration-300
                ${isActive 
                  ? 'bg-primary/10 text-primary shadow-[inset_0_2px_4px_rgba(120,170,195,0.1)]' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }
              `}
            >
              <item.icon className={`w-5 h-5 ${location.pathname === item.path ? 'text-primary' : 'text-slate-400'}`} />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-6 border-t border-slate-100">
        <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors">
          <LogOut className="w-5 h-5 text-slate-400" />
          Exit Prototype
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
