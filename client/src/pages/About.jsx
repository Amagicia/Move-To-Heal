import React from 'react';
import { ShieldCheck, Microscope, Fingerprint, Scale, HeartPulse } from 'lucide-react';
import Logo from '../components/Logo';

const About = () => {
  return (
    <div className="min-h-screen bg-[#252A34] text-[#EAEAEA] py-20 px-6">
      {/* --- HERO SECTION --- */}
      <section className="max-w-4xl mx-auto text-center mb-32">
        <div className="flex justify-center mb-8">
          <Logo size="lg" />
        </div>
        <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
          The Science of <span className="text-[#08D9D6]">Certainty.</span>
        </h1>
        <p className="text-xl text-[#EAEAEA]/70 leading-relaxed">
          Move to Heal isn't just an algorithm; it's a clinical-grade neural network 
          designed to prioritize human life over data retention.
        </p>
      </section>

      {/* --- THE INTEGRITY PIPELINE (Science & Ethics) --- */}
      <section className="max-w-7xl mx-auto mb-32 relative">
        <div className="text-center mb-20">
          <h2 className="text-[#08D9D6] text-sm font-bold uppercase tracking-widest mb-3">Our Protocol</h2>
          <h3 className="text-4xl font-black">How We Protect & Predict</h3>
        </div>

        {/* Pipeline Flow */}
        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-[#08D9D6]/30 to-transparent"></div>

          {/* Step 1: Privacy */}
          <div className="relative flex flex-col items-center text-center group">
            <div className="w-20 h-20 rounded-2xl bg-[#1A1D24] border border-[#08D9D6]/20 flex items-center justify-center mb-6 shadow-xl group-hover:border-[#08D9D6] transition-all duration-500">
              <Fingerprint size={32} className="text-[#08D9D6]" />
            </div>
            <h4 className="text-lg font-bold mb-3">Ephemeral Data</h4>
            <p className="text-sm text-[#EAEAEA]/60">
              Your inputs exist only in volatile memory. Once the scan is complete, the data is permanently purged.
            </p>
          </div>

          {/* Step 2: Science */}
          <div className="relative flex flex-col items-center text-center group">
            <div className="w-20 h-20 rounded-2xl bg-[#1A1D24] border border-[#08D9D6]/20 flex items-center justify-center mb-6 shadow-xl group-hover:border-[#08D9D6] transition-all duration-500">
              <Microscope size={32} className="text-[#08D9D6]" />
            </div>
            <h4 className="text-lg font-bold mb-3">Clinical Validation</h4>
            <p className="text-sm text-[#EAEAEA]/60">
              Our models are cross-trained on millions of anonymized, peer-reviewed medical journals and radiological scans.
            </p>
          </div>

          {/* Step 3: Ethics */}
          <div className="relative flex flex-col items-center text-center group">
            <div className="w-20 h-20 rounded-2xl bg-[#1A1D24] border border-[#FF2E63]/20 flex items-center justify-center mb-6 shadow-xl group-hover:border-[#FF2E63] transition-all duration-500">
              <Scale size={32} className="text-[#FF2E63]" />
            </div>
            <h4 className="text-lg font-bold mb-3">Unbiased Triage</h4>
            <p className="text-sm text-[#EAEAEA]/60">
              We eliminate human bias in early screening, focusing purely on symptomatic telemetry and visual markers.
            </p>
          </div>

          {/* Step 4: Verification */}
          <div className="relative flex flex-col items-center text-center group">
            <div className="w-20 h-20 rounded-2xl bg-[#1A1D24] border border-[#08D9D6]/20 flex items-center justify-center mb-6 shadow-xl group-hover:border-[#08D9D6] transition-all duration-500">
              <ShieldCheck size={32} className="text-[#08D9D6]" />
            </div>
            <h4 className="text-lg font-bold mb-3">HIPAA Alignment</h4>
            <p className="text-sm text-[#EAEAEA]/60">
              Our architecture is built from the ground up to exceed international health data security standards.
            </p>
          </div>
        </div>
      </section>

      {/* --- MEDICAL COLLABORATION SECTION --- */}
      <section className="max-w-5xl mx-auto glass-card p-12 rounded-3xl border border-[#EAEAEA]/10 text-center">
        <HeartPulse size={48} className="mx-auto text-[#FF2E63] mb-6 animate-pulse" />
        <h3 className="text-3xl font-bold mb-6">Built to Assist, Not Replace.</h3>
        <p className="text-[#EAEAEA]/70 leading-relaxed max-w-2xl mx-auto mb-10">
          Move to Heal is a tool for doctors as much as it is for patients. By providing a 
          standardized preliminary report, we save physicians hours of discovery time, 
          allowing them to focus immediately on high-risk cases.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div className="p-4 bg-[#252A34] rounded-xl border border-[#08D9D6]/20">
                <h5 className="text-[#08D9D6] font-bold text-xs uppercase mb-2 tracking-widest">For Patients</h5>
                <p className="text-sm text-[#EAEAEA]/60">Clarity on urgency and actionable steps during the critical "first hour" of symptoms.</p>
            </div>
            <div className="p-4 bg-[#252A34] rounded-xl border border-[#08D9D6]/20">
                <h5 className="text-[#08D9D6] font-bold text-xs uppercase mb-2 tracking-widest">For Clinicians</h5>
                <p className="text-sm text-[#EAEAEA]/60">High-fidelity preliminary data to accelerate the diagnostic pathway and improve triage accuracy.</p>
            </div>
        </div>
      </section>
    </div>
  );
};

export default About;