import { useEffect, useMemo, useState } from "react";

const languages = [
  { code: "en", label: "EN" },
  { code: "te", label: "తెలుగు" },
  { code: "hi", label: "हिन्दी" },
];

const googleTranslateScriptId = "google-translate-script";
const googleTranslateElementId = "google_translate_element";

function getCookie(name) {
  return document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(`${name}=`))
    ?.split("=")[1];
}

function getCurrentLanguage() {
  const translationCookie = getCookie("googtrans");
  return translationCookie?.split("/").filter(Boolean).at(-1) || "en";
}

function setTranslationCookie(languageCode) {
  const value = `/en/${languageCode}`;
  const expires = "expires=Fri, 31 Dec 9999 23:59:59 GMT";
  const hostname = window.location.hostname;

  document.cookie = `googtrans=${value};path=/;${expires}`;

  if (hostname && hostname !== "localhost" && !/^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
    document.cookie = `googtrans=${value};path=/;domain=.${hostname};${expires}`;
  }
}

export default function LanguageTranslator() {
  const [activeLanguage, setActiveLanguage] = useState(() => getCurrentLanguage());
  const activeCodes = useMemo(() => new Set(languages.map((language) => language.code)), []);

  useEffect(() => {
    window.googleTranslateElementInit = () => {
      if (!window.google?.translate?.TranslateElement) return;

      new window.google.translate.TranslateElement(
        {
          autoDisplay: false,
          includedLanguages: languages.map((language) => language.code).join(","),
          pageLanguage: "en",
        },
        googleTranslateElementId
      );
    };

    if (document.getElementById(googleTranslateScriptId)) return;

    const script = document.createElement("script");
    script.id = googleTranslateScriptId;
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const changeLanguage = (languageCode) => {
    if (!activeCodes.has(languageCode) || languageCode === activeLanguage) return;

    setTranslationCookie(languageCode);
    setActiveLanguage(languageCode);
    window.location.reload();
  };

  return (
    <div className="notranslate flex items-center rounded-md border border-slate-200 bg-white p-1" translate="no">
      <div className="hidden" id={googleTranslateElementId} />
      {languages.map((language) => (
        <button
          aria-pressed={activeLanguage === language.code}
          className={`rounded px-2.5 py-1.5 text-xs font-black transition ${
            activeLanguage === language.code
              ? "bg-brand-700 text-white"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
          }`}
          key={language.code}
          onClick={() => changeLanguage(language.code)}
          type="button"
        >
          {language.label}
        </button>
      ))}
    </div>
  );
}
