// ─── User & Auth ─────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Connection {
  serverUrl: string;
  apiKey: string;
  status: "connected" | "disconnected" | "connecting" | "error";
  lastConnected?: string;
}

// ─── Workflow / Automation ────────────────────────────────────────────────────

export type WorkflowStatus = "ENABLED" | "DISABLED" | "DRAFT";
export type ExecutionStatus = "SUCCEEDED" | "FAILED" | "RUNNING" | "STOPPED";

export interface WorkflowStep {
  id: string;
  type: string;
  name: string;
  valid: boolean;
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  status: WorkflowStatus;
  lastRunAt?: string;
  lastRunStatus?: ExecutionStatus;
  steps: WorkflowStep[];
  createdAt: string;
  updatedAt: string;
}

// ─── Executions / Logs ───────────────────────────────────────────────────────

export interface Execution {
  id: string;
  flowId: string;
  flowName?: string;
  status: ExecutionStatus;
  startTime: string;
  finishTime?: string;
  message?: string;
  durationMs?: number;
}

// ─── AI Chat ─────────────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  generatedWorkflow?: Partial<Workflow>;
}

// ─── Navigation Types ─────────────────────────────────────────────────────────

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  ConnectServer: undefined;
};

export type AutomationsStackParamList = {
  AutomationsList: undefined;
  AutomationDetail: { id: string; name: string };
};

export type MainTabParamList = {
  Home: undefined;
  Automations: undefined;
  Activity: undefined;
  AIChat: undefined;
  Settings: undefined;
};

// ─── Store State ──────────────────────────────────────────────────────────────

export interface AppState {
  user: User | null;
  connection: Connection;
  automations: Workflow[];
  executions: Execution[];
  chatMessages: ChatMessage[];
  isLoadingAutomations: boolean;
  isLoadingExecutions: boolean;
  isLoadingAI: boolean;
  // Actions
  setUser: (user: User | null) => void;
  setConnection: (connection: Partial<Connection>) => void;
  setAutomations: (automations: Workflow[]) => void;
  setExecutions: (executions: Execution[]) => void;
  addChatMessage: (message: ChatMessage) => void;
  clearChat: () => void;
  setLoadingAutomations: (loading: boolean) => void;
  setLoadingExecutions: (loading: boolean) => void;
  setLoadingAI: (loading: boolean) => void;
  logout: () => void;
}
