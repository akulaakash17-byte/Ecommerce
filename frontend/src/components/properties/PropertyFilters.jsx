import { PROPERTY_TYPES } from "../../data/propertyTypes";
import { useLocations } from "../../hooks/useLocations";
import SearchSelect from "../forms/SearchSelect";

export default function PropertyFilters({ filters, onChange, onSubmit, onReset }) {
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
        <label className="label" htmlFor="q">Search</label>
        <input
          className="field py-3"
          id="q"
          onChange={(event) => update("q", event.target.value)}
          placeholder="Plot, house, village..."
          value={filters.q}
        />
      </div>
      <div>
        <label className="label" htmlFor="mandal">Mandal</label>
        <SearchSelect
          id="mandal"
          isClearable
          onChange={(value) => update("mandal", value)}
          options={mandals}
          placeholder="All mandals"
          value={filters.mandal}
        />
      </div>
      <div>
        <label className="label" htmlFor="village">Village</label>
        <select
          className="field py-3"
          disabled={!filters.mandal || loading.villages}
          id="village"
          onChange={(event) => update("village", event.target.value)}
          value={filters.village}
        >
          <option value="">All villages</option>
          {villages.map((village) => (
            <option key={village} value={village}>{village}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="label" htmlFor="property_type">Type</label>
        <SearchSelect
          id="property_type"
          isClearable
          onChange={(value) => update("property_type", value)}
          options={PROPERTY_TYPES}
          placeholder="All types"
          value={filters.property_type}
        />
      </div>
      <div className="grid grid-cols-2 gap-2 lg:col-span-1">
        <div>
          <label className="label" htmlFor="minPrice">Min</label>
          <input className="field py-3" id="minPrice" min="0" onChange={(event) => update("minPrice", event.target.value)} placeholder="₹" type="number" value={filters.minPrice} />
        </div>
        <div>
          <label className="label" htmlFor="maxPrice">Max</label>
          <input className="field py-3" id="maxPrice" min="0" onChange={(event) => update("maxPrice", event.target.value)} placeholder="₹" type="number" value={filters.maxPrice} />
        </div>
      </div>
      <div className="flex flex-wrap items-end gap-2 md:col-span-2 lg:col-span-6">
        <button className="btn-primary px-5 py-3" type="submit">Apply filters</button>
        <button className="btn-secondary px-5 py-3" onClick={onReset} type="button">Reset</button>
      </div>
    </form>
  );
}
