import { useCallback, useEffect, useState } from "react";
import EmptyState from "../../components/common/EmptyState";
import ErrorMessage from "../../components/common/ErrorMessage";
import Pagination from "../../components/common/Pagination";
import SearchSelect from "../../components/forms/SearchSelect";
import { auditLogService } from "../../services/auditLogService";
import { formatDate } from "../../utils/formatters";

const actionOptions = [
  "property.created",
  "property.updated",
  "property.deleted",
  "inquiry.created",
  "inquiry.status_updated",
  "inquiry.assigned",
  "inquiry.deleted",
  "user.created",
  "user.password_changed",
  "user.password_reset",
];

const entityOptions = ["property", "inquiry", "user"];

function formatMetadata(metadata) {
  if (!metadata || !Object.keys(metadata).length) {
    return "No extra details";
  }

  return Object.entries(metadata)
    .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : String(value)}`)
    .join(" | ");
}

export default function AdminAuditLogs() {
  const [filters, setFilters] = useState({ action: "", entity_type: "", page: 1 });
  const [result, setResult] = useState({ data: [], meta: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    setError("");
    auditLogService
      .list({ ...filters, limit: 20 })
      .then(setResult)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, [filters]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div>
      <div className="mb-6">
        <p className="eyebrow">Security trail</p>
        <h1 className="mt-2 text-3xl font-black">Audit logs</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Review property, inquiry, and user changes made through the dashboard.
        </p>
      </div>
      <ErrorMessage message={error} />

      <div className="card mb-5 grid gap-3 p-4 md:grid-cols-3">
        <SearchSelect
          isClearable
          onChange={(value) => setFilters((current) => ({ ...current, action: value, page: 1 }))}
          options={actionOptions}
          placeholder="All actions"
          value={filters.action}
        />
        <SearchSelect
          isClearable
          onChange={(value) => setFilters((current) => ({ ...current, entity_type: value, page: 1 }))}
          options={entityOptions}
          placeholder="All entities"
          value={filters.entity_type}
        />
      </div>

      <div className="card overflow-hidden">
        <div className="hidden grid-cols-[170px_1fr_1fr_170px] gap-4 border-b border-slate-100 bg-slate-50 p-4 text-sm font-black text-slate-500 lg:grid">
          <span>Action</span><span>Entity</span><span>Details</span><span>Time</span>
        </div>
        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="p-5 text-sm font-bold text-slate-500">Loading audit logs...</div>
          ) : result.data.map((log) => (
            <div className="grid gap-3 p-4 lg:grid-cols-[170px_1fr_1fr_170px] lg:items-start" key={log.id}>
              <div>
                <p className="font-black text-slate-950">{log.action}</p>
                <p className="mt-1 text-xs font-semibold text-slate-500">
                  {log.actor_name || "Public/system"}
                </p>
              </div>
              <div>
                <p className="font-bold capitalize text-slate-800">{log.entity_type}</p>
                <p className="mt-1 text-sm text-slate-500">
                  {log.entity_label || `#${log.entity_id || "n/a"}`}
                </p>
              </div>
              <p className="break-words text-sm leading-6 text-slate-600">{formatMetadata(log.metadata)}</p>
              <p className="text-sm font-semibold text-slate-500">{formatDate(log.created_at)}</p>
            </div>
          ))}
        </div>
      </div>
      {!loading && !result.data.length ? (
        <div className="mt-5">
          <EmptyState title="No audit logs" message="Tracked changes will appear here." />
        </div>
      ) : null}
      <Pagination meta={result.meta} onPageChange={(page) => setFilters((current) => ({ ...current, page }))} />
    </div>
  );
}
