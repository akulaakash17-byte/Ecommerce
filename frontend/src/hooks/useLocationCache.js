import { useCallback, useEffect, useState } from "react";
import { getDistricts, getMandals, getVillages } from "../api/locationApi";

const toOptions = (items) => items.map((item) => ({ label: item, value: item }));

export function useLocationCache() {
  const [districtOptions, setDistrictOptions] = useState([]);
  const [mandalOptions, setMandalOptions] = useState([]);
  const [villageOptions, setVillageOptions] = useState([]);
  const [loading, setLoading] = useState({
    districts: false,
    mandals: false,
    villages: false,
  });
  const [error, setError] = useState("");

  const loadDistricts = useCallback(async () => {
    setLoading((current) => ({ ...current, districts: true }));
    setError("");

    try {
      const { data } = await getDistricts();
      setDistrictOptions(toOptions(data));
    } catch {
      setError("Could not load districts. Check that the API is running.");
    } finally {
      setLoading((current) => ({ ...current, districts: false }));
    }
  }, []);

  const loadMandals = useCallback(async (district) => {
    setMandalOptions([]);
    setVillageOptions([]);

    if (!district) {
      return;
    }

    setLoading((current) => ({ ...current, mandals: true }));
    setError("");

    try {
      const { data } = await getMandals(district);
      setMandalOptions(toOptions(data));
    } catch {
      setError("Could not load mandals for the selected district.");
    } finally {
      setLoading((current) => ({ ...current, mandals: false }));
    }
  }, []);

  const loadVillages = useCallback(async (district, mandal) => {
    setVillageOptions([]);

    if (!district || !mandal) {
      return;
    }

    setLoading((current) => ({ ...current, villages: true }));
    setError("");

    try {
      const { data } = await getVillages(district, mandal);
      setVillageOptions(toOptions(data));
    } catch {
      setError("Could not load villages for the selected mandal.");
    } finally {
      setLoading((current) => ({ ...current, villages: false }));
    }
  }, []);

  useEffect(() => {
    let active = true;

    getDistricts()
      .then(({ data }) => {
        if (active) {
          setDistrictOptions(toOptions(data));
        }
      })
      .catch(() => {
        if (active) {
          setError("Could not load districts. Check that the API is running.");
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return {
    districtOptions,
    mandalOptions,
    villageOptions,
    loading,
    error,
    loadMandals,
    loadVillages,
    retryDistricts: loadDistricts,
  };
}
