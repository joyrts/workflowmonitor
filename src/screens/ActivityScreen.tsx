import React, { useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  useColorScheme,
} from "react-native";
import { useAppStore } from "../store/useAppStore";
import { getExecutions } from "../services/execution.service";
import { StatusBadge } from "../components/StatusBadge";
import { formatRelativeTime, formatDuration } from "../utils/helpers";
import { Execution, Workflow } from "../types";

export const ActivityScreen: React.FC = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const executions = useAppStore((s) => s.executions);
  const automations = useAppStore((s) => s.automations);
  const isLoading = useAppStore((s) => s.isLoadingExecutions);
  const setExecutions = useAppStore((s) => s.setExecutions);
  const setLoading = useAppStore((s) => s.setLoadingExecutions);

  const loadActivity = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getExecutions();
      setExecutions(data);
    } catch {
      // leave stale data
    } finally {
      setLoading(false);
    }
  }, [setExecutions, setLoading]);

  useEffect(() => {
    loadActivity();
  }, [loadActivity]);

  // Group executions by workflow
  const groupedData = automations.map((workflow) => {
    const workflowExecutions = executions
      .filter((e) => e.flowId === workflow.id)
      .slice(0, 3); // Show last 3 runs per workflow
    return { workflow, executions: workflowExecutions };
  });

  const subtext = isDark ? "text-slate-400" : "text-slate-500";
  const cardBg = isDark ? "bg-slate-800" : "bg-white";

  const renderExecutionItem = (execution: Execution) => (
    <View
      className={`ml-4 mr-4 mb-2 rounded-xl px-3 py-2.5 ${
        isDark ? "bg-slate-700" : "bg-slate-100"
      }`}
    >
      <View className="flex-row items-center justify-between mb-1.5">
        <Text className={`text-xs font-medium flex-1 ${isDark ? "text-slate-200" : "text-slate-800"}`}>
          Run
        </Text>
        <StatusBadge status={execution.status} />
      </View>

      {execution.message && (
        <Text className={`text-xs mb-1.5 ${subtext}`} numberOfLines={1}>
          {execution.message}
        </Text>
      )}

      <View className="flex-row items-center justify-between">
        <Text className={`text-xs ${subtext}`}>
          {formatRelativeTime(execution.startTime)}
        </Text>
        <Text className={`text-xs ${subtext}`}>
          {formatDuration(execution.durationMs)}
        </Text>
      </View>
    </View>
  );

  const renderWorkflowGroup = ({ item }: { item: { workflow: Workflow; executions: Execution[] } }) => (
    <View className="mb-4">
      {/* Workflow header */}
      <View
        className={`mx-4 mb-2.5 rounded-2xl px-4 py-3 ${cardBg}`}
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: isDark ? 0 : 0.05,
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-1 mr-3">
            <Text
              className={`font-semibold text-sm ${
                isDark ? "text-slate-100" : "text-slate-900"
              }`}
              numberOfLines={1}
            >
              {item.workflow.name}
            </Text>
            <Text className={`text-xs mt-1 ${subtext}`}>
              {item.executions.length === 0 ? "No runs yet" : `${item.executions.length} recent run${item.executions.length !== 1 ? "s" : ""}`}
            </Text>
          </View>
          <StatusBadge status={item.workflow.status} />
        </View>
      </View>

      {/* Executions for this workflow */}
      {item.executions.length > 0 ? (
        item.executions.map((execution) => (
          <View key={execution.id}>{renderExecutionItem(execution)}</View>
        ))
      ) : (
        <View className={`mx-4 mb-3 rounded-xl px-3 py-2.5 ${isDark ? "bg-slate-700" : "bg-slate-100"}`}>
          <Text className={`text-xs ${subtext}`}>No execution history</Text>
        </View>
      )}
    </View>
  );

  return (
    <View className={`flex-1 ${isDark ? "bg-slate-900" : "bg-slate-50"}`}>
      {/* Header */}
      <View
        className={`px-5 pt-14 pb-4 ${isDark ? "bg-slate-900" : "bg-white"}`}
      >
        <Text
          className={`text-2xl font-bold ${
            isDark ? "text-slate-100" : "text-slate-900"
          }`}
        >
          Activity
        </Text>
        <Text className={`text-sm mt-0.5 ${subtext}`}>Recent execution runs</Text>
      </View>

      <FlatList
        data={groupedData}
        keyExtractor={(item) => item.workflow.id}
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 40 }}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={loadActivity} />
        }
        renderItem={renderWorkflowGroup}
        ListEmptyComponent={
          <View className="items-center py-16">
            <Text className="text-4xl mb-3">📋</Text>
            <Text
              className={`text-base font-medium ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}
            >
              No workflows yet
            </Text>
            <Text className={`text-sm mt-1 ${subtext}`}>
              Create workflows in the Flows tab to see activity here
            </Text>
          </View>
        }
      />
    </View>
  );
};
