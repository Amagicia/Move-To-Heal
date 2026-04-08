import React from 'react';

const StatBadge = ({ value, label }) => {
  return (
    <div className="flex flex-col items-center p-4 border-l-2 border-[#08D9D6] bg-gradient-to-r from-[#08D9D6]/10 to-transparent">
      <span className="text-3xl font-black text-[#EAEAEA] tracking-wider">{value}</span>
      <span className="text-xs uppercase tracking-widest text-[#08D9D6] mt-1">{label}</span>
    </div>
  );
};

export default StatBadge;