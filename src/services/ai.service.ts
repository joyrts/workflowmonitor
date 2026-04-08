import { getApiInstance } from "./api";
import { MOCK_AI_RESPONSE } from "../utils/mockData";
import { sleep } from "../utils/helpers";

const USE_MOCK = true;

export interface AIResponse {
  message: string;
  workflowJson?: object;
}

export const sendChatMessage = async (prompt: string): Promise<AIResponse> => {
  if (USE_MOCK) {
    await sleep(1200); // simulate AI latency
    return { message: MOCK_AI_RESPONSE(prompt) };
  }
  const api = getApiInstance();
  const response = await api.post("/api/v1/ai/chat", { message: prompt });
  return response.data;
};

export const createWorkflowWithAI = async (prompt: string): Promise<object> => {
  if (USE_MOCK) {
    await sleep(1500);
    return { name: "AI Generated Workflow", description: prompt };
  }
  const api = getApiInstance();
  const response = await api.post("/api/v1/ai/create-workflow", { prompt });
  return response.data;
};
