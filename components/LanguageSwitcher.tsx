"use client";

import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { FaGlobe, FaChevronDown } from "react-icons/fa";

export default function LanguageSwitcher() {
  const { language, setLanguage, languages } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const currentLang = languages.find(l => l.code === language);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/20"
        aria-label="Select language"
      >
        <FaGlobe className="text-sm" />
        <span className="text-sm font-medium hidden sm:inline">{currentLang?.nativeName || 'English'}</span>
        <span className="text-lg sm:hidden">{currentLang?.flag || '🇺🇸'}</span>
        <FaChevronDown className={`text-xs transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2 text-left hover:bg-blue-50 transition-colors flex items-center gap-3 ${
                  language === lang.code ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700'
                }`}
              >
                <span className="text-xl">{lang.flag}</span>
                <div>
                  <div className="text-sm font-medium">{lang.nativeName}</div>
                  <div className="text-xs text-gray-500">{lang.name}</div>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

