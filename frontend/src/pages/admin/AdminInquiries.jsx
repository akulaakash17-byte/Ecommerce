import { useEffect, useState } from "react";
import EmptyState from "../../components/common/EmptyState";
import ErrorMessage from "../../components/common/ErrorMessage";
import Pagination from "../../components/common/Pagination";
import { inquiryService } from "../../services/inquiryService";
import { formatDate } from "../../utils/formatters";

export default function AdminInquiries() {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [result, setResult] = useState({ data: [], meta: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    inquiryService
      .list({ q, page, limit: 15 })
      .then((data) => {
        if (active) setResult(data);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [page, q]);

  return (
    <div>
      <div className="mb-6">
        <p className="eyebrow">Leads</p>
        <h1 className="mt-2 text-3xl font-black">Inquiries</h1>
      </div>
      <ErrorMessage message={error} />
      <div className="card mb-5 p-4">
        <input className="field max-w-md" onChange={(event) => { setQ(event.target.value); setPage(1); }} placeholder="Search by name, phone, or property" value={q} />
      </div>
      <div className="card divide-y divide-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-5 text-sm font-bold text-slate-500">Loading inquiries...</div>
        ) : result.data.map((inquiry) => (
          <div className="grid gap-3 p-5 lg:grid-cols-[1fr_1fr_2fr_140px]" key={inquiry.id}>
            <div>
              <p className="font-black">{inquiry.name}</p>
              <p className="text-sm font-semibold text-slate-500">{inquiry.phone}</p>
            </div>
            <p className="text-sm font-bold text-slate-700">{inquiry.property_title || "General inquiry"}</p>
            <p className="text-sm leading-6 text-slate-600">{inquiry.message}</p>
            <p className="text-sm text-slate-500">{formatDate(inquiry.created_at)}</p>
          </div>
        ))}
      </div>
      {!loading && !result.data.length ? <div className="mt-5"><EmptyState title="No inquiries yet" message="Public inquiries will appear here." /></div> : null}
      <Pagination meta={result.meta} onPageChange={setPage} />
    </div>
  );
}
