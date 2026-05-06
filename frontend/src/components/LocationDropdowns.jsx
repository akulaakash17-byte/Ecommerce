import React, { useEffect, useState } from "react";
import Select from "react-select";
import {
  getDistricts,
  getMandals,
  getVillages,
} from "../api/locationApi";

const LocationDropdowns = () => {
  const [districts, setDistricts] = useState([]);
  const [mandals, setMandals] = useState([]);
  const [villages, setVillages] = useState([]);

  const [district, setDistrict] = useState(null);
  const [mandal, setMandal] = useState(null);
  const [village, setVillage] = useState(null);

  // Load districts
  useEffect(() => {
    getDistricts().then((res) => {
      setDistricts(res.data);
    });
  }, []);

  // Load mandals
  useEffect(() => {
    if (!district) return;

    getMandals(district.value).then((res) => {
      setMandals(res.data);
      setMandal(null);
      setVillage(null);
    });
  }, [district]);

  // Load villages
  useEffect(() => {
    if (!mandal) return;

    getVillages(mandal.value).then((res) => {
      setVillages(res.data);
      setVillage(null);
    });
  }, [mandal]);

  return (
    <div style={{ width: "300px" }}>
      <h2>Select Location</h2>

      <Select
        placeholder="District"
        options={districts.map(d => ({ label: d, value: d }))}
        value={district}
        onChange={setDistrict}
      />

      <br />

      <Select
        placeholder="Mandal"
        options={mandals.map(m => ({ label: m, value: m }))}
        value={mandal}
        onChange={setMandal}
        isDisabled={!district}
      />

      <br />

      <Select
        placeholder="Village"
        options={villages.map(v => ({ label: v, value: v }))}
        value={village}
        onChange={setVillage}
        isDisabled={!mandal}
      />
    </div>
  );
};

export default LocationDropdowns;