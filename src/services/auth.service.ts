import { createApiInstance, getDefaultApiKey, getApiInstance, normalizeBaseUrl } from "./api";
import { useAppStore } from "../store/useAppStore";
import { sleep } from "../utils/helpers";
import { Platform } from "react-native";
import axios from "axios";

export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Normalize server URL to proper format
 * Handles: localhost, localhost:port, domain, IP address, with/without protocol
 */
export const normalizeServerUrl = (input: string): string => {
  input = input?.trim() || "";

  if (!input) {
    throw new Error("Server URL cannot be empty");
  }

  // Remove any trailing slashes
  input = input.replace(/\/+$/, "");

  // If already has https:// or http://, validate and return
  if (input.startsWith("http://") || input.startsWith("https://")) {
    // Basic validation - should have at least a hostname
    if (input.length < 10) { // "http://a" is minimum valid
      throw new Error("Invalid server URL format - try: http://localhost:5678");
    }
    return input;
  }

  // For inputs without protocol, validate basic format
  if (!/^[a-zA-Z0-9.-]+(?::\d+)?$/.test(input)) {
    throw new Error("Invalid server URL format - try: localhost:5678 or 192.168.1.1:5678");
  }

  // Add http:// protocol if missing
  let normalized = `http://${input}`;

  // If localhost with no port, add default port 5678
  if (input === "localhost") {
    normalized = `http://localhost:5678`;
  }

  // If 127.0.0.1 with no port, add default port 5678
  if (input === "127.0.0.1") {
    normalized = `http://127.0.0.1:5678`;
  }

  return normalized;
};

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
 * Connect to n8n server using provided credentials.
 * Handles URL normalization and API key priority (user input > env variable)
 * Makes a real API call to validate the connection and API key.
 */
export const connectServer = async (serverUrl: string, apiKey: string): Promise<boolean> => {
  const store = useAppStore.getState();
  store.setConnection({ status: "connecting" });

  try {
    // Normalize the server URL
    let normalizedUrl = normalizeServerUrl(serverUrl);
    
    // API Key priority: user input > environment variable
    const userApiKey = apiKey?.trim();
    const envApiKey = getDefaultApiKey();
    const finalApiKey = userApiKey || envApiKey;
    
    console.log(`API Key logic: userApiKey="${userApiKey ? userApiKey.substring(0, 10) + '...' : 'EMPTY'}", envApiKey="${envApiKey ? envApiKey.substring(0, 10) + '...' : 'NONE'}", finalApiKey="${finalApiKey ? finalApiKey.substring(0, 10) + '...' : 'NONE'}"`);
    
    if (!finalApiKey) {
      throw new Error("API key required - provide one or set EXPO_PUBLIC_N8N_API_KEY environment variable");
    }

    // Create API instance with the API key for future requests
    createApiInstance(`${normalizedUrl}/api/v1`, finalApiKey);

    // Verify the server endpoint with the actual n8n API path
    const checkServerReachable = async (rootUrl: string) => {
      const normalizedRoot = normalizeBaseUrl(rootUrl);
      const testApi = axios.create({
        baseURL: normalizedRoot,
        timeout: 5000,
        headers: {
          "X-N8N-API-KEY": finalApiKey,
          "Content-Type": "application/json",
        },
      });
      await testApi.get('/api/v1/workflows?limit=1');
    };

    try {
      await checkServerReachable(normalizedUrl);
      console.log("✅ Server reachable - allowing connection");
    } catch (error: any) {
      if (error.response) {
        console.log("✅ Server reachable but request failed", error.response.status);
        if (error.response.status === 401) {
          throw new Error("Invalid API key - please check and try again");
        }
        if (error.response.status === 403) {
          throw new Error("Access forbidden - API key may not have required permissions");
        }
      }

      if (Platform.OS === "android" && !normalizedUrl.includes("10.0.2.2")) {
        try {
          const fallbackUrl = normalizedUrl.replace(/^(https?:\/\/)([^/:]+)(:\d+)?$/, "$110.0.2.2$3");
          console.log(`Attempting Android emulator fallback URL: ${fallbackUrl}`);
          await checkServerReachable(fallbackUrl);
          console.log("✅ Android fallback reachable - allowing connection");
          normalizedUrl = fallbackUrl;
          createApiInstance(`${fallbackUrl}/api/v1`, finalApiKey);
        } catch (fallbackError: any) {
          console.log("❌ Android fallback failed", fallbackError?.message);
          const androidHint = " on Android emulator use 10.0.2.2:5678";
          throw new Error(`Cannot reach n8n server - check URL and network connection${androidHint}`);
        }
      } else {
        console.log("❌ Server not reachable");
        const androidHint = Platform.OS === "android"
          ? " on Android emulator use 10.0.2.2:5678"
          : "";
        throw new Error(`Cannot reach n8n server - check URL and network connection${androidHint}`);
      }
    }

    // If we get here, the server is reachable - allow connection
    store.setConnection({ 
      serverUrl: normalizedUrl, 
      apiKey: finalApiKey, 
      status: "connected" 
    });
    return true;
  } catch (error: any) {
    console.log("Connection test failed:", error.response?.status, error.message, error.stack);
    store.setConnection({ status: "error" });
    // Re-throw sanitized error message for the UI
    if (error.message?.includes("Server URL cannot be empty")) {
      throw new Error("Server URL is required");
    }
    if (error.message?.includes("Invalid server URL format")) {
      throw error; // Re-throw the specific error from normalizeServerUrl
    }
    if (error instanceof TypeError && error.message?.includes("URL")) {
      throw new Error("Invalid server URL format - try: localhost:5678 or http://192.168.1.1:5678");
    }
    if (error.code === "ERR_INVALID_URL") {
      throw new Error("Invalid server URL format - check the URL syntax");
    }
    if (error.response?.status === 401) {
      throw new Error("Invalid API key - please check and try again");
    }
    if (error.response?.status === 403) {
      throw new Error("Access forbidden - API key may not have required permissions");
    }
    if (error.code === "ECONNABORTED" || error.code === "ERR_NETWORK") {
      throw new Error("Cannot reach server — check URL and network connection");
    }
    throw new Error(error.message ?? "Connection failed");
  }
};
