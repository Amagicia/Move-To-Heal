import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export const Card = ({ children, className = '', staggerIdx = 0 }) => {
  const cardRef = useRef();

  useGSAP(() => {
    gsap.fromTo(cardRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, delay: staggerIdx * 0.1, ease: 'power2.out' }
    );
  }, []);

  return (
    <div ref={cardRef} className={`glass-card p-6 md:p-8 ${className}`}>
      {children}
    </div>
  );
};
