import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import EmptyState from "../../components/common/EmptyState";
import ErrorMessage from "../../components/common/ErrorMessage";
import { PropertyCardSkeleton } from "../../components/common/LoadingSkeleton";
import Pagination from "../../components/common/Pagination";
import PropertyCard from "../../components/properties/PropertyCard";
import PropertyFilters from "../../components/properties/PropertyFilters";
import { useDocumentMeta } from "../../hooks/useDocumentMeta";
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
  const { t } = useTranslation();

  useDocumentMeta({
    title: t("listings.metaTitle"),
    description: t("listings.metaDescription"),
    canonicalPath: "/properties",
  });

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
    <main>
      <div className="border-b border-slate-200/80 bg-white/70">
        <div className="container-page py-10">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="eyebrow">{t("listings.eyebrow")}</p>
              <h1 className="section-title mt-2">{t("listings.title")}</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                {t("listings.intro")}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <p className="text-xs font-black uppercase text-slate-500">{t("listings.availableResults")}</p>
              <p className="mt-1 text-2xl font-black text-slate-950">{result.meta?.total ?? 0}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-page py-8">
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
            <EmptyState title={t("listings.noMatchingTitle")} message={t("listings.noMatchingMessage")} />
          </div>
        ) : null}

        <Pagination meta={result.meta} onPageChange={changePage} />
      </div>
    </main>
  );
}
