import { useCallback, useEffect, useState } from "react";
import EmptyState from "../../components/common/EmptyState";
import ErrorMessage from "../../components/common/ErrorMessage";
import Pagination from "../../components/common/Pagination";
import SearchSelect from "../../components/forms/SearchSelect";
import { useAuth } from "../../context/AuthContext";
import { followUpService } from "../../services/followUpService";
import { formatDate } from "../../utils/formatters";
import { createMailtoUrl } from "../../utils/email";

const initialForm = {
  customer_name: "",
  phone: "",
  email: "",
  message: "",
  next_action: "",
};

function StatusBadge({ status }) {
  const classes = {
    accepted: "bg-brand-50 text-brand-700",
    rejected: "bg-red-50 text-red-700",
    pending: "bg-amber-50 text-amber-700",
  };

  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-black capitalize ${classes[status] || classes.pending}`}>
      {status}
    </span>
  );
}

export default function AdminFollowUps() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [filters, setFilters] = useState({ q: "", status: "", page: 1 });
  const [result, setResult] = useState({ data: [], meta: null });
  const [form, setForm] = useState(initialForm);
  const [adminNote, setAdminNote] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    setError("");
    followUpService
      .list({ ...filters, limit: 10 })
      .then(setResult)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, [filters]);

  useEffect(() => {
    load();
  }, [load]);

  const updateForm = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await followUpService.create(form);
      setForm(initialForm);
      setSuccess("Follow-up submitted to admin.");
      load();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const changeStatus = async (followUp, status) => {
    setError("");
    setSuccess("");

    try {
      await followUpService.updateStatus(followUp.id, {
        status,
        admin_note: adminNote[followUp.id] || "",
      });
      setSuccess(`Follow-up ${status}.`);
      load();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <p className="eyebrow">Agent follow-ups</p>
        <h1 className="mt-2 text-3xl font-black">
          {isAdmin ? "Review agent follow-ups" : "Submit follow-ups"}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Agents can submit buyer follow-up notes. Admin can accept or reject them after review.
        </p>
      </div>

      <ErrorMessage message={error} />
      {success ? (
        <div className="mb-5 rounded-md border border-brand-100 bg-brand-50 px-4 py-3 text-sm font-bold text-brand-700">
          {success}
        </div>
      ) : null}

      {!isAdmin ? (
        <form className="card mb-6 grid gap-4 p-5 md:grid-cols-2" onSubmit={submit}>
          <div>
            <label className="label" htmlFor="customer_name">Customer name</label>
            <input className="field" id="customer_name" onChange={(event) => updateForm("customer_name", event.target.value)} required value={form.customer_name} />
          </div>
          <div>
            <label className="label" htmlFor="phone">Phone</label>
            <input className="field" id="phone" onChange={(event) => updateForm("phone", event.target.value)} value={form.phone} />
          </div>
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input className="field" id="email" onChange={(event) => updateForm("email", event.target.value)} type="email" value={form.email} />
          </div>
          <div>
            <label className="label" htmlFor="next_action">Next action</label>
            <input className="field" id="next_action" onChange={(event) => updateForm("next_action", event.target.value)} placeholder="Call back, site visit, document check..." value={form.next_action} />
          </div>
          <div className="md:col-span-2">
            <label className="label" htmlFor="message">Follow-up note</label>
            <textarea className="field min-h-28" id="message" onChange={(event) => updateForm("message", event.target.value)} required value={form.message} />
          </div>
          <div className="md:col-span-2">
            <button className="btn-primary" disabled={saving} type="submit">
              {saving ? "Submitting..." : "Submit to admin"}
            </button>
          </div>
        </form>
      ) : null}

      <div className="card mb-5 grid gap-3 p-4 md:grid-cols-3">
        <input
          className="field"
          onChange={(event) => setFilters((current) => ({ ...current, q: event.target.value, page: 1 }))}
          placeholder="Search follow-ups"
          value={filters.q}
        />
        <SearchSelect
          isClearable
          onChange={(value) => setFilters((current) => ({ ...current, status: value, page: 1 }))}
          options={["pending", "accepted", "rejected"]}
          placeholder="All status"
          value={filters.status}
        />
      </div>

      <div className="card divide-y divide-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-5 text-sm font-bold text-slate-500">Loading follow-ups...</div>
        ) : result.data.map((followUp) => (
          <div className="grid gap-4 p-5 xl:grid-cols-[1fr_1.4fr_1fr]" key={followUp.id}>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-black">{followUp.customer_name}</p>
                <StatusBadge status={followUp.status} />
              </div>
              <p className="mt-1 text-sm font-semibold text-slate-500">
                Agent: {followUp.agent_name || "Unknown"}
              </p>
              <p className="mt-1 text-sm text-slate-500">{formatDate(followUp.created_at)}</p>
              <div className="mt-3 space-y-1 text-sm">
                {followUp.phone ? <a className="block font-bold text-brand-700" href={`tel:${followUp.phone}`}>{followUp.phone}</a> : null}
                {followUp.email ? (
                  <a
                    className="block font-bold text-brand-700"
                    href={createMailtoUrl({
                      email: followUp.email,
                      subject: "Follow-up from Siddipet Real Estate",
                      body: `Hi ${followUp.customer_name},

This is regarding your property inquiry with Siddipet Real Estate.

Follow-up note:
${followUp.message}

Please reply with a convenient time to discuss further.`,
                    })}
                  >
                    {followUp.email}
                  </a>
                ) : null}
              </div>
            </div>

            <div>
              <p className="text-sm leading-6 text-slate-700">{followUp.message}</p>
              {followUp.next_action ? (
                <p className="mt-3 text-sm font-bold text-slate-600">Next: {followUp.next_action}</p>
              ) : null}
              {followUp.admin_note ? (
                <p className="mt-3 rounded-md bg-slate-50 p-3 text-sm font-semibold text-slate-600">
                  Admin note: {followUp.admin_note}
                </p>
              ) : null}
            </div>

            <div>
              {isAdmin && followUp.status === "pending" ? (
                <div className="grid gap-2">
                  <textarea
                    className="field min-h-20"
                    onChange={(event) => setAdminNote((current) => ({ ...current, [followUp.id]: event.target.value }))}
                    placeholder="Admin note"
                    value={adminNote[followUp.id] || ""}
                  />
                  <div className="flex gap-2">
                    <button className="btn-primary px-3 py-2" onClick={() => changeStatus(followUp, "accepted")} type="button">
                      Accept
                    </button>
                    <button className="btn-secondary px-3 py-2 text-red-700 hover:border-red-300 hover:text-red-800" onClick={() => changeStatus(followUp, "rejected")} type="button">
                      Reject
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm font-semibold text-slate-500">
                  {followUp.status === "accepted" ? "Accepted by admin" : followUp.status === "rejected" ? "Rejected by admin" : "Waiting for admin"}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {!loading && !result.data.length ? (
        <div className="mt-5">
          <EmptyState title="No follow-ups yet" message="Agent follow-ups will appear here." />
        </div>
      ) : null}
      <Pagination meta={result.meta} onPageChange={(page) => setFilters((current) => ({ ...current, page }))} />
    </div>
  );
}
