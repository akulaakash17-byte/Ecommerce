import { NavLink, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ChatbotWidget from "../components/common/ChatbotWidget";
import FloatingWhatsAppButton from "../components/common/FloatingWhatsAppButton";
import LanguageTranslator from "../components/common/LanguageTranslator";
import { OFFICE_ADDRESS, OFFICE_EMAILS, OFFICE_PHONES } from "../data/propertyTypes";
import { createMailtoUrl } from "../utils/email";

const navItems = [
  { to: "/", labelKey: "nav.home" },
  { to: "/properties", labelKey: "nav.listings" },
  { to: "/rrr-road", labelKey: "nav.rrr" },
  { to: "/about", labelKey: "nav.about" },
  { to: "/faq", labelKey: "nav.faq" },
  { to: "/contact", labelKey: "nav.contact" },
];

export default function PublicLayout() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen text-ink">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-xl">
        <nav className="container-page flex min-h-16 flex-wrap items-center justify-between gap-3 py-2">
          <NavLink className="flex min-w-0 flex-1 items-center gap-3 text-lg font-black text-slate-950 md:flex-none" to="/">
            <img alt="" className="h-10 w-10 rounded-md shadow-sm" src="/favicon.svg" />
            <span className="min-w-0">
              {t("common.brand")}
              <span className="block text-xs font-extrabold uppercase text-slate-500">{t("common.officeShort")}</span>
            </span>
          </NavLink>
          <div className="order-3 flex w-full gap-2 overflow-x-auto pb-1 md:order-none md:w-auto md:items-center md:gap-2 md:overflow-visible md:pb-0">
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
          <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
            <LanguageTranslator />
            <NavLink className="btn-primary whitespace-nowrap px-3 py-2 sm:px-4 sm:py-2.5" to="/login">{t("common.agentLogin")}</NavLink>
          </div>
        </nav>
      </header>

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
