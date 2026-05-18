import { useCallback, useEffect, useState } from "react";
import EmptyState from "../../components/common/EmptyState";
import ErrorMessage from "../../components/common/ErrorMessage";
import Pagination from "../../components/common/Pagination";
import SearchSelect from "../../components/forms/SearchSelect";
import { useAuth } from "../../context/AuthContext";
import { inquiryService } from "../../services/inquiryService";
import { notificationService } from "../../services/notificationService";
import { formatDate } from "../../utils/formatters";

const inquiryStatuses = ["new", "contacted", "closed"];

function StatusBadge({ status }) {
  const classes = {
    new: "bg-amber-50 text-amber-700",
    contacted: "bg-brand-50 text-brand-700",
    closed: "bg-slate-100 text-slate-700",
    sent: "bg-brand-50 text-brand-700",
    failed: "bg-red-50 text-red-700",
    skipped: "bg-slate-100 text-slate-600",
  };

  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-black capitalize ${classes[status] || classes.new}`}>
      {status}
    </span>
  );
}

export default function AdminInquiries() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [filters, setFilters] = useState({ q: "", status: "", page: 1 });
  const [result, setResult] = useState({ data: [], meta: null });
  const [logs, setLogs] = useState({ data: [], meta: null });
  const [logPage, setLogPage] = useState(1);
  const [statusNotes, setStatusNotes] = useState({});
  const [loading, setLoading] = useState(true);
  const [logsLoading, setLogsLoading] = useState(false);
  const [error, setError] = useState("");

  const loadInquiries = useCallback(() => {
    setLoading(true);
    setError("");
    inquiryService
      .list({ ...filters, limit: 15 })
      .then(setResult)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, [filters]);

  const loadLogs = useCallback(() => {
    if (!isAdmin) return;

    setLogsLoading(true);
    notificationService
      .list({ page: logPage, limit: 8 })
      .then(setLogs)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLogsLoading(false));
  }, [isAdmin, logPage]);

  useEffect(() => {
    loadInquiries();
  }, [loadInquiries]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const updateStatus = async (inquiry, status) => {
    setError("");

    try {
      await inquiryService.updateStatus(inquiry.id, {
        status,
        status_note: statusNotes[inquiry.id] || inquiry.status_note || "",
      });
      loadInquiries();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const deleteInquiry = async (inquiry) => {
    const confirmed = window.confirm(`Delete inquiry #${inquiry.id} from ${inquiry.name}? This cannot be undone.`);

    if (!confirmed) return;

    setError("");

    try {
      await inquiryService.remove(inquiry.id);
      setStatusNotes((current) => {
        const next = { ...current };
        delete next[inquiry.id];
        return next;
      });
      loadInquiries();
      loadLogs();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <p className="eyebrow">Leads</p>
        <h1 className="mt-2 text-3xl font-black">Inquiries</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Track every buyer inquiry from new lead to contacted or closed, and review notification delivery attempts.
        </p>
      </div>
      <ErrorMessage message={error} />

      <div className="card mb-5 grid gap-3 p-4 md:grid-cols-[1fr_220px]">
        <input
          className="field"
          onChange={(event) => setFilters((current) => ({ ...current, q: event.target.value, page: 1 }))}
          placeholder="Search by name, phone, or property"
          value={filters.q}
        />
        <SearchSelect
          isClearable
          onChange={(value) => setFilters((current) => ({ ...current, status: value, page: 1 }))}
          options={inquiryStatuses}
          placeholder="All statuses"
          value={filters.status}
        />
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-5 text-sm font-bold text-slate-500">Loading inquiries...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] table-fixed text-left">
              <thead className="bg-slate-50 text-xs font-black uppercase text-slate-500">
                <tr>
                  <th className="w-[210px] px-5 py-3">Lead</th>
                  <th className="w-[190px] px-5 py-3">Property</th>
                  <th className="px-5 py-3">Message</th>
                  <th className="w-[190px] px-5 py-3">Tracking</th>
                  <th className="w-[280px] px-5 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {result.data.map((inquiry) => (
                  <tr className="align-top" key={inquiry.id}>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-black text-slate-950">{inquiry.name}</p>
                        <StatusBadge status={inquiry.status} />
                      </div>
                      <p className="mt-1 text-sm font-semibold text-slate-500">{inquiry.phone}</p>
                      <p className="mt-1 text-xs font-bold text-slate-400">Inquiry #{inquiry.id}</p>
                    </td>
                    <td className="px-5 py-4 text-sm font-bold text-slate-700">
                      {inquiry.property_title || "General inquiry"}
                    </td>
                    <td className="px-5 py-4">
                      <p className="line-clamp-4 text-sm leading-6 text-slate-600">{inquiry.message}</p>
                      {inquiry.status_note ? (
                        <p className="mt-3 rounded-md bg-slate-50 p-3 text-sm font-semibold text-slate-600">
                          Note: {inquiry.status_note}
                        </p>
                      ) : null}
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-bold text-slate-700">{formatDate(inquiry.created_at)}</p>
                      <p className="mt-1 text-xs font-semibold text-slate-400">
                        Updated {formatDate(inquiry.updated_at)}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="grid gap-2">
                        <textarea
                          className="field min-h-20"
                          onChange={(event) => setStatusNotes((current) => ({ ...current, [inquiry.id]: event.target.value }))}
                          placeholder="Status note"
                          value={statusNotes[inquiry.id] ?? inquiry.status_note ?? ""}
                        />
                        <div className="flex flex-wrap gap-2">
                          {inquiryStatuses.map((status) => (
                            <button
                              className={status === inquiry.status ? "btn-primary px-3 py-2" : "btn-secondary px-3 py-2"}
                              key={status}
                              onClick={() => updateStatus(inquiry, status)}
                              type="button"
                            >
                              {status}
                            </button>
                          ))}
                          {isAdmin ? (
                            <button
                              className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-black text-red-700 transition hover:-translate-y-0.5 hover:bg-red-100"
                              onClick={() => deleteInquiry(inquiry)}
                              type="button"
                            >
                              Delete
                            </button>
                          ) : null}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {!loading && !result.data.length ? <div className="mt-5"><EmptyState title="No inquiries yet" message="Public inquiries will appear here." /></div> : null}
      <Pagination meta={result.meta} onPageChange={(page) => setFilters((current) => ({ ...current, page }))} />

      {isAdmin ? (
        <section className="mt-10">
          <div className="mb-4">
            <p className="eyebrow">Notifications</p>
            <h2 className="mt-2 text-2xl font-black">Delivery logs</h2>
          </div>
          <div className="card divide-y divide-slate-100 overflow-hidden">
            {logsLoading ? (
              <div className="p-5 text-sm font-bold text-slate-500">Loading notification logs...</div>
            ) : logs.data.map((log) => (
              <div className="grid gap-3 p-5 lg:grid-cols-[140px_1fr_120px_130px]" key={log.id}>
                <div>
                  <p className="font-black capitalize">{log.channel.replaceAll("_", " ")}</p>
                  <p className="mt-1 text-xs text-slate-500">{formatDate(log.created_at)}</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-700">{log.recipient || "No recipient configured"}</p>
                  <p className="mt-1 text-sm text-slate-500">{log.inquiry_name || "Unknown inquiry"} {log.inquiry_phone ? `- ${log.inquiry_phone}` : ""}</p>
                  {log.error_message ? <p className="mt-2 text-sm font-semibold text-red-700">{log.error_message}</p> : null}
                </div>
                <StatusBadge status={log.status} />
                <p className="text-sm text-slate-500">Inquiry #{log.inquiry_id || "n/a"}</p>
              </div>
            ))}
          </div>
          {!logsLoading && !logs.data.length ? <div className="mt-5"><EmptyState title="No notification logs" message="Logs appear after new inquiry notifications run." /></div> : null}
          <Pagination meta={logs.meta} onPageChange={setLogPage} />
        </section>
      ) : null}
    </div>
  );
}
