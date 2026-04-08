import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppState, User, Connection, Workflow, Execution, ChatMessage } from "../types";

const DEFAULT_CONNECTION: Connection = {
  serverUrl: "",
  apiKey: "",
  status: "disconnected",
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // ─── State ───────────────────────────────────────────────────────────
      user: null,
      connection: DEFAULT_CONNECTION,
      automations: [],
      executions: [],
      chatMessages: [],
      isLoadingAutomations: false,
      isLoadingExecutions: false,
      isLoadingAI: false,

      // ─── Actions ─────────────────────────────────────────────────────────
      setUser: (user: User | null) => set({ user }),

      setConnection: (partial: Partial<Connection>) =>
        set((state) => ({ connection: { ...state.connection, ...partial } })),

      setAutomations: (automations: Workflow[]) => set({ automations }),

      setExecutions: (executions: Execution[]) => set({ executions }),

      addChatMessage: (message: ChatMessage) =>
        set((state) => ({ chatMessages: [...state.chatMessages, message] })),

      clearChat: () => set({ chatMessages: [] }),

      setLoadingAutomations: (isLoadingAutomations: boolean) =>
        set({ isLoadingAutomations }),

      setLoadingExecutions: (isLoadingExecutions: boolean) =>
        set({ isLoadingExecutions }),

      setLoadingAI: (isLoadingAI: boolean) => set({ isLoadingAI }),

      logout: () =>
        set({
          user: null,
          connection: DEFAULT_CONNECTION,
          automations: [],
          executions: [],
          chatMessages: [],
        }),
    }),
    {
      name: "flow-control-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        connection: state.connection,
      }),
    }
  )
);
