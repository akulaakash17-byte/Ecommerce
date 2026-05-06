import { PROPERTY_TYPES } from "../../data/propertyTypes";
import { useLocations } from "../../hooks/useLocations";

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
    <form className="card grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-6" onSubmit={onSubmit}>
      <div className="lg:col-span-2">
        <label className="label" htmlFor="q">Search</label>
        <input
          className="field"
          id="q"
          onChange={(event) => update("q", event.target.value)}
          placeholder="Plot, house, village..."
          value={filters.q}
        />
      </div>
      <div>
        <label className="label" htmlFor="mandal">Mandal</label>
        <select className="field" id="mandal" onChange={(event) => update("mandal", event.target.value)} value={filters.mandal}>
          <option value="">All mandals</option>
          {mandals.map((mandal) => (
            <option key={mandal} value={mandal}>{mandal}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="label" htmlFor="village">Village</label>
        <select
          className="field"
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
        <select
          className="field"
          id="property_type"
          onChange={(event) => update("property_type", event.target.value)}
          value={filters.property_type}
        >
          <option value="">All types</option>
          {PROPERTY_TYPES.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-2 lg:col-span-1">
        <div>
          <label className="label" htmlFor="minPrice">Min</label>
          <input className="field" id="minPrice" min="0" onChange={(event) => update("minPrice", event.target.value)} placeholder="₹" type="number" value={filters.minPrice} />
        </div>
        <div>
          <label className="label" htmlFor="maxPrice">Max</label>
          <input className="field" id="maxPrice" min="0" onChange={(event) => update("maxPrice", event.target.value)} placeholder="₹" type="number" value={filters.maxPrice} />
        </div>
      </div>
      <div className="flex items-end gap-2 md:col-span-2 lg:col-span-6">
        <button className="btn-primary" type="submit">Apply filters</button>
        <button className="btn-secondary" onClick={onReset} type="button">Reset</button>
      </div>
    </form>
  );
}
