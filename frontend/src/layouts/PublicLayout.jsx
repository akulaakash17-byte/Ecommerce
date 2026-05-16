import { NavLink, Outlet } from "react-router-dom";
import ChatbotWidget from "../components/common/ChatbotWidget";
import FloatingWhatsAppButton from "../components/common/FloatingWhatsAppButton";
import LanguageTranslator from "../components/common/LanguageTranslator";
import { OFFICE_ADDRESS, OFFICE_EMAILS, OFFICE_PHONES } from "../data/propertyTypes";
import { createMailtoUrl } from "../utils/email";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/properties", label: "Listings" },
  { to: "/rrr-road", label: "RRR" },
  { to: "/about", label: "About" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
];

export default function PublicLayout() {
  return (
    <div className="min-h-screen text-ink">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-xl">
        <nav className="container-page flex min-h-16 flex-wrap items-center justify-between gap-3 py-2">
          <NavLink className="flex items-center gap-3 text-lg font-black text-slate-950" to="/">
            <img alt="" className="h-10 w-10 rounded-md shadow-sm" src="/favicon.svg" />
            <span>
              Siddipet Real Estate
              <span className="block text-xs font-extrabold uppercase text-slate-500">Pragnapur office</span>
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
                {item.label}
              </NavLink>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <LanguageTranslator />
            <NavLink className="btn-primary whitespace-nowrap" to="/login">Agent Login</NavLink>
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
              <h2 className="text-xl font-black">Siddipet Real Estate</h2>
            </div>
            <p className="mt-3 max-w-md text-sm leading-6 text-slate-300">
              Property discovery and listing support for Siddipet district. Deals, visits, and documentation are handled offline by the Pragnapur office.
            </p>
          </div>
          <div>
            <p className="font-black">Office</p>
            <p className="mt-3 text-sm leading-6 text-slate-300">{OFFICE_ADDRESS}</p>
          </div>
          <div>
            <p className="font-black">Contact</p>
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
              Send inquiry
            </NavLink>
            <NavLink className="mt-2 block text-sm text-slate-300 hover:text-white" to="/faq">
              FAQ
            </NavLink>
            <NavLink className="mt-2 block text-sm text-slate-300 hover:text-white" to="/rrr-road">
              RRR Road
            </NavLink>
          </div>
        </div>
      </footer>
    </div>
  );
}
