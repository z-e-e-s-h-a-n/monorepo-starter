import axios from "axios";
import type { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import type { ApiError, ApiResponse } from "./types";

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 30_000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<any>>) => {
    const payload = response.data;
    if (!payload.success) return Promise.reject(payload);
    return { ...response, data: payload };
  },
  (error: AxiosError<ApiError>) => {
    const res = error.response?.data;
    if (!res) return Promise.reject({ status: 0, message: "Network error" });
    return Promise.reject({ ...res, success: false, data: null });
  }
);

export const setClientUrl = (url: string) => {
  apiClient.defaults.headers["x-client-url"] = url;
};

export const executeApi = async <T = null>(
  fn: () => Promise<AxiosResponse<ApiResponse<T>>>
): Promise<ApiResponse<T>> => {
  try {
    const response = await fn();
    const payload = response.data;
    if (!payload.success) throw payload;
    return payload;
  } catch (err: any) {
    const res = err.response?.data ?? err;
    throw {
      status: res?.status ?? 0,
      message: res?.message ?? "Network error",
      data: res?.data ?? null,
      success: false,
      action: res?.action ?? undefined,
    } as ApiError;
  }
};

export default apiClient;
