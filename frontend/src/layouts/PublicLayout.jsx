import { NavLink, Outlet } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import ChatbotWidget from "../components/common/ChatbotWidget";
import FloatingWhatsAppButton from "../components/common/FloatingWhatsAppButton";
import LanguageTranslator from "../components/common/LanguageTranslator";
import { OFFICE_ADDRESS, OFFICE_EMAILS, OFFICE_PHONES } from "../data/propertyTypes";
import { createMailtoUrl } from "../utils/email";

const navItems = [
  { to: "/", labelKey: "nav.home" },
  { to: "/properties", labelKey: "nav.listings" },
  { to: "/saved", labelKey: "nav.saved" },
  { to: "/rrr-road", labelKey: "nav.rrr" },
  { to: "/about", labelKey: "nav.about" },
  { to: "/faq", labelKey: "nav.faq" },
  { to: "/contact", labelKey: "nav.contact" },
];

export default function PublicLayout() {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="min-h-screen text-ink">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-xl">
        <nav className="container-page flex min-h-16 items-center gap-2 py-2">
          <NavLink className="flex min-w-0 flex-1 items-center gap-2 text-base font-black text-slate-950 md:flex-none md:gap-3 md:text-lg" onClick={closeMenu} to="/">
            <img alt="" className="h-10 w-10 shrink-0 rounded-md shadow-sm" src="/favicon.svg" />
            <span className="min-w-0 leading-tight">
              <span className="block truncate">{t("common.brand")}</span>
              <span className="block truncate text-[11px] font-extrabold uppercase text-slate-500 md:text-xs">{t("common.officeShort")}</span>
            </span>
          </NavLink>
          <div className="hidden items-center gap-2 md:flex md:ml-auto">
            {navItems.map((item) => (
              <NavLink
                className={({ isActive }) =>
                  `shrink-0 rounded-md px-3 py-2 text-sm font-extrabold transition ${
                    isActive ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                  }`
                }
                key={item.to}
                to={item.to}
              >
                {t(item.labelKey)}
              </NavLink>
            ))}
          </div>
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-3 md:ml-2">
            <div className="hidden md:block">
              <LanguageTranslator />
            </div>
            <NavLink className="btn-primary hidden whitespace-nowrap px-3 py-2 sm:px-4 sm:py-2.5 md:inline-flex" to="/login">{t("common.agentLogin")}</NavLink>
            <button
              aria-expanded={menuOpen}
              aria-label="Open navigation"
              className="btn-secondary px-3 py-2 md:hidden"
              onClick={() => setMenuOpen(true)}
              type="button"
            >
              Menu
            </button>
          </div>
        </nav>
      </header>

      <div className={`fixed inset-0 z-50 md:hidden ${menuOpen ? "" : "pointer-events-none"}`} aria-hidden={!menuOpen}>
        <button
          aria-label="Close navigation"
          className={`absolute inset-0 bg-slate-950/45 transition-opacity ${menuOpen ? "opacity-100" : "opacity-0"}`}
          onClick={closeMenu}
          type="button"
        />
        <aside
          className={`absolute right-0 top-0 h-full w-[min(82vw,320px)] overflow-y-auto bg-white p-5 shadow-soft transition-transform duration-300 ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <img alt="" className="h-11 w-11 rounded-md shadow-sm" src="/favicon.svg" />
              <div className="min-w-0">
                <p className="truncate text-lg font-black text-slate-950">{t("common.brand")}</p>
                <p className="text-xs font-extrabold uppercase text-slate-500">{t("common.officeShort")}</p>
              </div>
            </div>
            <button className="btn-secondary px-3 py-2" onClick={closeMenu} type="button">Close</button>
          </div>
          <div className="mt-6 grid gap-2">
            {navItems.map((item) => (
              <NavLink
                className={({ isActive }) =>
                  `rounded-md px-4 py-3 text-base font-extrabold transition ${
                    isActive ? "bg-brand-50 text-brand-700" : "text-slate-700 hover:bg-slate-100 hover:text-slate-950"
                  }`
                }
                key={item.to}
                onClick={closeMenu}
                to={item.to}
              >
                {t(item.labelKey)}
              </NavLink>
            ))}
          </div>
          <div className="mt-6 border-t border-slate-100 pt-5">
            <p className="mb-2 text-xs font-black uppercase text-slate-500">{t("translator.label")}</p>
            <LanguageTranslator />
            <NavLink className="btn-primary mt-4 w-full py-3" onClick={closeMenu} to="/login">
              {t("common.agentLogin")}
            </NavLink>
          </div>
        </aside>
      </div>

      <Outlet />
      <ChatbotWidget />
      <FloatingWhatsAppButton />

      <footer className="mt-16 border-t border-slate-800 bg-slate-950 text-white">
        <div className="container-page grid gap-8 py-12 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <img alt="" className="h-11 w-11 rounded-md" src="/favicon.svg" />
              <h2 className="text-xl font-black">{t("common.brand")}</h2>
            </div>
            <p className="mt-3 max-w-md text-sm leading-6 text-slate-300">
              {t("footer.description")}
            </p>
          </div>
          <div>
            <p className="font-black">{t("footer.office")}</p>
            <p className="mt-3 text-sm leading-6 text-slate-300">{OFFICE_ADDRESS}</p>
          </div>
          <div>
            <p className="font-black">{t("footer.contact")}</p>
            <div className="mt-3 space-y-2">
              {OFFICE_PHONES.map((phone) => (
                <a className="block text-sm text-slate-300 hover:text-white" href={`tel:${phone.href}`} key={phone.href}>
                  {phone.label}
                </a>
              ))}
            </div>
            <div className="mt-3 space-y-2">
              {OFFICE_EMAILS.map((email) => (
                <a className="block text-sm text-slate-300 hover:text-white" href={createMailtoUrl({ email })} key={email}>
                  {email}
                </a>
              ))}
            </div>
            <NavLink className="mt-3 block text-sm text-slate-300 hover:text-white" to="/contact">
              {t("common.sendInquiry")}
            </NavLink>
            <NavLink className="mt-2 block text-sm text-slate-300 hover:text-white" to="/faq">
              {t("nav.faq")}
            </NavLink>
            <NavLink className="mt-2 block text-sm text-slate-300 hover:text-white" to="/rrr-road">
              {t("nav.rrr")}
            </NavLink>
          </div>
        </div>
      </footer>
    </div>
  );
}
