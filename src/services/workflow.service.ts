import { getApiInstance } from "./api";
import { Workflow } from "../types";
import { MOCK_WORKFLOWS } from "../utils/mockData";
import { sleep } from "../utils/helpers";

const USE_MOCK = true; // toggle when real backend is available

export const getWorkflows = async (): Promise<Workflow[]> => {
  if (USE_MOCK) {
    await sleep(600);
    return MOCK_WORKFLOWS;
  }
  const api = getApiInstance();
  const response = await api.get("/api/v1/flows");
  return response.data.data ?? [];
};

export const triggerWorkflow = async (flowId: string): Promise<void> => {
  if (USE_MOCK) {
    await sleep(500);
    return;
  }
  const api = getApiInstance();
  await api.post(`/api/v1/webhooks/${flowId}`);
};

export const getWorkflowById = async (flowId: string): Promise<Workflow | undefined> => {
  if (USE_MOCK) {
    await sleep(300);
    return MOCK_WORKFLOWS.find((w) => w.id === flowId);
  }
  const api = getApiInstance();
  const response = await api.get(`/api/v1/flows/${flowId}`);
  return response.data;
};
