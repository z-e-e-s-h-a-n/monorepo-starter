import apiClient, { executeApi } from "../lib/api-client";

export const getAllNotification = () =>
  executeApi<NotificationResponse[]>(() => apiClient.get("/notifications"));

export const markAsRead = (id: string) =>
  executeApi(() => apiClient.put(`/notifications/${id}`));

export const registerPushToken = (data: RegisterPushTokenType) =>
  executeApi(() => apiClient.post("/notifications/push/register", data));
