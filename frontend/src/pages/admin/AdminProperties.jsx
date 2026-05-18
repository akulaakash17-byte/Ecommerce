import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EmptyState from "../../components/common/EmptyState";
import ErrorMessage from "../../components/common/ErrorMessage";
import Pagination from "../../components/common/Pagination";
import SearchSelect from "../../components/forms/SearchSelect";
import { PROPERTY_TYPES } from "../../data/propertyTypes";
import { propertyService } from "../../services/propertyService";
import { formatPrice } from "../../utils/formatters";

export default function AdminProperties() {
  const [filters, setFilters] = useState({ q: "", status: "", property_type: "", page: 1 });
  const [result, setResult] = useState({ data: [], meta: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    setError("");
    propertyService
      .list({ ...filters, includeSold: "true", limit: 10 })
      .then(setResult)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, [filters]);

  useEffect(() => {
    load();
  }, [load]);

  const remove = async (property) => {
    const confirmed = window.confirm(`Delete "${property.title}"?`);
    if (!confirmed) return;

    try {
      await propertyService.remove(property.id);
      load();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const markSold = async (property) => {
    const formData = new FormData();
    Object.entries({
      title: property.title,
      description: property.description,
      price: property.price,
      district: property.district,
      mandal: property.mandal,
      village: property.village,
      property_type: property.property_type,
      land_area: property.land_area || "",
      owner_name: property.owner_name || "",
      phone: property.phone,
      is_verified: property.is_verified,
      status: property.status === "sold" ? "available" : "sold",
      existingImages: JSON.stringify(property.images || []),
      existingVideo: property.video_url || "",
    }).forEach(([key, value]) => formData.append(key, value));

    try {
      await propertyService.update(property.id, formData);
      load();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="eyebrow">Property management</p>
          <h1 className="mt-2 text-3xl font-black">Listings</h1>
        </div>
        <Link className="btn-primary" to="/admin/properties/new">Add property</Link>
      </div>
      <ErrorMessage message={error} />

      <div className="card mb-5 grid gap-3 p-4 md:grid-cols-4">
        <input
          className="field"
          onChange={(event) => setFilters((current) => ({ ...current, q: event.target.value, page: 1 }))}
          placeholder="Search properties"
          value={filters.q}
        />
        <SearchSelect
          isClearable
          onChange={(value) => setFilters((current) => ({ ...current, status: value, page: 1 }))}
          options={["available", "sold"]}
          placeholder="All status"
          value={filters.status}
        />
        <SearchSelect
          isClearable
          onChange={(value) => setFilters((current) => ({ ...current, property_type: value, page: 1 }))}
          options={PROPERTY_TYPES}
          placeholder="All types"
          value={filters.property_type}
        />
      </div>

      <div className="card overflow-hidden">
        <div className="hidden grid-cols-[1.4fr_1fr_1fr_1fr_1.2fr] gap-4 border-b border-slate-100 bg-slate-50 p-4 text-sm font-black text-slate-500 xl:grid">
          <span>Property</span><span>Location</span><span>Price</span><span>Status</span><span>Actions</span>
        </div>
        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="p-5 text-sm font-bold text-slate-500">Loading properties...</div>
          ) : result.data.map((property) => (
            <div className="grid gap-3 p-4 xl:grid-cols-[1.4fr_1fr_1fr_1fr_1.2fr] xl:items-center" key={property.id}>
              <div>
                <p className="font-black">{property.title}</p>
                <p className="text-sm text-slate-500">{property.property_type}</p>
              </div>
              <p className="text-sm font-bold text-slate-600">{property.village}, {property.mandal}</p>
              <p className="font-black">{formatPrice(property.price)}</p>
              <span className="text-sm font-black capitalize text-slate-700">{property.status}</span>
              <div className="flex flex-wrap gap-2">
                <Link className="btn-secondary px-3 py-2" to={`/admin/properties/${property.id}/edit`}>Edit</Link>
                <button className="btn-secondary px-3 py-2" onClick={() => markSold(property)} type="button">
                  {property.status === "sold" ? "Available" : "Sold"}
                </button>
                <button className="btn-secondary px-3 py-2 text-red-700 hover:border-red-300 hover:text-red-800" onClick={() => remove(property)} type="button">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {!loading && !result.data.length ? <div className="mt-5"><EmptyState title="No properties" message="Create the first listing from the dashboard." /></div> : null}
      <Pagination meta={result.meta} onPageChange={(page) => setFilters((current) => ({ ...current, page }))} />
    </div>
  );
}
