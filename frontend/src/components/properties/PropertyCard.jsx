import { Link } from "react-router-dom";
import { formatPrice } from "../../utils/formatters";
import { resolveImage } from "../../utils/images";

export default function PropertyCard({ property }) {
  const image = resolveImage(property.images?.[0]);

  return (
    <article className="card group overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-soft">
      <Link to={`/properties/${property.slug || property.id}`} className="block">
        <div className="relative h-56 overflow-hidden bg-slate-100">
          <img
            alt={property.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
            src={image}
          />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/70 to-transparent" />
          <div className="absolute left-3 top-3 flex gap-2">
            {property.is_verified ? (
              <span className="rounded bg-white/95 px-2.5 py-1 text-xs font-black text-brand-700 shadow-sm">
                Verified
              </span>
            ) : null}
            {property.status === "sold" ? (
              <span className="rounded bg-slate-950 px-2.5 py-1 text-xs font-black text-white">Sold</span>
            ) : null}
          </div>
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3 text-white">
            <span className="rounded bg-slate-950/75 px-2.5 py-1 text-xs font-black backdrop-blur">{property.property_type}</span>
            <span className="rounded bg-white px-3 py-1.5 text-sm font-black text-slate-950 shadow-sm">{formatPrice(property.price)}</span>
          </div>
        </div>
      </Link>

      <div className="p-5">
        <div>
          <Link to={`/properties/${property.slug || property.id}`}>
            <h3 className="line-clamp-2 text-xl font-black leading-snug text-slate-950 transition group-hover:text-brand-700">
              {property.title}
            </h3>
          </Link>
        </div>
        <p className="mt-3 text-sm font-bold text-slate-700">
          {property.village}, {property.mandal}
        </p>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{property.description}</p>
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-sm">
          <span className="rounded-md bg-slate-50 px-2.5 py-1 font-bold text-slate-700">{property.land_area || "Area on request"}</span>
          <Link className="font-black text-brand-700 hover:text-brand-600" to={`/properties/${property.slug || property.id}`}>
            View details
          </Link>
        </div>
      </div>
    </article>
  );
}
