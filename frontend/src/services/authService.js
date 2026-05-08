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

  async logout() {
    const { data } = await apiClient.post("/auth/logout");
    return data;
  },

  async listUsers() {
    const { data } = await apiClient.get("/auth/users");
    return data;
  },

  async createUser(payload) {
    const { data } = await apiClient.post("/auth/users", payload);
    return data;
  },
};
