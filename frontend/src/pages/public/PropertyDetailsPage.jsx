import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ErrorMessage from "../../components/common/ErrorMessage";
import WhatsAppIcon from "../../components/common/WhatsAppIcon";
import InquiryForm from "../../components/forms/InquiryForm";
import { useDocumentMeta } from "../../hooks/useDocumentMeta";
import { propertyService } from "../../services/propertyService";
import { formatPrice } from "../../utils/formatters";
import { FALLBACK_PROPERTY_IMAGE, resolveImage, resolveMediaUrl } from "../../utils/images";
import { createWhatsAppUrl } from "../../utils/whatsapp";

export default function PropertyDetailsPage() {
  const { idOrSlug } = useParams();
  const [property, setProperty] = useState(null);
  const [activeMedia, setActiveMedia] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    propertyService
      .get(idOrSlug)
      .then((data) => {
        if (active) setProperty(data);
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
  }, [idOrSlug]);

  const images = useMemo(() => {
    if (!property?.images?.length) return [FALLBACK_PROPERTY_IMAGE];
    return property.images.map(resolveImage);
  }, [property]);
  const mediaItems = useMemo(() => {
    const imageItems = images.map((image, index) => ({
      type: "image",
      src: image,
      label: `Property photo ${index + 1}`,
    }));

    if (!property?.video_url) return imageItems;

    return [
      ...imageItems,
      {
        type: "video",
        src: resolveMediaUrl(property.video_url),
        label: "Property video",
      },
    ];
  }, [images, property]);

  useDocumentMeta({
    title: property ? `${property.title} | Siddipet Real Estate` : "Property Details | Siddipet Real Estate",
    description: property
      ? `${property.property_type} in ${property.village}, ${property.mandal}. Contact Siddipet Real Estate for site visit and offline property support.`
      : "View Siddipet property details, images, location, price, and contact options.",
    canonicalPath: property ? `/properties/${property.slug || property.id}` : `/properties/${idOrSlug}`,
  });

  if (loading) {
    return <main className="container-page py-10"><div className="h-96 animate-pulse rounded-lg bg-slate-200" /></main>;
  }

  if (error || !property) {
    return <main className="container-page py-10"><ErrorMessage message={error || "Property not found."} /></main>;
  }

  const mapQuery = encodeURIComponent(`${property.village}, ${property.mandal}, Siddipet, Telangana`);
  const whatsappMessage = `Hi, I am interested in ${property.title} at ${property.village}, ${property.mandal}. Please share more details.`;
  const propertyJsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: property.description,
    image: images,
    url: `${window.location.origin}/properties/${property.slug || property.id}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: property.village,
      addressRegion: "Telangana",
      addressCountry: "IN",
    },
    offers: {
      "@type": "Offer",
      price: Number(property.price || 0),
      priceCurrency: "INR",
      availability: property.status === "sold" ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
    },
  };
  const facts = [
    ["Mandal", property.mandal],
    ["Village", property.village],
    ["Land area", property.land_area || "On request"],
    ["Status", property.status],
  ];
  const selectedMedia = mediaItems[activeMedia] || mediaItems[0];
  const badges = [
    property.property_type,
    property.is_verified ? "Verified" : null,
    property.video_url ? "Video available" : null,
  ].filter(Boolean);

  return (
    <main className="bg-slate-50/70 py-8">
      <script type="application/ld+json">{JSON.stringify(propertyJsonLd)}</script>
      <div className="container-page">
        <Link className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-black text-brand-700 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:text-brand-600" to="/properties">
          Back to listings
        </Link>

        <section className="mt-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-7">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
            <div>
              <p className="eyebrow">{property.village}, {property.mandal}</p>
              <h1 className="mt-2 max-w-4xl text-3xl font-black leading-tight text-slate-950 md:text-5xl">
                {property.title}
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {badges.map((badge) => (
                  <span
                    className="rounded-md bg-slate-50 px-3 py-1.5 text-xs font-black uppercase text-slate-700 ring-1 ring-slate-200"
                    key={badge}
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-lg bg-brand-50 p-4 ring-1 ring-brand-100">
              <p className="text-xs font-black uppercase text-brand-700">Listed price</p>
              <p className="mt-1 text-3xl font-black text-brand-800">{formatPrice(property.price)}</p>
              <p className="mt-2 text-sm font-semibold leading-5 text-brand-900/75">Final discussion and documentation happen offline with the office team.</p>
            </div>
          </div>
        </section>

        <section className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_390px]">
          <div>
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft">
              <div className="relative">
                {selectedMedia.type === "video" ? (
                  <>
                    <video
                      className="h-[340px] w-full bg-slate-950 object-contain md:h-[560px]"
                      controls
                      preload="metadata"
                      src={selectedMedia.src}
                    />
                  </>
                ) : (
                  <img alt={property.title} className="h-[340px] w-full object-cover md:h-[560px]" src={selectedMedia.src} />
                )}
              </div>
            </div>
            {mediaItems.length > 1 ? (
              <div className="mt-3 grid grid-cols-4 gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm md:grid-cols-6">
                {mediaItems.map((item, index) => (
                  <button
                    aria-label={`View ${item.label}`}
                    className={`relative overflow-hidden rounded-md border bg-white transition ${activeMedia === index ? "border-brand-700 ring-2 ring-brand-100" : "border-slate-200 hover:border-brand-600"}`}
                    key={`${item.type}-${item.src}`}
                    onClick={() => setActiveMedia(index)}
                    type="button"
                  >
                    {item.type === "video" ? (
                      <span className="grid h-20 w-full place-items-center bg-slate-950 text-xs font-black uppercase text-white md:h-24">
                        Play video
                      </span>
                    ) : (
                      <img alt="" className="h-20 w-full object-cover md:h-24" src={item.src} />
                    )}
                    {item.type === "video" ? (
                      <span className="absolute inset-0 grid place-items-center bg-slate-950/25 text-2xl text-white">▶</span>
                    ) : null}
                  </button>
                ))}
              </div>
            ) : null}

            <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="eyebrow">Property overview</p>
                  <h2 className="mt-2 text-2xl font-black text-slate-950">Details and location context</h2>
                </div>
                <span className="rounded-md bg-slate-50 px-3 py-2 text-sm font-black text-slate-700">
                  {images.length} photo{images.length === 1 ? "" : "s"}
                </span>
              </div>
              <p className="mt-6 whitespace-pre-line rounded-lg bg-slate-50 p-5 leading-8 text-slate-700">{property.description}</p>
            </div>

            <div className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 p-4">
                <p className="eyebrow">Map</p>
                <h2 className="mt-1 text-xl font-black text-slate-950">Location preview</h2>
              </div>
              <iframe
                className="h-80 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                title="Property location map"
              />
            </div>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
              <p className="eyebrow">Quick facts</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {facts.map(([label, value]) => (
                  <div className="rounded-md bg-slate-50 p-3" key={label}>
                    <p className="text-xs font-black uppercase text-slate-500">{label}</p>
                    <p className="mt-1 font-bold capitalize text-slate-900">{value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 border-t border-slate-100 pt-5">
                <h2 className="text-xl font-black text-slate-950">Contact office</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Call or message for site visits, owner details, and next steps.
                </p>
              </div>
              <div className="mt-4 grid gap-3">
                <a className="btn-primary gap-2 bg-[#25D366] hover:bg-[#1ebe5d]" href={createWhatsAppUrl(whatsappMessage)} rel="noreferrer" target="_blank">
                  <WhatsAppIcon />
                  WhatsApp
                </a>
                <a className="btn-secondary" href={`tel:${property.phone}`}>Call {property.phone}</a>
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-xl font-black">Send inquiry</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Share your details and the office team will coordinate site visits and next steps offline.
              </p>
              <div className="mt-4">
                <InquiryForm propertyId={property.id} />
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
