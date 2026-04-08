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
import { Execution } from "../types";

export const ActivityScreen: React.FC = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const executions = useAppStore((s) => s.executions);
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

  const subtext = isDark ? "text-slate-400" : "text-slate-500";

  const renderItem = ({ item }: { item: Execution }) => (
    <View
      className={`mx-4 mb-3 rounded-2xl px-4 py-3.5 ${
        isDark ? "bg-slate-800" : "bg-white"
      }`}
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: isDark ? 0 : 0.05,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      {/* Top row */}
      <View className="flex-row items-center justify-between mb-2">
        <Text
          className={`font-semibold text-sm flex-1 mr-3 ${
            isDark ? "text-slate-100" : "text-slate-900"
          }`}
          numberOfLines={1}
        >
          {item.flowName ?? item.flowId}
        </Text>
        <StatusBadge status={item.status} />
      </View>

      {/* Message */}
      {item.message && (
        <Text className={`text-xs mb-2 ${subtext}`} numberOfLines={2}>
          {item.message}
        </Text>
      )}

      {/* Meta */}
      <View className="flex-row items-center justify-between">
        <Text className={`text-xs ${subtext}`}>
          {formatRelativeTime(item.startTime)}
        </Text>
        <Text className={`text-xs ${subtext}`}>
          {formatDuration(item.durationMs)}
        </Text>
      </View>
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
        <Text className={`text-sm mt-0.5 ${subtext}`}>
          {executions.length} execution{executions.length !== 1 ? "s" : ""}
        </Text>
      </View>

      <FlatList
        data={executions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 40 }}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={loadActivity} />
        }
        renderItem={renderItem}
        ListEmptyComponent={
          <View className="items-center py-16">
            <Text className="text-4xl mb-3">📋</Text>
            <Text
              className={`text-base font-medium ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}
            >
              No activity yet
            </Text>
            <Text className={`text-sm mt-1 ${subtext}`}>
              Run a workflow to see logs here
            </Text>
          </View>
        }
      />
    </View>
  );
};
