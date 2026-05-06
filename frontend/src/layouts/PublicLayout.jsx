import { NavLink, Outlet } from "react-router-dom";
import { OFFICE_ADDRESS, OFFICE_PHONES } from "../data/propertyTypes";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/properties", label: "Listings" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-[#f6f8f4] text-ink">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <nav className="container-page flex min-h-16 items-center justify-between gap-4">
          <NavLink className="text-lg font-black text-slate-950" to="/">
            Siddipet Realty
          </NavLink>
          <div className="hidden items-center gap-7 md:flex">
            {navItems.map((item) => (
              <NavLink
                className={({ isActive }) =>
                  `text-sm font-extrabold transition ${
                    isActive ? "text-brand-700" : "text-slate-600 hover:text-slate-950"
                  }`
                }
                key={item.to}
                to={item.to}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
          <NavLink className="btn-primary" to="/login">Agent Login</NavLink>
        </nav>
      </header>

      <Outlet />

      <footer className="mt-16 border-t border-slate-200 bg-slate-950 text-white">
        <div className="container-page grid gap-8 py-10 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <h2 className="text-xl font-black">Siddipet Realty</h2>
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
            <NavLink className="mt-3 block text-sm text-slate-300 hover:text-white" to="/contact">
              Send inquiry
            </NavLink>
          </div>
        </div>
      </footer>
    </div>
  );
}
