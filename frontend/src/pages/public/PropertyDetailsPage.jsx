import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import ErrorMessage from "../../components/common/ErrorMessage";
import WhatsAppIcon from "../../components/common/WhatsAppIcon";
import InquiryForm from "../../components/forms/InquiryForm";
import { useDocumentMeta } from "../../hooks/useDocumentMeta";
import { propertyService } from "../../services/propertyService";
import { formatPrice } from "../../utils/formatters";
import { FALLBACK_PROPERTY_IMAGE, resolveImage } from "../../utils/images";
import { createWhatsAppUrl } from "../../utils/whatsapp";

export default function PropertyDetailsPage() {
  const { idOrSlug } = useParams();
  const [property, setProperty] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
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

  useDocumentMeta({
    title: property ? `${property.title} | Siddipet Realty` : "Property Details | Siddipet Realty",
    description: property
      ? `${property.property_type} in ${property.village}, ${property.mandal}. Contact Siddipet Realty for site visit and offline property support.`
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

  return (
    <main className="container-page py-10">
      <script type="application/ld+json">{JSON.stringify(propertyJsonLd)}</script>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        <section>
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
            <img alt={property.title} className="h-[420px] w-full object-cover" src={images[activeImage]} />
          </div>
          {images.length > 1 ? (
            <div className="mt-3 grid grid-cols-4 gap-3 md:grid-cols-6">
              {images.map((image, index) => (
                <button
                  className={`overflow-hidden rounded-md border ${activeImage === index ? "border-brand-700" : "border-slate-200"}`}
                  key={image}
                  onClick={() => setActiveImage(index)}
                  type="button"
                >
                  <img alt="" className="h-20 w-full object-cover" src={image} />
                </button>
              ))}
            </div>
          ) : null}

          <div className="mt-8">
            <p className="eyebrow">{property.property_type}</p>
            <h1 className="mt-2 text-3xl font-black leading-tight text-slate-950 md:text-4xl">{property.title}</h1>
            <p className="mt-3 text-lg font-black text-brand-700">{formatPrice(property.price)}</p>
            <div className="mt-5 grid gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:grid-cols-3">
              <div><p className="text-xs font-black uppercase text-slate-500">Mandal</p><p className="mt-1 font-bold">{property.mandal}</p></div>
              <div><p className="text-xs font-black uppercase text-slate-500">Village</p><p className="mt-1 font-bold">{property.village}</p></div>
              <div><p className="text-xs font-black uppercase text-slate-500">Land area</p><p className="mt-1 font-bold">{property.land_area || "On request"}</p></div>
            </div>
            <p className="mt-6 whitespace-pre-line leading-8 text-slate-700">{property.description}</p>
          </div>

          <div className="mt-8 overflow-hidden rounded-lg border border-slate-200 bg-white">
            <iframe
              className="h-80 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
              title="Property location map"
            />
          </div>
        </section>

        <aside className="space-y-5">
          <div className="card p-5">
            <h2 className="text-xl font-black">Contact agent</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Speak with the office team for site visits, owner details, and offline deal discussion.
            </p>
            <div className="mt-5 grid gap-3">
              <a className="btn-primary gap-2 bg-[#25D366] hover:bg-[#1ebe5d]" href={createWhatsAppUrl(whatsappMessage)} rel="noreferrer" target="_blank">
                <WhatsAppIcon />
                WhatsApp
              </a>
              <a className="btn-secondary" href={`tel:${property.phone}`}>Call {property.phone}</a>
            </div>
          </div>
          <div className="card p-5">
            <h2 className="text-xl font-black">Send inquiry</h2>
            <div className="mt-4">
              <InquiryForm propertyId={property.id} />
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
