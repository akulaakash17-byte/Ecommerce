import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useDocumentMeta } from "../../hooks/useDocumentMeta";

const sources = {
  hmda:
    "https://www.hmda.gov.in/proposed-alignment-of-100m-wide-regional-ring-road/",
  latest:
    "https://hyderabadmail.com/hyderabad-rrr-n-project-approved-23995-crore-2029-deadline/",
  hmdaNews:
    "https://www.siasat.com/hmda-releases-primary-notification-for-100m-wide-rrr-alignment-3265514/",
  villageList:
    "https://www.myopenplots.com/blog/details/complete-regional-ring-road-rrr-villages-list",
  mapLayer: "https://1acre.in/map-layers/telangana/rrr",
};

const routeSteps = [
  { label: "Sangareddy", district: "Sangareddy", type: "gateway" },
  { label: "Narsapur", district: "Medak", type: "node" },
  { label: "Toopran", district: "Medak", type: "node" },
  { label: "Gajwel", district: "Siddipet", mandal: "Gajwel", type: "siddipet" },
  { label: "Pragnapur", district: "Siddipet", mandal: "Gajwel", type: "siddipet" },
  { label: "Jagdevpur", district: "Siddipet", mandal: "Jagdevpur", type: "siddipet" },
  { label: "Bhuvanagiri", district: "Yadadri Bhuvanagiri", type: "node" },
  { label: "Choutuppal", district: "Yadadri Bhuvanagiri", type: "gateway" },
];

const siddipetMandals = [
  {
    name: "Gajwel",
    officialName: "Gajwel",
    status: "Major Siddipet-side node",
    role: "Key Pragnapur package point",
    listingTo: "/properties?mandal=Gajwel",
    villages: [
      "Bangla Venkatapur",
      "Maqat Masanpalle",
      "Mutrajpalle",
      "Pregnapur / Pragnapur",
      "Sangapur",
    ],
    extraVillages: ["Gajwel", "Komatibanda", "Srigiripalle"],
    note:
      "Gajwel is the most important Siddipet-side reference for buyers because Pragnapur is reported as the split point between the two northern packages.",
    buyerUse:
      "Best for buyers comparing access to Gajwel town, Pragnapur, Medak-side movement, and Yadadri-Bhuvanagiri-side movement.",
  },
  {
    name: "Jagdevpur",
    officialName: "Jagdevpur",
    status: "Northern corridor mandal",
    role: "Gajwel to Yadadri movement",
    listingTo: "/properties?mandal=Jagdevpur",
    villages: ["Alirajapet", "Itikyal", "Peerlapally"],
    extraVillages: [],
    note:
      "Jagdevpur is commonly discussed after Pragnapur on the Siddipet side of the northern route toward Bhuvanagiri and Choutuppal.",
    buyerUse:
      "Useful for agricultural land and plot searches where buyers want Gajwel-side access without being inside Gajwel town.",
  },
  {
    name: "Markook",
    officialName: "Markook",
    status: "Reported RRR mandal",
    role: "Village-level verification needed",
    listingTo: "/properties?mandal=Markook",
    villages: ["Angadi Kishtapur", "Cheberthy", "Erravalle", "Pamulaparthi"],
    extraVillages: [],
    note:
      "Markook appears in reported Siddipet RRR mandal lists. Treat every land parcel as survey-number specific, not just village-name specific.",
    buyerUse:
      "Good for buyers tracking long-term corridor demand, but distance from alignment must be checked carefully on official maps.",
  },
  {
    name: "Rayapol / Raipole",
    officialName: "Rayapol",
    status: "Spelling varies by source",
    role: "Search by village or ask office",
    listingTo: "/properties?q=Begumpet",
    villages: ["Begumpet", "Yelkal"],
    extraVillages: [],
    note:
      "Sources use Rayapol and Raipole spellings. The app location dataset may not expose this as a mandal filter, so search by village or contact the office.",
    buyerUse:
      "Useful when a seller markets land as Rayapol/Raipole RRR-side. Ask for the village, survey number, and official map reference.",
  },
  {
    name: "Wargal / Vargal",
    officialName: "Wargal",
    status: "Reported with spelling variants",
    role: "Medak-Gajwel comparison zone",
    listingTo: "/properties?mandal=Wargal",
    villages: ["Jabbapur", "Mentur / Nemtur", "Mylaram @ Mylaram Makhta"],
    extraVillages: [],
    note:
      "Wargal/Vargal is relevant for buyers comparing Siddipet-side villages near the Medak-Gajwel movement.",
    buyerUse:
      "Useful for buyers who care about future access, but current road approach and title quality still matter more than marketing distance.",
  },
];

