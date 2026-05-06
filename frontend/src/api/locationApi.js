import axios from "axios";

const API = "http://localhost:5000/api/location";

export const getDistricts = () => axios.get(`${API}/districts`);
export const getMandals = (district) =>
  axios.get(`${API}/mandals/${district}`);
export const getVillages = (mandal) =>
  axios.get(`${API}/villages/${mandal}`);