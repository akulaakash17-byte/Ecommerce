import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const adminItems = [
  { to: "/admin", label: "Overview", end: true },
  { to: "/admin/properties", label: "Properties" },
  { to: "/admin/properties/new", label: "Add Property" },
  { to: "/admin/inquiries", label: "Inquiries" },
  { to: "/admin/follow-ups", label: "Follow-ups" },
  { to: "/admin/users", label: "Users", adminOnly: true },
  { to: "/admin/audit-logs", label: "Audit Logs", adminOnly: true },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const signOut = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
        <aside className="border-b border-slate-200 bg-white lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between gap-4 p-5 lg:block">
            <div>
              <p className="text-lg font-black">{user?.role === "admin" ? "Office Admin" : "Agent Panel"}</p>
              <p className="text-sm font-semibold text-slate-500">{user?.name}</p>
            </div>
            <button className="btn-secondary lg:mt-6" onClick={signOut} type="button">Logout</button>
          </div>
          <nav className="flex gap-2 overflow-x-auto px-4 pb-4 lg:grid lg:px-5">
            {adminItems.filter((item) => !item.adminOnly || user?.role === "admin").map((item) => (
              <NavLink
                className={({ isActive }) =>
                  `whitespace-nowrap rounded-md px-3 py-2 text-sm font-extrabold transition ${
                    isActive ? "bg-brand-700 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                  }`
                }
                end={item.end}
                key={item.to}
                to={item.to}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className="min-w-0 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
