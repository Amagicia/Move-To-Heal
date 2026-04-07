import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { UploadCloud, Clock, Activity, ArrowRight, TrendingUp, Calendar, ShieldAlert } from 'lucide-react';
import { Card } from '../components/Card';

const Dashboard = () => {
  const headerRef = useRef();

  useGSAP(() => {
    gsap.fromTo(
      headerRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
    );
  }, []);

  return (
    <div className="w-full">
      <div ref={headerRef} className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">Welcome back, Jane!</h1>
        <p className="text-lg text-slate-500 mt-2">Here is what's happening with your health profile today.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card staggerIdx={1} className="bg-white border-l-4 border-l-primary flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Total Scans</p>
            <p className="text-3xl font-black text-slate-800">12</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Activity className="w-6 h-6 text-primary" />
          </div>
        </Card>
        <Card staggerIdx={2} className="bg-white border-l-4 border-l-accent flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Last Upload</p>
            <p className="text-3xl font-black text-slate-800">5d ago</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
            <Calendar className="w-6 h-6 text-accent" />
          </div>
        </Card>
        <Card staggerIdx={3} className="bg-white border-l-4 border-l-green-500 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Health Score</p>
            <p className="text-3xl font-black text-green-600">Good</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-green-500" />
          </div>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-10">
        <Card staggerIdx={4} className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 flex flex-col justify-between items-start group hover:border-primary/40 transition-colors">
          <div className="mb-8">
            <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mb-6 shadow-sm group-hover:scale-105 transition-transform">
              <UploadCloud className="w-7 h-7 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">Initiate Analysis</h2>
            <p className="text-slate-600 leading-relaxed text-lg">Upload an image or describe your symptoms to receive an AI-powered health assessment instantly.</p>
          </div>
          <Link to="/diagnose" className="btn-primary w-full text-center sm:w-auto flex items-center justify-center gap-2">
            Start Diagnosis <ArrowRight className="w-5 h-5" />
          </Link>
        </Card>

        <Card staggerIdx={5} className="bg-gradient-to-br from-accent/10 to-transparent border border-accent/20 flex flex-col justify-between items-start group hover:border-accent/40 transition-colors">
          <div className="mb-8">
            <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mb-6 shadow-sm group-hover:scale-105 transition-transform">
              <Clock className="w-7 h-7 text-accent" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">Medical History</h2>
            <p className="text-slate-600 leading-relaxed text-lg">Review your past diagnoses, track your health progress, and download complete reports.</p>
          </div>
          <Link to="/history" className="bg-white text-slate-700 font-bold py-3 px-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow text-center sm:w-auto flex items-center justify-center gap-2 transition-all">
            View History <ArrowRight className="w-5 h-5" />
          </Link>
        </Card>
      </div>

      <Card staggerIdx={6}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Activity className="w-5 h-5 text-highlight" /> 
            Recent Activity
          </h2>
          <Link to="/history" className="text-sm font-bold text-primary hover:text-primary/80">View All</Link>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-500">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-slate-800">Dermatology Scan</p>
                <p className="text-sm text-slate-500">Analyzed for skin lesions</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-slate-700">Medium Risk</p>
              <p className="text-sm text-slate-500">Oct 24, 2024</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-500">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-slate-800">General Symptoms</p>
                <p className="text-sm text-slate-500">Reported fatigue and headache</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-slate-700">Low Risk</p>
              <p className="text-sm text-slate-500">Sep 15, 2024</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
