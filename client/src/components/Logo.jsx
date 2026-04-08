import { Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const Logo = ({ size = "md" }) => {
  const sizeClasses = size === "lg" ? "text-4xl" : "text-xl";
  const iconSize = size === "lg" ? 38 : 26;

  return (
    <Link to="/" className={`font-black tracking-tighter text-[#EAEAEA] flex items-center gap-2 ${sizeClasses}`}>
      <div className="relative">
        <Activity size={iconSize} className="text-[#08D9D6] relative z-10" />
        <div className="absolute inset-0 bg-[#08D9D6] blur-md opacity-40 animate-pulse"></div>
      </div>
      <span>Move <span className="text-[#08D9D6]">to</span> Heal</span>
    </Link>
  );
};

export default Logo;