import { getApiInstance } from "./api";
import { Execution } from "../types";
import { MOCK_EXECUTIONS } from "../utils/mockData";
import { sleep } from "../utils/helpers";

const USE_MOCK = true;

export const getExecutions = async (flowId?: string): Promise<Execution[]> => {
  if (USE_MOCK) {
    await sleep(500);
    if (flowId) {
      return MOCK_EXECUTIONS.filter((e) => e.flowId === flowId);
    }
    return MOCK_EXECUTIONS;
  }
  const api = getApiInstance();
  const params = flowId ? { flowId } : {};
  const response = await api.get("/api/v1/flow-runs", { params });
  return response.data.data ?? [];
};
