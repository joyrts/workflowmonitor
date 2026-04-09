import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { Platform } from "react-native";
import { useAppStore } from "../store/useAppStore";

let apiInstance: AxiosInstance | null = null;

export const getDefaultApiKey = (): string => {
  const key =
    (process.env.EXPO_PUBLIC_N8N_API_KEY as string | undefined) ??
    (process.env.N8N_API_KEY as string | undefined) ??
    "";
  return key.trim();
};

export const normalizeBaseUrl = (baseURL: string): string => {
  if (Platform.OS !== "android") return baseURL;
  try {
    const url = new URL(baseURL);
    if (url.hostname === "localhost" || url.hostname === "127.0.0.1") {
      url.hostname = "10.0.2.2";
      return url.toString().replace(/\/$/, "");
    }
  } catch (error) {
    // If URL parsing fails, log and return original
    console.log("URL normalization failed:", baseURL, error);
  }
  return baseURL;
};

export const createApiInstance = (baseURL: string, apiKey: string): AxiosInstance => {
  const resolvedApiKey = apiKey?.trim() || getDefaultApiKey();
  const normalizedBaseURL = normalizeBaseUrl(baseURL);
  apiInstance = axios.create({
    baseURL: normalizedBaseURL,
    timeout: 15000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Auth interceptor — attaches API key to every request
  apiInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    if (resolvedApiKey) {
      config.headers["X-N8N-API-KEY"] = resolvedApiKey;
    }
    return config;
  });

  // Response error interceptor
  apiInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401 && resolvedApiKey) {
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
      return createApiInstance(`${connection.serverUrl}/api/v1`, connection.apiKey);
    }
    if (connection.serverUrl) {
      return createApiInstance(`${connection.serverUrl}/api/v1`, "");
    }
    // Return a placeholder instance — requests will fail gracefully
    return axios.create({ baseURL: "http://localhost:5678/api/v1" });
  }
  return apiInstance;
};
