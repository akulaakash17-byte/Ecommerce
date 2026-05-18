import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EmptyState from "../../components/common/EmptyState";
import ErrorMessage from "../../components/common/ErrorMessage";
import PropertyCard from "../../components/properties/PropertyCard";
import { useDocumentMeta } from "../../hooks/useDocumentMeta";
import { propertyService } from "../../services/propertyService";
import { readSavedPropertyIds, removeSavedProperty } from "../../utils/savedProperties";

export default function SavedPropertiesPage() {
  useDocumentMeta({
    title: "Saved Properties | Siddipet Real Estate",
    description: "Review properties saved on this device and continue with call, WhatsApp, or site visit inquiry.",
    canonicalPath: "/saved",
  });

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const ids = readSavedPropertyIds();

    if (!ids.length) {
      setProperties([]);
      setLoading(false);
      return undefined;
    }

    setLoading(true);
    setError("");

    Promise.allSettled(ids.map((id) => propertyService.get(id)))
      .then((results) => {
        if (!active) return;
        const loaded = results.filter((result) => result.status === "fulfilled").map((result) => result.value);
        const missingIds = ids.filter((_, index) => results[index].status === "rejected");
        missingIds.forEach(removeSavedProperty);
        setProperties(loaded);
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

  const remove = (propertyId) => {
    removeSavedProperty(propertyId);
    setProperties((current) => current.filter((property) => property.id !== propertyId));
  };

  return (
    <main>
      <div className="border-b border-slate-200/80 bg-white/70">
        <div className="container-page py-10">
          <p className="eyebrow">Shortlist</p>
          <h1 className="section-title mt-2">Saved properties</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Properties saved on this device are collected here so buyers can compare and continue later.
          </p>
        </div>
      </div>

      <div className="container-page py-8">
        <ErrorMessage message={error} />
        {loading ? (
          <div className="rounded-lg border border-slate-200 bg-white p-5 text-sm font-bold text-slate-500">Loading saved properties...</div>
        ) : properties.length ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <div className="grid gap-3" key={property.id}>
                <PropertyCard property={property} />
                <button className="btn-secondary" onClick={() => remove(property.id)} type="button">
                  Remove from saved
                </button>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="No saved properties" message="Save properties from listings and they will appear here." />
        )}
        <div className="mt-6">
          <Link className="btn-primary" to="/properties">Browse listings</Link>
        </div>
      </div>
    </main>
  );
}
