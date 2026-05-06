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
};
