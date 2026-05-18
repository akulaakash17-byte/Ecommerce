import { useCallback, useEffect, useState } from "react";
import EmptyState from "../../components/common/EmptyState";
import ErrorMessage from "../../components/common/ErrorMessage";
import SearchSelect from "../../components/forms/SearchSelect";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/authService";
import { formatDate } from "../../utils/formatters";

const initialForm = {
  name: "",
  phone: "",
  email: "",
  password: "",
  role: "agent",
};

export default function AdminUsers() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [ownPassword, setOwnPassword] = useState({ currentPassword: "", newPassword: "" });
  const [resetPasswords, setResetPasswords] = useState({});
  const [activeResetId, setActiveResetId] = useState(null);
  const [filters, setFilters] = useState({ q: "", role: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [resetSaving, setResetSaving] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    setError("");
    authService
      .listUsers()
      .then(setUsers)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const update = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const updateOwnPassword = (key, value) => {
    setOwnPassword((current) => ({ ...current, [key]: value }));
  };

  const updateResetPassword = (id, value) => {
    setResetPasswords((current) => ({ ...current, [id]: value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await authService.createUser(form);
      setForm(initialForm);
      setSuccess("User created.");
      load();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const changeOwnPassword = async (event) => {
    event.preventDefault();
    setPasswordSaving(true);
    setError("");
    setSuccess("");

    try {
      await authService.changePassword(ownPassword);
      setOwnPassword({ currentPassword: "", newPassword: "" });
      setSuccess("Your password was changed.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setPasswordSaving(false);
    }
  };

  const resetPassword = async (item) => {
    const password = resetPasswords[item.id] || "";

    if (password.length < 8) {
      setError("Reset password must be at least 8 characters.");
      return;
    }

    if (!window.confirm(`Reset password for ${item.email}?`)) {
      return;
    }

    setResetSaving((current) => ({ ...current, [item.id]: true }));
    setError("");
    setSuccess("");

    try {
      await authService.resetPassword(item.id, { password });
      updateResetPassword(item.id, "");
      setActiveResetId(null);
      setSuccess(`Password reset for ${item.email}.`);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setResetSaving((current) => ({ ...current, [item.id]: false }));
    }
  };

  const filteredUsers = users.filter((item) => {
    const query = filters.q.trim().toLowerCase();
    const matchesQuery = query
      ? [item.name, item.email, item.phone].filter(Boolean).some((value) => value.toLowerCase().includes(query))
      : true;
    const matchesRole = filters.role ? item.role === filters.role : true;
    return matchesQuery && matchesRole;
  });

  return (
    <div>
      <div className="mb-6">
        <p className="eyebrow">Access control</p>
        <h1 className="mt-2 text-3xl font-black">Admin users</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Create office admins and agents without running a terminal seed script.
        </p>
      </div>

      <ErrorMessage message={error} />
      {success ? (
        <div className="mb-5 rounded-md border border-brand-100 bg-brand-50 px-4 py-3 text-sm font-bold text-brand-700">
          {success}
        </div>
      ) : null}

      <section className="card mb-6 p-5">
        <div className="mb-4">
          <h2 className="text-xl font-black">Change my password</h2>
          <p className="mt-1 text-sm font-semibold text-slate-500">{user?.email}</p>
        </div>
        <form className="grid gap-4 md:grid-cols-[1fr_1fr_auto]" onSubmit={changeOwnPassword}>
          <div>
            <label className="label" htmlFor="currentPassword">Current password</label>
            <input
              className="field"
              id="currentPassword"
              onChange={(event) => updateOwnPassword("currentPassword", event.target.value)}
              required
              type="password"
              value={ownPassword.currentPassword}
            />
          </div>
          <div>
            <label className="label" htmlFor="newPassword">New password</label>
            <input
              className="field"
              id="newPassword"
              minLength="8"
              onChange={(event) => updateOwnPassword("newPassword", event.target.value)}
              required
              type="password"
              value={ownPassword.newPassword}
            />
          </div>
          <div className="flex items-end">
            <button className="btn-primary w-full md:w-auto" disabled={passwordSaving} type="submit">
              {passwordSaving ? "Changing..." : "Change password"}
            </button>
          </div>
        </form>
      </section>

      <form className="card mb-6 grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-5" onSubmit={submit}>
        <div>
          <label className="label" htmlFor="name">Name</label>
          <input className="field" id="name" onChange={(event) => update("name", event.target.value)} required value={form.name} />
        </div>
        <div>
          <label className="label" htmlFor="phone">Phone</label>
          <input className="field" id="phone" onChange={(event) => update("phone", event.target.value)} value={form.phone} />
        </div>
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input className="field" id="email" onChange={(event) => update("email", event.target.value)} required type="email" value={form.email} />
        </div>
        <div>
          <label className="label" htmlFor="password">Password</label>
          <input className="field" id="password" minLength="8" onChange={(event) => update("password", event.target.value)} required type="password" value={form.password} />
        </div>
        <div>
          <label className="label" htmlFor="role">Role</label>
          <SearchSelect id="role" onChange={(value) => update("role", value)} options={["agent", "admin"]} value={form.role} />
        </div>
        <div className="md:col-span-2 xl:col-span-5">
          <button className="btn-primary" disabled={saving} type="submit">
            {saving ? "Creating..." : "Create user"}
          </button>
        </div>
      </form>

      <div className="card overflow-hidden">
        <div className="grid gap-3 border-b border-slate-100 bg-slate-50 p-4 md:grid-cols-[1fr_180px_auto] md:items-end">
          <div>
            <label className="label" htmlFor="userSearch">Search users</label>
            <input
              className="field"
              id="userSearch"
              onChange={(event) => setFilters((current) => ({ ...current, q: event.target.value }))}
              placeholder="Name, email, or phone"
              value={filters.q}
            />
          </div>
          <div>
            <label className="label" htmlFor="roleFilter">Role</label>
            <select
              className="field"
              id="roleFilter"
              onChange={(event) => setFilters((current) => ({ ...current, role: event.target.value }))}
              value={filters.role}
            >
              <option value="">All roles</option>
              <option value="admin">Admin</option>
              <option value="agent">Agent</option>
            </select>
          </div>
          <p className="text-sm font-black text-slate-500">{filteredUsers.length} shown</p>
        </div>
        <div className="hidden grid-cols-[1fr_1fr_110px_130px_260px] gap-4 border-b border-slate-100 bg-slate-50 p-4 text-sm font-black text-slate-500 xl:grid">
          <span>User</span><span>Contact</span><span>Role</span><span>Created</span><span>Account action</span>
        </div>
        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="p-5 text-sm font-bold text-slate-500">Loading users...</div>
          ) : filteredUsers.map((item) => (
            <div className="grid gap-3 p-4 xl:grid-cols-[1fr_1fr_110px_130px_260px] xl:items-center" key={item.id}>
              <div>
                <p className="font-black">{item.name}</p>
                <p className="text-sm text-slate-500">{item.email}</p>
              </div>
              <p className="text-sm font-semibold text-slate-600">{item.phone || "No phone"}</p>
              <p className="text-sm font-black capitalize text-slate-700">{item.role}</p>
              <p className="text-sm text-slate-500">{formatDate(item.created_at)}</p>
              {item.id === user?.id ? (
                <p className="text-sm font-bold text-slate-500">Use “Change my password” above.</p>
              ) : activeResetId === item.id ? (
                <div className="flex gap-2">
                  <input
                    className="field min-w-0 py-2"
                    minLength="8"
                    onChange={(event) => updateResetPassword(item.id, event.target.value)}
                    placeholder="New password"
                    type="password"
                    value={resetPasswords[item.id] || ""}
                  />
                  <button
                    className="btn-secondary px-3 py-2"
                    disabled={resetSaving[item.id]}
                    onClick={() => resetPassword(item)}
                    type="button"
                  >
                    {resetSaving[item.id] ? "Saving..." : "Save"}
                  </button>
                  <button className="btn-secondary px-3 py-2" onClick={() => setActiveResetId(null)} type="button">Cancel</button>
                </div>
              ) : (
                <button className="btn-secondary justify-self-start px-3 py-2" onClick={() => setActiveResetId(item.id)} type="button">
                  Reset password
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      {!loading && !users.length ? <div className="mt-5"><EmptyState title="No users" message="Create the first user from this page." /></div> : null}
      {!loading && users.length > 0 && !filteredUsers.length ? <div className="mt-5"><EmptyState title="No matching users" message="Try changing the search or role filter." /></div> : null}
    </div>
  );
}
