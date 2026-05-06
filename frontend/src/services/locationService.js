import { apiClient } from "./apiClient";

export const locationService = {
  async getMandals() {
    const { data } = await apiClient.get("/locations/mandals");
    return data;
  },

  async getVillages(mandal) {
    if (!mandal) return [];
    const { data } = await apiClient.get(`/locations/villages/${encodeURIComponent(mandal)}`);
    return data;
  },
};
