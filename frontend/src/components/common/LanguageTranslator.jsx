import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const languages = [
  { code: "en", labelKey: "translator.english", shortLabel: "EN" },
  { code: "te", labelKey: "translator.telugu", shortLabel: "TE" },
  { code: "hi", labelKey: "translator.hindi", shortLabel: "HI" },
];

export default function LanguageTranslator() {
  const { i18n, t } = useTranslation();
  const activeLanguage = i18n.resolvedLanguage || i18n.language || "en";

  useEffect(() => {
    document.documentElement.lang = activeLanguage;
    document.documentElement.dir = "ltr";
    localStorage.setItem("appLanguage", activeLanguage);
  }, [activeLanguage]);

  const changeLanguage = (languageCode) => {
    if (languageCode === activeLanguage) return;
    i18n.changeLanguage(languageCode);
  };

  return (
    <div aria-label={t("translator.label")} className="flex items-center rounded-md border border-slate-200 bg-white p-1">
      {languages.map((language) => (
        <button
          aria-label={t(language.labelKey)}
          aria-pressed={activeLanguage === language.code}
          className={`rounded px-2.5 py-1.5 text-xs font-black transition ${
            activeLanguage === language.code
              ? "bg-brand-700 text-white"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
          }`}
          key={language.code}
          onClick={() => changeLanguage(language.code)}
          title={t(language.labelKey)}
          type="button"
        >
          {language.shortLabel}
        </button>
      ))}
    </div>
  );
}
