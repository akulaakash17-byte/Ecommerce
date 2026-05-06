import axios from "axios";

const api = axios.create({
  baseURL: "/api/location",
});

export const getDistricts = () => api.get("/districts");
export const getMandals = (district) =>
  api.get(`/mandals/${encodeURIComponent(district)}`);
export const getVillages = (district, mandal) =>
  api.get("/villages", {
    params: { district, mandal },
  });
