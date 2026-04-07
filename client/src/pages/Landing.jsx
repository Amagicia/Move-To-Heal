import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ArrowRight, Brain, ShieldCheck, Activity, Stethoscope } from 'lucide-react';

const Landing = () => {
  const heroRef = useRef();
  const blobsRef = useRef([]);
  const featuresRef = useRef();

  useGSAP(() => {
    // Reveal animation
    gsap.fromTo(
      heroRef.current.children,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: 'power3.out' }
    );

    // Floating blobs animation
    blobsRef.current.forEach((blob, i) => {
      gsap.to(blob, {
        x: 'random(-50, 50)',
        y: 'random(-50, 50)',
        rotation: 'random(-20, 20)',
        duration: 'random(5, 10)',
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: i * 0.5
      });
    });

    // Features stagger
    gsap.fromTo(
      featuresRef.current.children,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power2.out', delay: 1 }
    );
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-80px)] overflow-hidden flex flex-col items-center justify-center pt-20 pb-32">
      {/* GSAP Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 bg-[#fafafa]">
        <div ref={el => blobsRef.current[0] = el} className="absolute top-[10%] left-[15%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
        <div ref={el => blobsRef.current[1] = el} className="absolute top-[20%] right-[10%] w-[35vw] h-[35vw] max-w-[400px] max-h-[400px] bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
        <div ref={el => blobsRef.current[2] = el} className="absolute bottom-[-10%] left-[30%] w-[45vw] h-[45vw] max-w-[600px] max-h-[600px] bg-secondary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-60"></div>
        <div ref={el => blobsRef.current[3] = el} className="absolute bottom-[10%] right-[20%] w-[30vw] h-[30vw] max-w-[400px] max-h-[400px] bg-highlight/15 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
      </div>

      <div ref={heroRef} className="max-w-4xl mx-auto text-center px-4 relative z-10">
        <div className="mx-auto inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 border border-white backdrop-blur-md text-primary font-bold text-sm mb-8 shadow-sm">
          <Stethoscope className="w-4 h-4" />
          <span>Next-Generation Healthcare AI</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black text-slate-800 tracking-tight mb-8 leading-[1.1]">
          Smarter Health,<br/> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-highlight">
            Faster Diagnosis.
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
          Upload symptoms and scans, and let our advanced AI pinpoint potential risks with secure, instant, and reliable insights.
        </p>

        <div className="flex flex-col sm:flex-row gap-5 justify-center mt-8">
          <Link to="/diagnose" className="btn-primary text-xl px-10 py-4 flex items-center justify-center gap-3 group">
            Start Diagnosis
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1.5 transition-transform" />
          </Link>
          <Link to="/dashboard" className="btn-secondary bg-white/70 backdrop-blur-md text-xl px-10 py-4">
            Explore Dashboard
          </Link>
        </div>
      </div>

      <div ref={featuresRef} className="grid md:grid-cols-3 gap-8 w-full max-w-6xl mx-auto px-6 mt-32 relative z-10">
        {[
          { icon: Brain, color: 'text-primary', bg: 'bg-primary/10', title: 'AI-Powered Precision', desc: 'Algorithms fine-tuned specifically for skin, x-rays, and general diagnostics.' },
          { icon: ShieldCheck, color: 'text-accent', bg: 'bg-accent/10', title: 'Secure & Private', desc: 'Your medical data is completely encrypted and never shared.' },
          { icon: Activity, color: 'text-highlight', bg: 'bg-highlight/10', title: 'Instant Reports', desc: 'Generate actionable insights delivered securely via clinical PDF.' }
        ].map((f, i) => (
          <div key={i} className="glass-card p-8 group hover:-translate-y-2 transition-transform duration-300">
            <div className={`w-14 h-14 rounded-2xl ${f.bg} flex items-center justify-center mb-6`}>
              <f.icon className={`w-7 h-7 ${f.color}`} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">{f.title}</h3>
            <p className="text-slate-600 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Landing;
