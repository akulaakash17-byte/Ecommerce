import { apiClient } from "./apiClient";

export const inquiryService = {
  async create(payload) {
    const { data } = await apiClient.post("/inquiries", payload);
    return data;
  },

  async list(params = {}) {
    const { data } = await apiClient.get("/inquiries", { params });
    return data;
  },

  async updateStatus(id, payload) {
    const { data } = await apiClient.patch(`/inquiries/${id}/status`, payload);
    return data;
  },

  async remove(id) {
    const { data } = await apiClient.delete(`/inquiries/${id}`);
    return data;
  },
};
