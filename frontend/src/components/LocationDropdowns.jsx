import { useMemo, useState } from "react";
import Select from "react-select";
import { useLocationCache } from "../hooks/useLocationCache";

const LocationDropdowns = () => {
  const [district, setDistrict] = useState(null);
  const [mandal, setMandal] = useState(null);
  const [village, setVillage] = useState(null);
  const {
    districtOptions,
    mandalOptions,
    villageOptions,
    loading,
    error,
    loadMandals,
    loadVillages,
    retryDistricts,
  } = useLocationCache();

  const handleDistrictChange = (selectedDistrict) => {
    setDistrict(selectedDistrict);
    setMandal(null);
    setVillage(null);
    loadMandals(selectedDistrict?.value);
  };

  const handleMandalChange = (selectedMandal) => {
    setMandal(selectedMandal);
    setVillage(null);
    loadVillages(district?.value, selectedMandal?.value);
  };

  const selectedLocation = useMemo(() => {
    return [district?.label, mandal?.label, village?.label].filter(Boolean).join(", ");
  }, [district, mandal, village]);

  return (
    <section className="location-panel" aria-label="Location selector">
      <div className="location-panel__header">
        <div>
          <p className="eyebrow">Property Search</p>
          <h2>Select Location</h2>
        </div>
        {error ? (
          <button className="text-button" type="button" onClick={retryDistricts}>
            Retry
          </button>
        ) : null}
      </div>

      {error ? <p className="form-error">{error}</p> : null}

      <label>
        <span>District</span>
        <Select
          placeholder="Choose district"
          options={districtOptions}
          value={district}
          onChange={handleDistrictChange}
          isClearable
          isLoading={loading.districts}
          noOptionsMessage={() => "No districts found"}
        />
      </label>

      <label>
        <span>Mandal</span>
        <Select
          placeholder="Choose mandal"
          options={mandalOptions}
          value={mandal}
          onChange={handleMandalChange}
          isClearable
          isDisabled={!district}
          isLoading={loading.mandals}
          noOptionsMessage={() => "Select a district first"}
        />
      </label>

      <label>
        <span>Village</span>
        <Select
          placeholder="Choose village"
          options={villageOptions}
          value={village}
          onChange={setVillage}
          isClearable
          isDisabled={!mandal}
          isLoading={loading.villages}
          noOptionsMessage={() => "Select a mandal first"}
        />
      </label>

      {selectedLocation ? (
        <p className="selection-summary">Selected: {selectedLocation}</p>
      ) : null}
    </section>
  );
};

export default LocationDropdowns;
