import { useRef, useState } from 'react';

const FileUpload = ({ file, setFile }) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) setFile(e.dataTransfer.files[0]);
  };
  const handleChange = (e) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  return (
    <div className="w-full">
      <div 
        onClick={() => fileInputRef.current.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center cursor-pointer transition-all ${
          isDragging ? 'border-[#08D9D6] bg-[#08D9D6]/10' : 'border-[#EAEAEA]/30 hover:border-[#08D9D6]/50 bg-[#252A34]'
        }`}
      >
        <input type="file" ref={fileInputRef} onChange={handleChange} className="hidden" accept="image/*" />
        
        {file ? (
          <div className="text-center">
            <span className="text-[#08D9D6] font-bold text-lg block mb-2">File Ready for Analysis</span>
            <span className="text-[#EAEAEA] text-sm">{file.name}</span>
          </div>
        ) : (
          <div className="text-center text-[#EAEAEA]/70">
            <svg className="w-12 h-12 mx-auto mb-4 text-[#08D9D6]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="font-medium text-[#EAEAEA]">Click to upload or drag and drop</p>
            <p className="text-xs mt-2">Dermatological scans or X-rays (Max 5MB)</p>
          </div>
        )}
      </div>
      {file && (
        <button type="button" onClick={() => setFile(null)} className="text-[#FF2E63] text-sm mt-3 hover:underline">
          Remove file
        </button>
      )}
    </div>
  );
};

export default FileUpload;