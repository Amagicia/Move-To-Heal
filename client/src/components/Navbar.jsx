import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import Logo from './Logo';

const LANGUAGES = [
  { code: 'en',  label: 'English',    nativeLabel: 'English' },
  { code: 'hi',  label: 'Hindi',      nativeLabel: 'हिंदी' },
  { code: 'as',  label: 'Assamese',   nativeLabel: 'অসমীয়া' },
  { code: 'bn',  label: 'Bengali',    nativeLabel: 'বাংলা' },
  { code: 'mni', label: 'Manipuri',   nativeLabel: 'মৈতৈলোন্' },
];

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [langOpen, setLangOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLang = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const switchLanguage = (code) => {
    i18n.changeLanguage(code);
    setLangOpen(false);
  };

  return (
    <header className="bg-[#252A34]/90 backdrop-blur-sm border-b border-[#EAEAEA]/15 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
        <Link to="/" className="text-3xl font-black tracking-tighter text-[#EAEAEA] flex items-center gap-3">
          <Logo />
        </Link>
        <nav className="flex items-center gap-6 md:gap-10">
          <Link to="/" className="hidden md:block text-[#EAEAEA]/80 hover:text-[#08D9D6] transition-colors text-base font-semibold tracking-wide hover:scale-105">
            {t('nav.overview')}
          </Link>
          <Link to="/auth" className="hidden md:block text-[#EAEAEA]/80 hover:text-[#08D9D6] transition-colors text-base font-semibold tracking-wide hover:scale-105">
            {t('nav.signup')}
          </Link>
          <Link to="/about" className="hidden md:block text-[#EAEAEA]/80 hover:text-[#08D9D6] transition-colors text-base font-semibold tracking-wide hover:scale-105">
            {t('nav.howItWorks')}
          </Link>
          <Link to="/diagnose" className="hidden md:block text-[#EAEAEA]/80 hover:text-[#08D9D6] transition-colors text-base font-semibold tracking-wide hover:scale-105">
            {t('nav.newScan')}
          </Link>

          {/* Language Switcher */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#EAEAEA]/20 bg-[#EAEAEA]/5 hover:border-[#08D9D6]/50 hover:bg-[#08D9D6]/10 transition-all text-sm font-semibold text-[#EAEAEA]/80 hover:text-[#08D9D6]"
              aria-label="Select language"
              id="language-switcher"
            >
              <Globe size={16} />
              <span className="hidden sm:inline">{currentLang.nativeLabel}</span>
            </button>

            {langOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-[#1A1D24] border border-[#EAEAEA]/15 rounded-xl shadow-2xl overflow-hidden animate-[fadeIn_0.15s_ease-in-out] z-[999]">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => switchLanguage(lang.code)}
                    className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium transition-all hover:bg-[#08D9D6]/10 ${
                      i18n.language === lang.code
                        ? 'text-[#08D9D6] bg-[#08D9D6]/5'
                        : 'text-[#EAEAEA]/80 hover:text-[#EAEAEA]'
                    }`}
                  >
                    <span>{lang.nativeLabel}</span>
                    <span className="text-xs text-[#EAEAEA]/40">{lang.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;