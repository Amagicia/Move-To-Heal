import React from 'react';

const FeatureCard = ({ title, description, icon, isAlert }) => {
  const accentColor = isAlert ? 'border-[#FF2E63] text-[#FF2E63]' : 'border-[#08D9D6] text-[#08D9D6]';
  const hoverGlow = isAlert ? 'hover:shadow-[0_0_20px_rgba(255,46,99,0.2)]' : 'hover:shadow-[0_0_20px_rgba(8,217,214,0.2)]';

  return (
    <div className={`p-6 rounded-xl bg-[#252A34] border border-opacity-20 transition-all duration-300 ${accentColor} ${hoverGlow} bg-opacity-80 backdrop-blur-sm z-10 relative`}>
      {/* The icon will now be rendered directly as a component */}
      <div className="mb-5">{icon}</div>
      <h3 className="text-xl font-bold text-[#EAEAEA] mb-3">{title}</h3>
      <p className="text-[#EAEAEA] opacity-80 leading-relaxed text-sm">
        {description}
      </p>
    </div>
  );
};

export default FeatureCard;