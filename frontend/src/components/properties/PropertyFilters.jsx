import { useTranslation } from "react-i18next";
import { PROPERTY_TYPES } from "../../data/propertyTypes";
import { useLocations } from "../../hooks/useLocations";
import SearchSelect from "../forms/SearchSelect";

export default function PropertyFilters({ filters, isMandalLocked = false, onChange, onSubmit, onReset }) {
  const { t } = useTranslation();
  const { mandals, villages, loading } = useLocations(filters.mandal);

  const update = (key, value) => {
    onChange({
      ...filters,
      [key]: value,
      ...(key === "mandal" ? { village: "" } : {}),
    });
  };

  return (
    <form className="card grid gap-4 p-5 md:grid-cols-2 lg:grid-cols-6" onSubmit={onSubmit}>
      <div className="lg:col-span-2">
        <label className="label" htmlFor="q">{t("filters.search")}</label>
        <input
          className="field py-3"
          id="q"
          onChange={(event) => update("q", event.target.value)}
          placeholder={t("filters.searchPlaceholder")}
          value={filters.q}
        />
      </div>
      <div>
        <label className="label" htmlFor="mandal">{t("filters.mandal")}</label>
        <SearchSelect
          id="mandal"
          isDisabled={isMandalLocked}
          isClearable
          onChange={(value) => update("mandal", value)}
          options={mandals}
          placeholder={t("filters.allMandals")}
          value={filters.mandal}
        />
      </div>
      <div>
        <label className="label" htmlFor="village">{t("filters.village")}</label>
        <select
          className="field py-3"
          disabled={!filters.mandal || loading.villages}
          id="village"
          onChange={(event) => update("village", event.target.value)}
          value={filters.village}
        >
          <option value="">{t("filters.allVillages")}</option>
          {villages.map((village) => (
            <option key={village} value={village}>{village}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="label" htmlFor="property_type">{t("filters.type")}</label>
        <SearchSelect
          id="property_type"
          isClearable
          onChange={(value) => update("property_type", value)}
          options={PROPERTY_TYPES}
          placeholder={t("filters.allTypes")}
          value={filters.property_type}
        />
      </div>
      <div className="grid grid-cols-2 gap-2 lg:col-span-1">
        <div>
          <label className="label" htmlFor="minPrice">{t("filters.min")}</label>
          <input className="field py-3" id="minPrice" min="0" onChange={(event) => update("minPrice", event.target.value)} placeholder="₹" type="number" value={filters.minPrice} />
        </div>
        <div>
          <label className="label" htmlFor="maxPrice">{t("filters.max")}</label>
          <input className="field py-3" id="maxPrice" min="0" onChange={(event) => update("maxPrice", event.target.value)} placeholder="₹" type="number" value={filters.maxPrice} />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="status">Status</label>
        <select className="field py-3" id="status" onChange={(event) => update("status", event.target.value)} value={filters.status}>
          <option value="available">Available</option>
          <option value="sold">Sold</option>
          <option value="all">All statuses</option>
        </select>
      </div>
      <div>
        <label className="label" htmlFor="sort">Sort</label>
        <select className="field py-3" id="sort" onChange={(event) => update("sort", event.target.value)} value={filters.sort}>
          <option value="newest">Newest first</option>
          <option value="verified">Verified first</option>
          <option value="price-asc">Price low to high</option>
          <option value="price-desc">Price high to low</option>
        </select>
      </div>
      <div className="flex flex-wrap items-end gap-2 md:col-span-2 lg:col-span-6">
        <label className="inline-flex min-h-11 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-extrabold text-slate-700">
          <input
            checked={filters.verified === "true"}
            className="h-4 w-4 accent-brand-700"
            onChange={(event) => update("verified", event.target.checked ? "true" : "")}
            type="checkbox"
          />
          Verified only
        </label>
        <label className="inline-flex min-h-11 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-extrabold text-slate-700">
          <input
            checked={filters.near === "rrr"}
            className="h-4 w-4 accent-brand-700"
            onChange={(event) => update("near", event.target.checked ? "rrr" : "")}
            type="checkbox"
          />
          RRR Road focus
        </label>
        <button className="btn-primary px-5 py-3" type="submit">{t("filters.apply")}</button>
        <button className="btn-secondary px-5 py-3" onClick={onReset} type="button">{t("filters.reset")}</button>
      </div>
    </form>
  );
}
