import { apiClient } from "./apiClient";

export const auditLogService = {
  async list(params = {}) {
    const { data } = await apiClient.get("/audit-logs", { params });
    return data;
  },
};
