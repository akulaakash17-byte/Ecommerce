import { apiClient } from "./apiClient";

export const followUpService = {
  async list(params = {}) {
    const { data } = await apiClient.get("/follow-ups", { params });
    return data;
  },

  async create(payload) {
    const { data } = await apiClient.post("/follow-ups", payload);
    return data;
  },

  async updateStatus(id, payload) {
    const { data } = await apiClient.patch(`/follow-ups/${id}/status`, payload);
    return data;
  },
};
