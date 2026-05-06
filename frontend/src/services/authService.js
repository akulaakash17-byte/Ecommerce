import { apiClient } from "./apiClient";

export const authService = {
  async login(credentials) {
    const { data } = await apiClient.post("/auth/login", credentials);
    return data;
  },

  async me() {
    const { data } = await apiClient.get("/auth/me");
    return data;
  },
};
