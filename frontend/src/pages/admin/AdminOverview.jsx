import { useEffect, useState } from "react";
import ErrorMessage from "../../components/common/ErrorMessage";
import { TableSkeleton } from "../../components/common/LoadingSkeleton";
import { dashboardService } from "../../services/dashboardService";
import { formatDate, formatPrice } from "../../utils/formatters";

function StatCard({ label, value }) {
  return (
    <div className="card p-5">
      <p className="text-sm font-black uppercase text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-black text-slate-950">{value ?? 0}</p>
    </div>
  );
}

export default function AdminOverview() {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    dashboardService
      .overview()
      .then((data) => {
        if (active) setOverview(data);
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
  }, []);

  return (
    <div>
      <div className="mb-6">
        <p className="eyebrow">Dashboard</p>
        <h1 className="mt-2 text-3xl font-black">Office overview</h1>
      </div>
      <ErrorMessage message={error} />
      {loading ? (
        <TableSkeleton />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <StatCard label="Total" value={overview?.stats.total} />
            <StatCard label="Available" value={overview?.stats.available} />
            <StatCard label="Sold" value={overview?.stats.sold} />
            <StatCard label="Verified" value={overview?.stats.verified} />
            <StatCard label="Leads" value={overview?.stats.leads} />
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-2">
            <section className="card overflow-hidden">
              <div className="border-b border-slate-100 p-5">
                <h2 className="text-lg font-black">Recent properties</h2>
              </div>
              <div className="divide-y divide-slate-100">
                {overview?.recentProperties.map((property) => (
                  <div className="flex items-center justify-between gap-4 p-5" key={property.id}>
                    <div>
                      <p className="font-black">{property.title}</p>
                      <p className="mt-1 text-sm text-slate-500">{property.village}, {property.mandal}</p>
                    </div>
                    <p className="font-black text-brand-700">{formatPrice(property.price)}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="card overflow-hidden">
              <div className="border-b border-slate-100 p-5">
                <h2 className="text-lg font-black">Recent inquiries</h2>
              </div>
              <div className="divide-y divide-slate-100">
                {overview?.recentInquiries.map((inquiry) => (
                  <div className="p-5" key={inquiry.id}>
                    <div className="flex items-center justify-between gap-4">
                      <p className="font-black">{inquiry.name}</p>
                      <p className="text-sm text-slate-500">{formatDate(inquiry.created_at)}</p>
                    </div>
                    <p className="mt-1 text-sm font-semibold text-slate-600">{inquiry.phone}</p>
                    <p className="mt-2 line-clamp-2 text-sm text-slate-600">{inquiry.message}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
}
