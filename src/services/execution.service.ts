import { getApiInstance } from "./api";
import { Execution } from "../types";
import { MOCK_EXECUTIONS } from "../utils/mockData";
import { sleep } from "../utils/helpers";

const USE_MOCK = false;

type N8nExecution = {
  id: string | number;
  workflowId?: string | number;
  status?: string;
  startedAt?: string;
  stoppedAt?: string;
};

const mapStatus = (status?: string): Execution["status"] => {
  switch ((status ?? "").toLowerCase()) {
    case "success":
    case "succeeded":
      return "SUCCEEDED";
    case "error":
    case "failed":
      return "FAILED";
    case "stopped":
      return "STOPPED";
    case "running":
    case "waiting":
    default:
      return "RUNNING";
  }
};

const toExecution = (exec: N8nExecution): Execution => ({
  id: String(exec.id),
  flowId: String(exec.workflowId ?? ""),
  status: mapStatus(exec.status),
  startTime: exec.startedAt ?? new Date().toISOString(),
  finishTime: exec.stoppedAt ?? undefined,
});

export const getExecutions = async (flowId?: string): Promise<Execution[]> => {
  if (USE_MOCK) {
    await sleep(500);
    if (flowId) {
      return MOCK_EXECUTIONS.filter((e) => e.flowId === flowId);
    }
    return MOCK_EXECUTIONS;
  }
  const api = getApiInstance();
  const params = flowId ? { workflowId: flowId } : {};
  const response = await api.get("/executions", { params });
  const data = response.data?.data ?? response.data ?? [];
  return (data as N8nExecution[]).map(toExecution);
};
