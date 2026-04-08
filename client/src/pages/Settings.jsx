import { useState } from 'react';
import { User, Shield, Bell, CreditCard, Save } from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User size={18} /> },
    { id: 'security', label: 'Security', icon: <Shield size={18} /> },
    { id: 'notifications', label: 'Alerts', icon: <Bell size={18} /> },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto py-12 px-6 lg:px-12 min-h-screen">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-[#EAEAEA] mb-2">Account Settings</h1>
        <p className="text-[#08D9D6] uppercase tracking-widest text-xs font-bold">Manage your preferences and data</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Settings Navigation */}
        <div className="lg:w-64 space-y-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl font-bold transition-all ${activeTab === tab.id ? 'bg-[#08D9D6] text-[#252A34]' : 'bg-[#1A1D24] text-[#EAEAEA]/50 hover:text-[#EAEAEA]'}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Settings Panel */}
        <div className="flex-1 bg-[#1A1D24]/50 border border-[#EAEAEA]/10 rounded-3xl p-8 backdrop-blur-md">
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#08D9D6] to-[#FF2E63] p-1">
                  <div className="w-full h-full rounded-full bg-[#252A34] flex items-center justify-center text-2xl font-black">JD</div>
                </div>
                <button className="text-xs font-bold uppercase tracking-widest border border-[#EAEAEA]/20 px-4 py-2 rounded-lg hover:border-[#08D9D6] text-[#EAEAEA]/60 hover:text-[#08D9D6] transition-all">Change Avatar</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-[#EAEAEA]/40 uppercase mb-2">Display Name</label>
                  <input type="text" defaultValue="John Doe" className="w-full bg-[#252A34] border border-[#EAEAEA]/10 rounded-xl p-3 focus:border-[#08D9D6] outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#EAEAEA]/40 uppercase mb-2">Email Address</label>
                  <input type="email" defaultValue="john@example.com" className="w-full bg-[#252A34] border border-[#EAEAEA]/10 rounded-xl p-3 focus:border-[#08D9D6] outline-none opacity-50 cursor-not-allowed" disabled />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-[#EAEAEA]/40 uppercase mb-2">Medical Notes (Private)</label>
                  <textarea rows={3} className="w-full bg-[#252A34] border border-[#EAEAEA]/10 rounded-xl p-3 focus:border-[#08D9D6] outline-none resize-none" placeholder="Allergies, chronic conditions..." />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
               <h3 className="text-xl font-bold mb-4">Privacy & Access</h3>
               <div className="p-4 bg-[#FF2E63]/5 border border-[#FF2E63]/20 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="font-bold text-[#EAEAEA]">Two-Factor Authentication</p>
                    <p className="text-xs text-[#EAEAEA]/50">Recommended for medical data protection</p>
                  </div>
                  <button className="text-[#FF2E63] font-bold text-sm uppercase">Enable</button>
               </div>
            </div>
          )}

          <div className="mt-10 pt-6 border-t border-[#EAEAEA]/10 flex justify-end">
            <button className="flex items-center gap-2 px-8 py-3 bg-[#08D9D6] text-[#252A34] font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all">
              <Save size={18} /> Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;