const newsUpdates = [
  {
    title: "RRR-N cleared with revised project cost",
    date: "May 7, 2026",
    tag: "Latest",
    detail:
      "Hyderabad Mail reported that the Centre approved a revised RRR-N cost of Rs 23,995.60 crore, with a three-year target ending in 2029.",
    source: sources.latest,
  },
  {
    title: "Pragnapur becomes a package split point",
    date: "May 7, 2026",
    tag: "Siddipet focus",
    detail:
      "The northern corridor is reported in two packages: Girmapur to Pragnapur and Pragnapur to Tangedpalli, making Pragnapur important for Siddipet-side searches.",
    source: sources.latest,
  },
  {
    title: "HMDA published proposed 100m alignment documents",
    date: "Official reference",
    tag: "Map",
    detail:
      "HMDA hosts proposed alignment documents and annexures. Use those documents for survey-number level checking before any land decision.",
    source: sources.hmda,
  },
  {
    title: "Primary notification mentioned Siddipet mandals",
    date: "Aug 31, 2025",
    tag: "Notification",
    detail:
      "Public reporting on the HMDA notification says Siddipet district coverage includes Gajwel, Jagdevpur, Markook, Rayapol, and Vargal mandals.",
    source: sources.hmdaNews,
  },
];

const impactItems = [
  ["Connectivity", "Links national and state highways so long-distance traffic can bypass Hyderabad city."],
  ["Real estate", "Can increase attention around corridor villages, especially near interchanges and strong approach roads."],
  ["Risk", "Village name alone can be misused in marketing. The exact survey number and alignment distance matter."],
  ["Office action", "Compare the property document, map pin, village record, road access, and HMDA alignment before advising a buyer."],
];

const checks = [
  "Ask for the exact survey number, not only the village name.",
  "Compare the survey number with HMDA alignment and annexure documents.",
  "Check title, EC, prohibited land status, ownership chain, and layout approval.",
  "Confirm whether the land is in acquisition, road widening, lake, canal, buffer, or government records.",
  "Visit the site and check the real approach road, not only straight-line distance from RRR.",
  "Do not pay token money only because a seller says the land is RRR-facing.",
];

const sourceLinks = [
  ["HMDA proposed alignment", sources.hmda],
  ["Latest RRR-N project update", sources.latest],
  ["HMDA notification news", sources.hmdaNews],
  ["Compiled village list", sources.villageList],
  ["Reference map layer", sources.mapLayer],
];

