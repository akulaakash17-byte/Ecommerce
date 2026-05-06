import { apiClient } from "./apiClient";

export const dashboardService = {
  async overview() {
    const { data } = await apiClient.get("/dashboard/overview");
    return data;
  },
};
