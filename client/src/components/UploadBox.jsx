import React, { useRef, useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const UploadBox = ({ onFileSelect }) => {
  const boxRef = useRef();
  const iconRef = useRef();
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  useGSAP(() => {
    if (isDragActive) {
      gsap.to(boxRef.current, { scale: 1.02, borderColor: '#78AAC3', backgroundColor: 'rgba(120, 170, 195, 0.05)', duration: 0.3 });
      gsap.to(iconRef.current, { y: -10, scale: 1.1, color: '#78AAC3', duration: 0.3 });
    } else {
      gsap.to(boxRef.current, { scale: 1, borderColor: '#e2e8f0', backgroundColor: 'white', duration: 0.3 });
      gsap.to(iconRef.current, { y: 0, scale: 1, color: '#94a3b8', duration: 0.3 });
    }
  }, [isDragActive]);

  return (
    <div 
      ref={boxRef}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className="relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-2xl cursor-pointer transition-colors"
    >
      <input 
        type="file" 
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
        onChange={handleChange} 
        accept="image/*"
      />
      <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
        <UploadCloud ref={iconRef} className="w-12 h-12 mb-4" />
        <p className="mb-2 text-sm text-slate-600 font-semibold">
          <span className="text-primary">Click to upload</span> or drag and drop
        </p>
        <p className="text-xs text-slate-400">SVG, PNG, JPG (MAX. 10MB)</p>
      </div>
    </div>
  );
};

export default UploadBox;
