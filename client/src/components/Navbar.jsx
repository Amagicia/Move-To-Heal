import { Link } from 'react-router-dom';
import Logo from './Logo';

const Navbar = () => {
  return (
    <header className="bg-[#252A34]/90 backdrop-blur-sm border-b border-[#EAEAEA]/15 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
        <Link to="/" className="text-3xl font-black tracking-tighter text-[#EAEAEA] flex items-center gap-3">
          {/* <span className="w-4 h-4 rounded-full bg-[#08D9D6]"></span> */}
          {/* Move <span className="text-[#08D9D6]">to</span> Heal */}
          <Logo />
        </Link>
        <nav className="flex items-center gap-10">
          <Link to="/" className="text-[#EAEAEA]/80 hover:text-[#08D9D6] transition-colors text-base font-semibold tracking-wide hover:scale-105">
            Overview
          </Link>
          <Link to="/auth" className="text-[#EAEAEA]/80 hover:text-[#08D9D6] transition-colors text-base font-semibold tracking-wide hover:scale-105">
            Signup | Login
          </Link>
          <Link to="/about" className="text-[#EAEAEA]/80 hover:text-[#08D9D6] transition-colors text-base font-semibold tracking-wide hover:scale-105">
            How It Works
          </Link>
          <Link to="/diagnose" className="text-[#EAEAEA]/80 hover:text-[#08D9D6] transition-colors text-base font-semibold tracking-wide hover:scale-105">
            New Scan
          </Link>
          {/* Add more links if needed - e.g., Community, Science, etc. */}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;