import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import EmptyState from "../../components/common/EmptyState";
import ErrorMessage from "../../components/common/ErrorMessage";
import { PropertyCardSkeleton } from "../../components/common/LoadingSkeleton";
import Pagination from "../../components/common/Pagination";
import PropertyCard from "../../components/properties/PropertyCard";
import PropertyFilters from "../../components/properties/PropertyFilters";
import { propertyService } from "../../services/propertyService";

const emptyFilters = {
  q: "",
  mandal: "",
  village: "",
  property_type: "",
  minPrice: "",
  maxPrice: "",
};

export default function ListingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState(() => ({
    ...emptyFilters,
    q: searchParams.get("q") || "",
    mandal: searchParams.get("mandal") || "",
    village: searchParams.get("village") || "",
    property_type: searchParams.get("property_type") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
  }));
  const [result, setResult] = useState({ data: [], meta: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const page = Number(searchParams.get("page") || 1);

  const query = useMemo(() => {
    const params = { ...filters, page, limit: 12 };
    Object.keys(params).forEach((key) => {
      if (!params[key]) delete params[key];
    });
    return params;
  }, [filters, page]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    propertyService
      .list(query)
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
  }, [query]);

  const applyFilters = (event) => {
    event.preventDefault();
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    setSearchParams(params);
  };

  const resetFilters = () => {
    setFilters(emptyFilters);
    setSearchParams({});
  };

  const changePage = (nextPage) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", nextPage);
    setSearchParams(params);
  };

  return (
    <main className="container-page py-10">
      <div className="mb-7">
        <p className="eyebrow">Listings</p>
        <h1 className="section-title mt-2">Properties in Siddipet district</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
          Filter by mandal, village, property type, and price. Contact happens offline through call, WhatsApp, or inquiry form.
        </p>
      </div>

      <PropertyFilters filters={filters} onChange={setFilters} onReset={resetFilters} onSubmit={applyFilters} />
      <div className="mt-6">
        <ErrorMessage message={error} />
      </div>

      <div className="mt-7 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 9 }).map((_, index) => <PropertyCardSkeleton key={index} />)
          : result.data.map((property) => <PropertyCard key={property.id} property={property} />)}
      </div>

      {!loading && !result.data.length ? (
        <div className="mt-7">
          <EmptyState title="No matching properties" message="Try changing the mandal, village, type, or price filters." />
        </div>
      ) : null}

      <Pagination meta={result.meta} onPageChange={changePage} />
    </main>
  );
}
