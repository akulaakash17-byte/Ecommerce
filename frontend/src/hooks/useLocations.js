import { useEffect, useState } from "react";
import { locationService } from "../services/locationService";

export function useLocations(selectedMandal = "") {
  const [mandals, setMandals] = useState([]);
  const [villages, setVillages] = useState([]);
  const [loading, setLoading] = useState({ mandals: true, villages: false });
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading((current) => ({ ...current, mandals: true }));

    locationService
      .getMandals()
      .then((items) => {
        if (active) setMandals(items);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      })
      .finally(() => {
        if (active) setLoading((current) => ({ ...current, mandals: false }));
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    setVillages([]);

    if (!selectedMandal) {
      setLoading((current) => ({ ...current, villages: false }));
      return () => {
        active = false;
      };
    }

    setLoading((current) => ({ ...current, villages: true }));
    locationService
      .getVillages(selectedMandal)
      .then((items) => {
        if (active) setVillages(items);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      })
      .finally(() => {
        if (active) setLoading((current) => ({ ...current, villages: false }));
      });

    return () => {
      active = false;
    };
  }, [selectedMandal]);

  return { mandals, villages, loading, error };
}
