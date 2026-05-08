import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import EmptyState from "../../components/common/EmptyState";
import { PropertyCardSkeleton } from "../../components/common/LoadingSkeleton";
import PropertyCard from "../../components/properties/PropertyCard";
import { FAQS } from "../../data/faqs";
import { OFFICE_ADDRESS } from "../../data/propertyTypes";
import { useDocumentMeta } from "../../hooks/useDocumentMeta";
import { locationService } from "../../services/locationService";
import { propertyService } from "../../services/propertyService";
import { HERO_IMAGE } from "../../utils/images";

export default function HomePage() {
  useDocumentMeta({
    title: "Siddipet Realty | Properties in Siddipet District",
    description: "Discover verified Siddipet district plots, land, houses, villas, and commercial properties with offline support from the Pragnapur office.",
    canonicalPath: "/",
  });

  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [mandals, setMandals] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    Promise.all([propertyService.list({ limit: 6 }), locationService.getMandals()])
      .then(([propertyResult, mandalResult]) => {
        if (!active) return;
        setProperties(propertyResult.data);
        setMandals(mandalResult.slice(0, 8));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const search = (event) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <>
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <img alt="Real estate property in Telangana" className="absolute inset-0 h-full w-full object-cover opacity-45" src={HERO_IMAGE} />
        <div className="container-page relative grid min-h-[620px] items-center py-20">
          <div className="max-w-3xl">
            <p className="eyebrow text-brand-100">Pragnapur office, Siddipet district</p>
            <h1 className="mt-4 text-4xl font-black leading-tight md:text-6xl">
              Discover local properties with offline trusted support.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-100">
              Search verified plots, agricultural land, houses, villas, and commercial spaces across Siddipet mandals. No checkout, no online payment, only real conversations with office agents.
            </p>
            <form className="mt-8 flex max-w-2xl flex-col gap-3 rounded-lg bg-white p-3 shadow-soft sm:flex-row" onSubmit={search}>
              <input
                className="field flex-1 border-transparent"
                onChange={(event) => setQ(event.target.value)}
                placeholder="Search by village, mandal, property type..."
                value={q}
              />
              <button className="btn-primary" type="submit">Search properties</button>
            </form>
            <p className="mt-4 text-sm font-semibold text-slate-200">{OFFICE_ADDRESS}</p>
          </div>
        </div>
      </section>

      <section className="container-page py-14">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">Popular mandals</p>
            <h2 className="section-title mt-2">Browse local demand areas</h2>
          </div>
          <Link className="btn-secondary" to="/properties">View all listings</Link>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {mandals.map((mandal) => (
            <Link
              className="rounded-lg border border-slate-200 bg-white p-4 font-black text-slate-800 shadow-sm transition hover:border-brand-600 hover:text-brand-700"
              key={mandal}
              to={`/properties?mandal=${encodeURIComponent(mandal)}`}
            >
              {mandal}
            </Link>
          ))}
        </div>
      </section>

      <section className="container-page py-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">Featured properties</p>
            <h2 className="section-title mt-2">Recently available listings</h2>
          </div>
        </div>
        <div className="mt-7 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, index) => <PropertyCardSkeleton key={index} />)
            : properties.map((property) => <PropertyCard key={property.id} property={property} />)}
        </div>
        {!loading && !properties.length ? (
          <div className="mt-7">
            <EmptyState title="No properties yet" message="Add listings from the admin dashboard and they will appear here." />
          </div>
        ) : null}
      </section>

      <section className="container-page py-10">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">FAQ</p>
            <h2 className="section-title mt-2">Questions buyers ask first</h2>
          </div>
          <Link className="btn-secondary" to="/faq">View all FAQs</Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {FAQS[0].items.map((item) => (
            <div className="card p-5" key={item.question}>
              <h3 className="font-black text-slate-950">{item.question}</h3>
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
