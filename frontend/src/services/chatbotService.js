import { apiClient } from "./apiClient";

export const chatbotService = {
  async reply(payload) {
    const { data } = await apiClient.post("/chatbot", payload);
    return data;
  },
};
