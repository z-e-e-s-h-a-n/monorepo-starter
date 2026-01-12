import apiClient, { executeApi } from "../lib/api-client";

export const welcome = () => executeApi(() => apiClient.get("/"));

export const healthCheck = () =>
  executeApi<HealthCheckResponse>(() => apiClient.get("/health"));
