// LanguageSelector.tsx
import React from "react";
import { useTranslation } from "react-i18next";

interface LanguageSelectorProps {
  onLanguageSelect: () => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  onLanguageSelect,
}) => {
  const { i18n } = useTranslation();

  const changeLanguage = (language: string) => {
    localStorage.setItem("language", language); // Ensure the language is saved in localStorage
    i18n.changeLanguage(language).then(() => {
      onLanguageSelect();
    });
  };

  return (
    <div className="p-4 flex justify-center space-x-4">
      <button
        className="bg-blue-500 text-white p-2 rounded"
        onClick={() => changeLanguage("en")}
      >
        English
      </button>
      <button
        className="bg-green-500 text-white p-2 rounded"
        onClick={() => changeLanguage("pt")}
      >
        Português
      </button>
    </div>
  );
};

export default LanguageSelector;
