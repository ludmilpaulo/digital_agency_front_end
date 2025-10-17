"use client";

import { useState } from "react";
import { useCurrency } from "@/hooks/useCurrency";
import { FaDollarSign, FaChevronDown } from "react-icons/fa";

export default function CurrencySwitcher() {
  const { currency, setCurrency, currencies, getCurrencyConfig } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);

  const currentConfig = getCurrencyConfig();

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/20"
        aria-label="Select currency"
      >
        <FaDollarSign className="text-sm" />
        <span className="text-sm font-medium hidden sm:inline">{currentConfig.code}</span>
        <span className="text-lg sm:hidden">{currentConfig.flag}</span>
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
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50">
            {currencies.map((curr) => (
              <button
                key={curr.code}
                onClick={() => {
                  setCurrency(curr.code);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2 text-left hover:bg-blue-50 transition-colors flex items-center gap-3 ${
                  currency === curr.code ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700'
                }`}
              >
                <span className="text-xl">{curr.flag}</span>
                <div>
                  <div className="text-sm font-medium">{curr.code}</div>
                  <div className="text-xs text-gray-500">{curr.name}</div>
                </div>
                <span className="ml-auto text-gray-400 text-sm">{curr.symbol}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

