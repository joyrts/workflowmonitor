import { createApiInstance } from "./api";
import { useAppStore } from "../store/useAppStore";
import { sleep } from "../utils/helpers";

export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Mock login — replace body with real API call when backend is ready.
 */
export const login = async (credentials: LoginCredentials) => {
  await sleep(800); // simulate network latency
  if (!credentials.email || !credentials.password) {
    throw new Error("Email and password are required");
  }
  // Mock user response
  return {
    id: "usr-001",
    email: credentials.email,
    name: credentials.email.split("@")[0],
    token: "mock-jwt-token",
  };
};

/**
 * Test a connection to an Activepieces server and register the API client.
 */
export const connectServer = async (serverUrl: string, apiKey: string): Promise<boolean> => {
  const store = useAppStore.getState();
  store.setConnection({ status: "connecting" });

  try {
    // Validate inputs
    const url = new URL(serverUrl); // throws if invalid URL
    if (!apiKey || apiKey.trim().length < 8) {
      throw new Error("API key must be at least 8 characters");
    }

    const api = createApiInstance(url.origin, apiKey.trim());

    // Activepieces health-check endpoint
    await api.get("/api/v1/flags");

    store.setConnection({ serverUrl: url.origin, apiKey: apiKey.trim(), status: "connected" });
    return true;
  } catch (error: any) {
    store.setConnection({ status: "error" });
    // Re-throw sanitized error message for the UI
    if (error instanceof TypeError || error.message?.includes("URL")) {
      throw new Error("Invalid server URL format");
    }
    if (error.response?.status === 401) {
      throw new Error("Invalid API key");
    }
    if (error.code === "ECONNABORTED" || error.code === "ERR_NETWORK") {
      throw new Error("Cannot reach server — check URL and network");
    }
    throw new Error(error.message ?? "Connection failed");
  }
};
