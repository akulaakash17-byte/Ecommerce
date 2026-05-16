import { useCallback, useEffect, useState } from "react";
import EmptyState from "../../components/common/EmptyState";
import ErrorMessage from "../../components/common/ErrorMessage";
import SearchSelect from "../../components/forms/SearchSelect";
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
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
        <div className="hidden grid-cols-[1fr_1fr_120px_140px] gap-4 border-b border-slate-100 bg-slate-50 p-4 text-sm font-black text-slate-500 md:grid">
          <span>User</span><span>Contact</span><span>Role</span><span>Created</span>
        </div>
        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="p-5 text-sm font-bold text-slate-500">Loading users...</div>
          ) : users.map((item) => (
            <div className="grid gap-3 p-4 md:grid-cols-[1fr_1fr_120px_140px] md:items-center" key={item.id}>
              <div>
                <p className="font-black">{item.name}</p>
                <p className="text-sm text-slate-500">{item.email}</p>
              </div>
              <p className="text-sm font-semibold text-slate-600">{item.phone || "No phone"}</p>
              <p className="text-sm font-black capitalize text-slate-700">{item.role}</p>
              <p className="text-sm text-slate-500">{formatDate(item.created_at)}</p>
            </div>
          ))}
        </div>
      </div>
      {!loading && !users.length ? <div className="mt-5"><EmptyState title="No users" message="Create the first user from this page." /></div> : null}
    </div>
  );
}
