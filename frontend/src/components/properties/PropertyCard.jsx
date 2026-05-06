import { Link } from "react-router-dom";
import { formatPrice } from "../../utils/formatters";
import { resolveImage } from "../../utils/images";

export default function PropertyCard({ property }) {
  const image = resolveImage(property.images?.[0]);

  return (
    <article className="card group overflow-hidden transition hover:-translate-y-1 hover:shadow-soft">
      <Link to={`/properties/${property.slug || property.id}`} className="block">
        <div className="relative h-52 overflow-hidden bg-slate-100">
          <img
            alt={property.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
            src={image}
          />
          <div className="absolute left-3 top-3 flex gap-2">
            {property.is_verified ? (
              <span className="rounded bg-white px-2.5 py-1 text-xs font-black text-brand-700 shadow-sm">
                Verified
              </span>
            ) : null}
            {property.status === "sold" ? (
              <span className="rounded bg-slate-950 px-2.5 py-1 text-xs font-black text-white">Sold</span>
            ) : null}
          </div>
        </div>
      </Link>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase text-brand-700">{property.property_type}</p>
            <Link to={`/properties/${property.slug || property.id}`}>
              <h3 className="mt-1 line-clamp-2 text-lg font-black leading-snug text-slate-950">
                {property.title}
              </h3>
            </Link>
          </div>
          <p className="shrink-0 text-base font-black text-slate-950">{formatPrice(property.price)}</p>
        </div>
        <p className="mt-3 text-sm font-semibold text-slate-600">
          {property.village}, {property.mandal}
        </p>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{property.description}</p>
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-sm">
          <span className="font-bold text-slate-700">{property.land_area || "Area on request"}</span>
          <Link className="font-black text-brand-700 hover:text-brand-600" to={`/properties/${property.slug || property.id}`}>
            View details
          </Link>
        </div>
      </div>
    </article>
  );
}
