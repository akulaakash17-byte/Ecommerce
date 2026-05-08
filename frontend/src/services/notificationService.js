import { apiClient } from "./apiClient";

export const notificationService = {
  async list(params = {}) {
    const { data } = await apiClient.get("/notifications", { params });
    return data;
  },
};
