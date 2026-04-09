import React, { useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  useColorScheme,
  Alert,
} from "react-native";
import { useAppStore } from "../store/useAppStore";
import { getWorkflows } from "../services/workflow.service";
import { triggerWorkflow } from "../services/workflow.service";
import { getExecutions } from "../services/execution.service";
import { StatusBadge } from "../components/StatusBadge";
import { AutomationCard } from "../components/AutomationCard";

export const HomeScreen: React.FC = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const user = useAppStore((s) => s.user);
  const connection = useAppStore((s) => s.connection);
  const automations = useAppStore((s) => s.automations);
  const isLoading = useAppStore((s) => s.isLoadingAutomations);
  const isLoadingExecutions = useAppStore((s) => s.isLoadingExecutions);
  const setAutomations = useAppStore((s) => s.setAutomations);
  const setLoading = useAppStore((s) => s.setLoadingAutomations);
  const executions = useAppStore((s) => s.executions);
  const setExecutions = useAppStore((s) => s.setExecutions);
  const setLoadingExecutions = useAppStore((s) => s.setLoadingExecutions);

  const loadData = useCallback(async () => {
    setLoading(true);
    setLoadingExecutions(true);
    try {
      const [workflows, execs] = await Promise.all([
        getWorkflows(),
        getExecutions(),
      ]);
      setAutomations(workflows);
      setExecutions(execs);
    } catch {
      // silently ignore — show stale data
    } finally {
      setLoading(false);
      setLoadingExecutions(false);
    }
  }, [setAutomations, setLoading, setExecutions, setLoadingExecutions]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSampleRun = async () => {
    if (automations.length === 0) return;
    try {
      await triggerWorkflow(automations[0].id);
      Alert.alert("Triggered", `"${automations[0].name}" has been triggered`);
    } catch {
      Alert.alert("Error", "Could not trigger workflow");
    }
  };

  const total = automations.length;
  const success = automations.filter((w) => w.status === "ENABLED").length;
  const failed = automations.filter((w) => w.status === "DISABLED").length;
  const running = new Set(executions.filter((e) => e.status === "RUNNING").map((e) => e.flowId)).size;

  const bg = isDark ? "bg-slate-900" : "bg-slate-50";
  const cardBg = isDark ? "bg-slate-800" : "bg-white";

  return (
    <ScrollView
      className={`flex-1 ${bg}`}
      refreshControl={
        <RefreshControl refreshing={isLoading || isLoadingExecutions} onRefresh={loadData} />
      }
    >
      {/* Header greeting */}
      <View className={`px-5 pt-14 pb-5 ${isDark ? "bg-slate-900" : "bg-white"}`}>
        <Text className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          Welcome back,
        </Text>
        <Text
          className={`text-2xl font-bold mt-0.5 ${
            isDark ? "text-slate-100" : "text-slate-900"
          }`}
        >
          {user?.name ?? "Automator"} 👋
        </Text>

        {/* Server chip */}
        <View className="flex-row items-center mt-3 gap-2">
          <StatusBadge status={connection.status === "connected" ? "connected" : "disconnected"} />
          <Text
            className={`text-xs ml-2 ${isDark ? "text-slate-400" : "text-slate-500"}`}
            numberOfLines={1}
          >
            {connection.serverUrl || "No server connected"}
          </Text>
        </View>
      </View>

      <View className="px-5 py-5">
        {/* Stats cards */}
        <Text
          className={`text-sm font-semibold uppercase tracking-wider mb-3 ${
            isDark ? "text-slate-400" : "text-slate-500"
          }`}
        >
          Overview
        </Text>

        <View className="flex-row gap-3 mb-5">
          <StatCard label="Total" value={total} color="blue" isDark={isDark} />
          <StatCard label="Success" value={success} color="green" isDark={isDark} />
          <StatCard label="Failed" value={failed} color="red" isDark={isDark} />
        </View>

        {running > 0 && (
          <View
            className={`rounded-xl p-3 mb-5 flex-row items-center ${
              isDark ? "bg-yellow-900/40" : "bg-yellow-50"
            }`}
          >
            <View className="w-2 h-2 rounded-full bg-yellow-500 mr-2" />
            <Text className={`text-sm font-medium ${isDark ? "text-yellow-200" : "text-yellow-800"}`}>
              {running} workflow{running !== 1 ? "s" : ""} currently running
            </Text>
          </View>
        )}

        {/* Quick actions */}
        <Text
          className={`text-sm font-semibold uppercase tracking-wider mb-3 ${
            isDark ? "text-slate-400" : "text-slate-500"
          }`}
        >
          Quick Actions
        </Text>

        <View className="flex-row gap-3">
          <QuickActionCard
            emoji="⚡"
            title="Run Sample"
            subtitle="Trigger first workflow"
            color="bg-blue-600"
            onPress={handleSampleRun}
          />
          <QuickActionCard
            emoji="🔄"
            title="Refresh"
            subtitle="Reload all automations"
            color="bg-green-600"
            onPress={loadData}
          />
        </View>

        {/* Recent workflows */}
        <Text
          className={`text-sm font-semibold uppercase tracking-wider mt-6 mb-3 ${
            isDark ? "text-slate-400" : "text-slate-500"
          }`}
        >
          Workflows
        </Text>
        {automations.length === 0 ? (
          <View className="items-center py-8">
            <Text className="text-3xl mb-2">⚙️</Text>
            <Text
              className={`text-base font-medium ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}
            >
              No workflows yet
            </Text>
            <Text className={`text-sm mt-1 ${isDark ? "text-slate-500" : "text-slate-400"}`}>
              Create a workflow in n8n to see it here
            </Text>
          </View>
        ) : (
          <View>
            {automations.slice(0, 5).map((workflow) => (
              <AutomationCard
                key={workflow.id}
                workflow={workflow}
                onPress={() => {}}
                onRun={async () => {
                  try {
                    await triggerWorkflow(workflow.id);
                    Alert.alert("Triggered", `"${workflow.name}" has been triggered`);
                  } catch {
                    Alert.alert("Error", "Could not trigger workflow");
                  }
                }}
              />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

// ─── Sub-components ──────────────────────────────────────────────────────────

const StatCard: React.FC<{
  label: string;
  value: number;
  color: "blue" | "green" | "red";
  isDark: boolean;
}> = ({ label, value, color, isDark }) => {
  const colorMap = {
    blue: { text: "text-blue-600", bg: isDark ? "bg-blue-900/30" : "bg-blue-50" },
    green: { text: "text-green-600", bg: isDark ? "bg-green-900/30" : "bg-green-50" },
    red: { text: "text-red-600", bg: isDark ? "bg-red-900/30" : "bg-red-50" },
  };
  const { text, bg } = colorMap[color];

  return (
    <View
      className={`flex-1 rounded-2xl p-4 ${bg}`}
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: isDark ? 0 : 0.04,
        shadowRadius: 4,
        elevation: 1,
      }}
    >
      <Text className={`text-2xl font-bold ${text}`}>{value}</Text>
      <Text
        className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}
      >
        {label}
      </Text>
    </View>
  );
};

const QuickActionCard: React.FC<{
  emoji: string;
  title: string;
  subtitle: string;
  color: string;
  onPress: () => void;
}> = ({ emoji, title, subtitle, color, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.85}
    className={`flex-1 rounded-2xl p-4 ${color}`}
    style={{
      shadowColor: "#2563EB",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 3,
    }}
  >
    <Text className="text-2xl mb-2">{emoji}</Text>
    <Text className="text-white font-semibold text-sm">{title}</Text>
    <Text className="text-blue-200 text-xs mt-0.5">{subtitle}</Text>
  </TouchableOpacity>
);