export default function RrrRoadPage() {
  useDocumentMeta({
    title: "RRR Road Siddipet Map, News and Villages | Siddipet Real Estate",
    description: "Explore Hyderabad Regional Ring Road news, Siddipet mandals, villages, and buyer verification checks for Gajwel, Pragnapur, Jagdevpur, Markook, Rayapol, and Wargal.",
    canonicalPath: "/rrr-road",
  });

  const [selectedMandal, setSelectedMandal] = useState(siddipetMandals[0].name);
  const [villageQuery, setVillageQuery] = useState("");
  const [showExtraVillages, setShowExtraVillages] = useState(false);

  const currentMandal = useMemo(
    () => siddipetMandals.find((mandal) => mandal.name === selectedMandal) || siddipetMandals[0],
    [selectedMandal]
  );

  const allVillageRows = useMemo(
    () =>
      siddipetMandals.flatMap((mandal) =>
        [...mandal.villages, ...(showExtraVillages ? mandal.extraVillages : [])].map((village) => ({
          mandal: mandal.name,
          village,
          listingTo: mandal.listingTo,
        }))
      ),
    [showExtraVillages]
  );

  const filteredVillageRows = useMemo(() => {
    const normalized = villageQuery.trim().toLowerCase();
    if (!normalized) return allVillageRows;

    return allVillageRows.filter(
      (item) =>
        item.village.toLowerCase().includes(normalized) ||
        item.mandal.toLowerCase().includes(normalized)
    );
  }, [allVillageRows, villageQuery]);

  return (
    <main>
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <img
          alt="Regional highway corridor near developing real estate locations"
          className="absolute inset-0 h-full w-full object-cover opacity-45"
          src="https://images.unsplash.com/photo-1485738422979-f5c462d49f74?auto=format&fit=crop&w=1600&q=85"
        />
        <div className="container-page relative grid min-h-[560px] items-center py-16">
          <div className="max-w-4xl">
            <p className="eyebrow text-brand-100">Hyderabad Regional Ring Road</p>
            <h1 className="mt-4 text-4xl font-black leading-tight md:text-6xl">
              RRR news, map plan, and Siddipet mandal-village guide.
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-100">
              Track the northern corridor around Gajwel, Pragnapur, Jagdevpur, Markook, Rayapol, and Wargal with buyer-friendly notes, village lists, and verification checks.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="btn-primary" to="/properties?mandal=Gajwel">
                Search Gajwel listings
              </Link>
              <a className="btn-secondary border-white/40 bg-white/10 text-white hover:border-white hover:text-white" href={sources.hmda} rel="noreferrer" target="_blank">
                Open HMDA alignment
              </a>
              <a className="btn-secondary border-white/40 bg-white/10 text-white hover:border-white hover:text-white" href={sources.mapLayer} rel="noreferrer" target="_blank">
                View map layer
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page -mt-10 relative z-10">
        <div className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-soft md:grid-cols-4">
          {[
            ["RRR-N", "Northern corridor"],
            ["161.5 km", "Reported northern stretch"],
            ["2029", "Reported completion target"],
            ["5 mandals", "Siddipet focus list"],
          ].map(([value, label]) => (
            <div className="rounded-md bg-slate-50 p-4" key={label}>
              <p className="text-2xl font-black text-slate-950">{value}</p>
              <p className="mt-1 text-xs font-black uppercase text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page py-12">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">Latest news</p>
            <h2 className="section-title mt-2">RRR project updates</h2>
          </div>
          <p className="text-sm font-bold text-slate-500">Last checked: May 9, 2026</p>
        </div>
        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {newsUpdates.map((item) => (
            <a className="card p-5 transition hover:border-brand-600" href={item.source} key={item.title} rel="noreferrer" target="_blank">
              <p className="text-xs font-black uppercase text-brand-700">{item.tag}</p>
              <h3 className="mt-3 text-lg font-black text-slate-950">{item.title}</h3>
              <p className="mt-2 text-xs font-bold text-slate-500">{item.date}</p>
              <p className="mt-3 text-sm leading-6 text-slate-600">{item.detail}</p>
              <span className="mt-4 inline-flex text-sm font-black text-brand-700">Read source</span>
            </a>
          ))}
        </div>
      </section>

      <section className="container-page py-8">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div>
            <p className="eyebrow">Map plan</p>
            <h2 className="section-title mt-2">Northern RRR corridor schematic</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
              This is a planning guide for website users, not a survey map. Select a Siddipet node to see related mandals and villages, then use HMDA documents for exact alignment and survey-number verification.
            </p>

            <div className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="relative">
                <div className="absolute left-6 right-6 top-11 hidden h-1 rounded bg-slate-200 md:block" />
                <div className="grid gap-3 md:grid-cols-4 xl:grid-cols-8">
                  {routeSteps.map((step, index) => {
                    const isSiddipet = step.district === "Siddipet";
                    const isActive = step.mandal && currentMandal.officialName === step.mandal;

                    return (
                      <button
                        className={`relative min-h-28 rounded-lg border p-4 text-left transition ${
                          isActive
                            ? "border-brand-700 bg-brand-700 text-white"
                            : isSiddipet
                              ? "border-brand-600 bg-brand-50 text-brand-900 hover:bg-brand-100"
                              : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300"
                        }`}
                        key={`${step.label}-${index}`}
                        onClick={() => step.mandal && setSelectedMandal(step.mandal)}
                        type="button"
                      >
                        <span className={`grid h-8 w-8 place-items-center rounded-full text-xs font-black ${isActive ? "bg-white text-brand-700" : "bg-white text-slate-700"}`}>
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="mt-3 block text-base font-black">{step.label}</span>
                        <span className={`mt-1 block text-xs font-bold ${isActive ? "text-brand-50" : "text-slate-500"}`}>
                          {step.district}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-5 grid gap-3 text-sm text-slate-600 md:grid-cols-3">
                <div className="rounded-md bg-slate-50 p-3">
                  <span className="font-black text-slate-950">Package 1:</span> Girmapur to Pragnapur
                </div>
                <div className="rounded-md bg-slate-50 p-3">
                  <span className="font-black text-slate-950">Package 2:</span> Pragnapur to Tangedpalli
                </div>
                <div className="rounded-md bg-slate-50 p-3">
                  <span className="font-black text-slate-950">Buyer note:</span> distance must be checked by survey number
                </div>
              </div>
            </div>
          </div>

          <aside className="rounded-lg bg-brand-900 p-6 text-white">
            <p className="eyebrow text-brand-100">Interactive guide</p>
            <h2 className="mt-3 text-2xl font-black">Choose a Siddipet mandal</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {siddipetMandals.map((mandal) => (
                <button
                  className={`rounded-md px-3 py-2 text-xs font-black transition ${
                    mandal.name === selectedMandal
                      ? "bg-white text-brand-900"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                  key={mandal.name}
                  onClick={() => setSelectedMandal(mandal.name)}
                  type="button"
                >
                  {mandal.name}
                </button>
              ))}
            </div>

            <div className="mt-6 rounded-lg bg-white p-5 text-slate-900">
              <p className="text-xs font-black uppercase text-brand-700">{currentMandal.status}</p>
              <h3 className="mt-2 text-2xl font-black">{currentMandal.name}</h3>
              <p className="mt-2 text-sm font-black text-slate-700">{currentMandal.role}</p>
              <p className="mt-3 text-sm leading-6 text-slate-600">{currentMandal.note}</p>
              <p className="mt-3 text-sm leading-6 text-slate-600">{currentMandal.buyerUse}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {currentMandal.villages.map((village) => (
                  <span className="rounded-md bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700" key={village}>
                    {village}
                  </span>
                ))}
              </div>
              <Link className="btn-primary mt-5 w-full" to={currentMandal.listingTo}>
                Search this area
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <section className="container-page py-10">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="eyebrow">Siddipet mandals and villages</p>
            <h2 className="section-title mt-2">Villages reported along the RRR alignment</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Public reports based on HMDA material mention Gajwel, Jagdevpur, Markook, Rayapol, and Vargal in Siddipet district. Village spellings vary across sources, so use this as a buyer guide and verify the official survey number before making any decision.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <input
                className="field max-w-md"
                onChange={(event) => setVillageQuery(event.target.value)}
                placeholder="Search mandal or village..."
                value={villageQuery}
              />
            </div>
            <label className="mt-4 flex items-center gap-3 text-sm font-bold text-slate-700">
              <input
                checked={showExtraVillages}
                onChange={(event) => setShowExtraVillages(event.target.checked)}
                type="checkbox"
              />
              Include older/alternate village mentions from public summaries
            </label>
          </div>

          <div className="card overflow-hidden">
            <div className="grid grid-cols-[1fr_1fr_120px] gap-3 border-b border-slate-100 bg-slate-50 p-4 text-xs font-black uppercase text-slate-500">
              <span>Mandal</span>
              <span>Village</span>
              <span>Listings</span>
            </div>
            <div className="max-h-[520px] divide-y divide-slate-100 overflow-y-auto">
              {filteredVillageRows.map((item) => (
                <div className="grid grid-cols-[1fr_1fr_120px] gap-3 p-4 text-sm" key={`${item.mandal}-${item.village}`}>
                  <span className="font-black text-slate-900">{item.mandal}</span>
                  <span className="font-semibold text-slate-600">{item.village}</span>
                  <Link className="font-black text-brand-700 hover:text-brand-900" to={item.listingTo}>
                    Search
                  </Link>
                </div>
              ))}
              {!filteredVillageRows.length ? (
                <div className="p-5 text-sm font-bold text-slate-500">No matching village found.</div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-10">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {impactItems.map(([title, description]) => (
            <div className="card p-6" key={title}>
              <h2 className="text-lg font-black text-slate-950">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page py-10">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200 lg:p-8">
            <p className="eyebrow">Before buying</p>
            <h2 className="section-title mt-2">RRR property verification checklist</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              RRR can improve interest in nearby locations, but it also creates rumor-driven pricing. Treat every plot or land parcel as a document-first decision.
            </p>
            <div className="mt-6 grid gap-3">
              {checks.map((check, index) => (
                <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold leading-6 text-slate-700" key={check}>
                  {index + 1}. {check}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg bg-slate-950 p-6 text-white lg:p-8">
            <p className="eyebrow text-brand-100">Reference links</p>
            <h2 className="mt-2 text-2xl font-black">Use sources before site visits</h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              These links help buyers and office agents cross-check news, official alignment material, and map references. The final call should always be based on official records and site verification.
            </p>
            <div className="mt-6 grid gap-3">
              {sourceLinks.map(([label, href]) => (
                <a className="rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm font-black text-white transition hover:border-brand-100 hover:bg-white/10" href={href} key={label} rel="noreferrer" target="_blank">
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
