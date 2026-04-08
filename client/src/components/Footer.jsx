import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#252A34] border-t border-[#EAEAEA]/10 pt-16 pb-8 mt-auto relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand & Core Disclaimer */}
          <div className="md:col-span-2">
            <Link to="/" className="text-2xl font-black tracking-widest text-[#EAEAEA] flex items-center gap-2 mb-4">
              <span className="w-3 h-3 rounded-full bg-[#08D9D6]"></span>
              Move <span className="text-[#08D9D6]">to</span> Heal
            </Link>
            <p className="text-[#EAEAEA]/60 text-sm leading-relaxed mb-6 max-w-md">
              AegisMed utilizes advanced neural networks to provide preliminary diagnostic insights. 
              <span className="text-[#FF2E63] font-bold block mt-2">
                This tool is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician.
              </span>
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-[#08D9D6] text-xs font-bold uppercase tracking-widest mb-4">Engine</h4>
            <ul className="space-y-3">
              <li><Link to="/diagnose" className="text-[#EAEAEA]/70 hover:text-[#08D9D6] transition-colors text-sm">Initialize Scan</Link></li>
              <li><Link to="#" className="text-[#EAEAEA]/70 hover:text-[#08D9D6] transition-colors text-sm">Supported Conditions</Link></li>
              <li><Link to="/about" className="text-[#EAEAEA]/70 hover:text-[#08D9D6] transition-colors text-sm">Model Architecture</Link></li>
              <li><Link to="#" className="text-[#EAEAEA]/70 hover:text-[#08D9D6] transition-colors text-sm">System Status</Link></li>
            </ul>
          </div>

          {/* Legal & Privacy */}
          <div>
            <h4 className="text-[#08D9D6] text-xs font-bold uppercase tracking-widest mb-4">Compliance</h4>
            <ul className="space-y-3">
              <li><Link to="#" className="text-[#EAEAEA]/70 hover:text-[#08D9D6] transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link to="#" className="text-[#EAEAEA]/70 hover:text-[#08D9D6] transition-colors text-sm">Terms of Service</Link></li>
              <li><Link to="#" className="text-[#EAEAEA]/70 hover:text-[#08D9D6] transition-colors text-sm">HIPAA Alignment</Link></li>
              <li><Link to="#" className="text-[#EAEAEA]/70 hover:text-[#08D9D6] transition-colors text-sm">Data Deletion Request</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#EAEAEA]/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
          <p className="text-[#EAEAEA]/40 text-xs">
            © {new Date().getFullYear()} AegisMed Technologies. All rights reserved.
          </p>
          <div className="flex gap-4">
            <span className="flex items-center gap-2 text-[#EAEAEA]/40 text-xs">
              <span className="w-2 h-2 rounded-full bg-[#08D9D6] animate-pulse"></span>
              Systems Operational
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;