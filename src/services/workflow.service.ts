import { getApiInstance } from "./api";
import { Workflow } from "../types";
import { MOCK_WORKFLOWS } from "../utils/mockData";
import { sleep } from "../utils/helpers";

const USE_MOCK = false; // toggle when real backend is available

type N8nWorkflow = {
  id: string | number;
  name: string;
  active: boolean;
  nodes?: Array<{
    id?: string | number;
    name?: string;
    type?: string;
    disabled?: boolean;
  }>;
  createdAt?: string;
  updatedAt?: string;
};

const toWorkflow = (wf: N8nWorkflow): Workflow => ({
  id: String(wf.id),
  name: wf.name ?? "Untitled",
  description: undefined,
  status: wf.active ? "ENABLED" : "DISABLED",
  lastRunAt: undefined,
  lastRunStatus: undefined,
  steps:
    wf.nodes?.map((node, idx) => ({
      id: String(node.id ?? idx),
      type: node.type ?? "node",
      name: node.name ?? `Step ${idx + 1}`,
      valid: node.disabled ? false : true,
    })) ?? [],
  createdAt: wf.createdAt ?? new Date().toISOString(),
  updatedAt: wf.updatedAt ?? new Date().toISOString(),
});

export const getWorkflows = async (): Promise<Workflow[]> => {
  if (USE_MOCK) {
    await sleep(600);
    return MOCK_WORKFLOWS;
  }
  const api = getApiInstance();
  const response = await api.get("/workflows");
  const data = response.data?.data ?? response.data ?? [];
  return (data as N8nWorkflow[]).map(toWorkflow);
};

export const triggerWorkflow = async (flowId: string): Promise<void> => {
  if (USE_MOCK) {
    await sleep(500);
    return;
  }
  const api = getApiInstance();
  await api.post(`/workflows/${flowId}/run`, {});
};

export const getWorkflowById = async (flowId: string): Promise<Workflow | undefined> => {
  if (USE_MOCK) {
    await sleep(300);
    return MOCK_WORKFLOWS.find((w) => w.id === flowId);
  }
  const api = getApiInstance();
  const response = await api.get(`/workflows/${flowId}`);
  const data = response.data?.data ?? response.data;
  return data ? toWorkflow(data as N8nWorkflow) : undefined;
};
