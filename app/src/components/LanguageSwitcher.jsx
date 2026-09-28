import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

const LANGUAGES = [
  { code: "en", label: "English", short: "EN" },
  { code: "hi", label: "हिंदी", short: "हि" },
  { code: "mr", label: "मराठी", short: "मर" },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  const current =
    LANGUAGES.find((lang) => lang.code === i18n.language) || LANGUAGES[0];

  function changeLanguage(code) {
    i18n.changeLanguage(code);
    localStorage.setItem("appLanguage", code);
    setOpen(false);
  }

  useEffect(() => {
    function onClickOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div className="lang-switcher" ref={wrapRef}>
      <button
        className="lang-switcher-trigger"
        onClick={() => setOpen((o) => !o)}
      >
        <svg viewBox="0 0 20 20" fill="none" className="lang-icon">
          <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.3" />
          <path
            d="M2.5 10h15M10 2.5c2.2 2 3.4 4.8 3.4 7.5s-1.2 5.5-3.4 7.5c-2.2-2-3.4-4.8-3.4-7.5S7.8 4.5 10 2.5z"
            stroke="currentColor"
            strokeWidth="1.3"
          />
        </svg>
        <span>{current.short}</span>
        <svg
          viewBox="0 0 12 8"
          fill="none"
          className={`lang-chevron ${open ? "is-open" : ""}`}
        >
          <path
            d="M1 1.5L6 6.5L11 1.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div className="lang-switcher-menu">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              className={`lang-option ${
                lang.code === i18n.language ? "is-active" : ""
              }`}
              onClick={() => changeLanguage(lang.code)}
            >
              <span>{lang.label}</span>
              {lang.code === i18n.language && (
                <svg viewBox="0 0 16 16" fill="none" className="lang-check">
                  <path
                    d="M3 8.5L6.5 12L13 4.5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}