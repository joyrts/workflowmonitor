import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { useAppStore } from "../store/useAppStore";

let apiInstance: AxiosInstance | null = null;

export const createApiInstance = (baseURL: string, apiKey: string): AxiosInstance => {
  apiInstance = axios.create({
    baseURL,
    timeout: 15000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Auth interceptor — attaches API key to every request
  apiInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    if (apiKey) {
      config.headers["Authorization"] = `Bearer ${apiKey}`;
    }
    return config;
  });

  // Response error interceptor
  apiInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        useAppStore.getState().setConnection({ status: "error" });
      }
      return Promise.reject(error);
    }
  );

  return apiInstance;
};

export const getApiInstance = (): AxiosInstance => {
  if (!apiInstance) {
    const { connection } = useAppStore.getState();
    if (connection.serverUrl && connection.apiKey) {
      return createApiInstance(connection.serverUrl, connection.apiKey);
    }
    // Return a placeholder instance — requests will fail gracefully
    return axios.create({ baseURL: "http://localhost" });
  }
  return apiInstance;
};
