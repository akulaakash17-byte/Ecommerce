import { apiClient } from "./apiClient";

export const propertyService = {
  async list(params = {}) {
    const { data } = await apiClient.get("/properties", { params });
    return data;
  },

  async get(idOrSlug) {
    const { data } = await apiClient.get(`/properties/${idOrSlug}`);
    return data;
  },

  async create(formData) {
    const { data } = await apiClient.post("/properties", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  async update(id, formData) {
    const { data } = await apiClient.put(`/properties/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  async remove(id) {
    const { data } = await apiClient.delete(`/properties/${id}`);
    return data;
  },
};
