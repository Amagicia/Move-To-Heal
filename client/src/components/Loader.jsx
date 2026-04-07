import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const Loader = ({ text = "Analyzing your health..." }) => {
  const dotsRef = useRef([]);

  useGSAP(() => {
    gsap.to(dotsRef.current, {
      y: -10,
      stagger: 0.15,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
      duration: 0.6
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="flex gap-2 mb-6">
        {[0, 1, 2].map((i) => (
          <div 
            key={i}
            ref={el => dotsRef.current[i] = el}
            className="w-4 h-4 rounded-full bg-gradient-to-tr from-primary to-highlight shadow-sm"
          />
        ))}
      </div>
      <p className="text-slate-600 font-semibold animate-pulse">{text}</p>
    </div>
  );
};

export default Loader;
