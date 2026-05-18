import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();

  useDocumentMeta({
    title: t("home.metaTitle"),
    description: t("home.metaDescription"),
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
        setMandals(mandalResult.slice(0, 20));
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

  const highlights = [
    [t("home.highlights.verifiedTitle"), t("home.highlights.verifiedText")],
    [t("home.highlights.offlineTitle"), t("home.highlights.offlineText")],
    [t("home.highlights.localTitle"), t("home.highlights.localText")],
  ];
  const steps = [
    ["1", t("home.steps.shortlist"), t("home.steps.shortlistText")],
    ["2", t("home.steps.contact"), t("home.steps.contactText")],
    ["3", t("home.steps.visit"), t("home.steps.visitText")],
  ];
  const firstMandalRow = mandals.slice(0, Math.ceil(mandals.length / 2));
  const secondMandalRow = mandals.slice(Math.ceil(mandals.length / 2));
  const mandalPath = (mandal) => `/properties/mandal/${encodeURIComponent(mandal.replace(/\s+/g, "-"))}`;

  const renderMandalRow = (rowMandals, direction = "left") => (
    <div className={`mandal-marquee mt-4 overflow-hidden py-2 ${direction === "right" ? "mandal-marquee-reverse" : ""}`}>
      <div className="mandal-marquee-track flex w-max gap-3">
        {[...rowMandals, ...rowMandals].map((mandal, index) => (
          <Link
            aria-hidden={index >= rowMandals.length}
            className="group w-56 shrink-0 rounded-lg border border-slate-200 bg-white p-5 font-black text-slate-800 shadow-sm transition hover:-translate-y-1 hover:border-brand-600 hover:text-brand-700 hover:shadow-soft"
            key={`${direction}-${mandal}-${index}`}
            tabIndex={index >= rowMandals.length ? -1 : undefined}
            to={mandalPath(mandal)}
          >
            <span>{mandal}</span>
            <span className="mt-3 block text-xs font-extrabold uppercase text-slate-400 group-hover:text-brand-600">{t("common.browseListings")}</span>
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <img alt="Real estate property in Telangana" className="absolute inset-0 h-full w-full object-cover opacity-55" src={HERO_IMAGE} />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/75 to-slate-950/25" />
        <div className="container-page relative grid min-h-[560px] items-center py-14 sm:min-h-[620px] md:py-20">
          <div className="max-w-3xl">
            <p className="inline-flex rounded-md border border-white/20 bg-white/10 px-3 py-2 text-xs font-black uppercase text-brand-100 backdrop-blur">
              {t("home.eyebrow")}
            </p>
            <h1 className="mt-5 max-w-3xl text-3xl font-black leading-tight sm:text-4xl md:text-6xl">
              {t("home.title")}
            </h1>
            <p className="mt-4 max-w-2xl text-xl font-bold leading-8 text-slate-100">
              {t("home.subtitle")}
            </p>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-200 md:text-lg">
              {t("home.intro")}
            </p>
            <form className="mt-8 flex max-w-2xl flex-col gap-3 rounded-lg border border-white/20 bg-white p-3 shadow-soft sm:flex-row" onSubmit={search}>
              <input
                className="field flex-1 border-transparent py-3 text-base"
                onChange={(event) => setQ(event.target.value)}
                placeholder={t("home.searchPlaceholder")}
                value={q}
              />
              <button className="btn-primary px-6 py-3 text-base" type="submit">{t("common.searchProperties")}</button>
            </form>
            <div className="mt-7 grid max-w-3xl gap-3 sm:grid-cols-3">
              {highlights.map(([title, text]) => (
                <div className="rounded-lg border border-white/15 bg-white/10 p-4 backdrop-blur" key={title}>
                  <p className="text-lg font-black">{title}</p>
                  <p className="mt-1 text-sm leading-5 text-slate-200">{text}</p>
                </div>
              ))}
            </div>
            <p className="mt-5 text-sm font-semibold text-slate-200">{OFFICE_ADDRESS}</p>
            <div className="mt-8 grid max-w-3xl gap-3 sm:grid-cols-4">
              {[
                ["100%", "Offline support"],
                ["20+", "Local mandals"],
                ["Verified", "Listing checks"],
                ["Fast", "Site visit help"],
              ].map(([value, label]) => (
                <div className="border-l border-white/25 pl-4" key={label}>
                  <p className="text-2xl font-black">{value}</p>
                  <p className="mt-1 text-xs font-bold uppercase text-slate-200">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-14">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">{t("home.popularMandals")}</p>
            <h2 className="section-title mt-2">{t("home.localDemandAreas")}</h2>
          </div>
          <Link className="btn-secondary self-start md:self-end" to="/properties">{t("common.viewAllListings")}</Link>
        </div>
        <div className="mt-4">
          {renderMandalRow(firstMandalRow, "left")}
          {renderMandalRow(secondMandalRow, "right")}
        </div>
      </section>

      <section className="bg-white/60 py-12">
        <div className="container-page">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="eyebrow">{t("home.featured")}</p>
              <h2 className="section-title mt-2">{t("home.recentListings")}</h2>
            </div>
            <Link className="btn-secondary" to="/properties">{t("common.exploreMore")}</Link>
          </div>
          <div className="mt-7 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {loading
              ? Array.from({ length: 6 }).map((_, index) => <PropertyCardSkeleton key={index} />)
              : properties.map((property) => <PropertyCard key={property.id} property={property} />)}
          </div>
          {!loading && !properties.length ? (
            <div className="mt-7">
              <EmptyState title={t("home.noPropertiesTitle")} message={t("home.noPropertiesMessage")} />
            </div>
          ) : null}
        </div>
      </section>

      <section className="container-page py-12">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">{t("home.howItWorks")}</p>
            <h2 className="section-title mt-2">{t("home.offlineSupport")}</h2>
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {steps.map(([step, title, text]) => (
            <div className="card p-6" key={step}>
              <span className="grid h-10 w-10 place-items-center rounded-md bg-brand-50 text-sm font-black text-brand-700">{step}</span>
              <h3 className="mt-4 text-lg font-black text-slate-950">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page py-10">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">{t("nav.faq")}</p>
            <h2 className="section-title mt-2">{t("home.faqHeading")}</h2>
          </div>
          <Link className="btn-secondary" to="/faq">{t("home.viewFaq")}</Link>
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
