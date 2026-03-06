import apiClient, { executeApi } from "../lib/api-client";

export const getCurrentUser = () =>
  executeApi<UserResponse>(() => apiClient.get("/user"));

export const updateProfile = (data: UserProfileType) =>
  executeApi<null>(() => apiClient.post("/user", data));
