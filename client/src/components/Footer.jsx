import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

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
              {t('footer.description')}
              <span className="text-[#FF2E63] font-bold block mt-2">
                {t('footer.disclaimer')}
              </span>
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-[#08D9D6] text-xs font-bold uppercase tracking-widest mb-4">{t('footer.engineLabel')}</h4>
            <ul className="space-y-3">
              <li><Link to="/diagnose" className="text-[#EAEAEA]/70 hover:text-[#08D9D6] transition-colors text-sm">{t('footer.initScan')}</Link></li>
              <li><Link to="#" className="text-[#EAEAEA]/70 hover:text-[#08D9D6] transition-colors text-sm">{t('footer.conditions')}</Link></li>
              <li><Link to="/about" className="text-[#EAEAEA]/70 hover:text-[#08D9D6] transition-colors text-sm">{t('footer.modelArch')}</Link></li>
              <li><Link to="#" className="text-[#EAEAEA]/70 hover:text-[#08D9D6] transition-colors text-sm">{t('footer.sysStatus')}</Link></li>
            </ul>
          </div>

          {/* Legal & Privacy */}
          <div>
            <h4 className="text-[#08D9D6] text-xs font-bold uppercase tracking-widest mb-4">{t('footer.complianceLabel')}</h4>
            <ul className="space-y-3">
              <li><Link to="#" className="text-[#EAEAEA]/70 hover:text-[#08D9D6] transition-colors text-sm">{t('footer.privacy')}</Link></li>
              <li><Link to="#" className="text-[#EAEAEA]/70 hover:text-[#08D9D6] transition-colors text-sm">{t('footer.terms')}</Link></li>
              <li><Link to="#" className="text-[#EAEAEA]/70 hover:text-[#08D9D6] transition-colors text-sm">{t('footer.hipaa')}</Link></li>
              <li><Link to="#" className="text-[#EAEAEA]/70 hover:text-[#08D9D6] transition-colors text-sm">{t('footer.dataDelete')}</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#EAEAEA]/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
          <p className="text-[#EAEAEA]/40 text-xs">
            {t('footer.copyright', { year: new Date().getFullYear() })}
          </p>
          <div className="flex gap-4">
            <span className="flex items-center gap-2 text-[#EAEAEA]/40 text-xs">
              <span className="w-2 h-2 rounded-full bg-[#08D9D6] animate-pulse"></span>
              {t('footer.operational')}
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;