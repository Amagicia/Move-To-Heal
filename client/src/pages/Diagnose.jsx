import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { X, AlertCircle } from 'lucide-react';
import { Card } from '../components/Card';
import UploadBox from '../components/UploadBox';
import Loader from '../components/Loader';

const Diagnose = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [type, setType] = useState('general');
  const [loading, setLoading] = useState(false);
  
  const headerRef = useRef();
  const formRef = useRef();

  useGSAP(() => {
    gsap.fromTo(headerRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 });
    gsap.fromTo(formRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, delay: 0.2 });
  }, []);

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Mock simulation delay
    setTimeout(() => {
      navigate('/report', { state: { scanType: type } });
    }, 3000);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader text="Our AI is analyzing your medical data..." />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div ref={headerRef} className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">Diagnostic Analysis</h1>
        <p className="text-lg text-slate-500 mt-2">Upload visual scans or describe your symptoms below to get started.</p>
      </div>

      <Card className="p-8 md:p-10" ref={formRef}>
        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div>
            <label className="block text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Select Focus Area</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['general', 'skin', 'xray', 'tumor'].map((t) => (
                <div
                  key={t}
                  onClick={() => setType(t)}
                  className={`py-4 px-4 rounded-2xl border-2 text-center font-bold capitalize transition-all cursor-pointer ${
                    type === t 
                      ? 'bg-primary/5 text-primary border-primary shadow-sm scale-[1.02]' 
                      : 'bg-white text-slate-500 border-slate-200 hover:border-primary/40 hover:bg-slate-50'
                  }`}
                >
                  {t}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Media Upload</label>
            {!preview ? (
              <UploadBox onFileSelect={handleFileSelect} />
            ) : (
              <div className="relative rounded-2xl overflow-hidden border-2 border-primary/20 bg-primary/5 p-4 inline-flex group">
                <img src={preview} alt="Upload preview" className="max-h-64 w-auto object-contain rounded-xl shadow-sm" />
                <button 
                  type="button" 
                  onClick={removeFile} 
                  className="absolute top-6 right-6 p-2 bg-white rounded-full shadow-lg text-slate-500 hover:text-red-500 hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Symptom Description</label>
            <textarea
              rows={5}
              className="input-field resize-none"
              placeholder="Please describe what you are feeling. E.g., 'I have been experiencing a mild headache and fatigue for the last 3 days...'"
            />
          </div>

          <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5 flex gap-4 text-blue-800 text-sm">
            <AlertCircle className="w-6 h-6 text-blue-500 shrink-0" />
            <p className="leading-relaxed">Our AI uses advanced pattern recognition for initial screening. This is highly accurate but <strong>not a substitute for professional clinical diagnosis</strong>.</p>
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end">
            <button type="submit" className="btn-primary w-full md:w-auto px-12 text-lg">
              Begin Analysis
            </button>
          </div>
          
        </form>
      </Card>
    </div>
  );
};

export default Diagnose;
