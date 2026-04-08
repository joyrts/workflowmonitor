import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  Alert,
  useColorScheme,
  TextInput,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AutomationsStackParamList, Workflow } from "../types";
import { AutomationCard } from "../components/AutomationCard";
import { useAppStore } from "../store/useAppStore";
import { getWorkflows, triggerWorkflow } from "../services/workflow.service";

type Props = {
  navigation: NativeStackNavigationProp<AutomationsStackParamList, "AutomationsList">;
};

export const AutomationsScreen: React.FC<Props> = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const automations = useAppStore((s) => s.automations);
  const isLoading = useAppStore((s) => s.isLoadingAutomations);
  const setAutomations = useAppStore((s) => s.setAutomations);
  const setLoading = useAppStore((s) => s.setLoadingAutomations);

  const [search, setSearch] = useState("");
  const [runningId, setRunningId] = useState<string | null>(null);

  const loadWorkflows = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getWorkflows();
      setAutomations(data);
    } catch {
      Alert.alert("Error", "Failed to load automations");
    } finally {
      setLoading(false);
    }
  }, [setAutomations, setLoading]);

  useEffect(() => {
    if (automations.length === 0) loadWorkflows();
  }, []);

  const handleRun = async (workflow: Workflow) => {
    if (workflow.status === "DISABLED") return;
    setRunningId(workflow.id);
    try {
      await triggerWorkflow(workflow.id);
      Alert.alert("✓ Triggered", `"${workflow.name}" is now running`);
    } catch {
      Alert.alert("Error", "Failed to trigger workflow");
    } finally {
      setRunningId(null);
    }
  };

  const handleDetail = (workflow: Workflow) => {
    navigation.navigate("AutomationDetail", {
      id: workflow.id,
      name: workflow.name,
    });
  };

  const filtered = automations.filter((w) =>
    w.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View className={`flex-1 ${isDark ? "bg-slate-900" : "bg-slate-50"}`}>
      {/* Header */}
      <View className={`px-5 pt-14 pb-4 ${isDark ? "bg-slate-900" : "bg-white"}`}>
        <Text
          className={`text-2xl font-bold ${
            isDark ? "text-slate-100" : "text-slate-900"
          }`}
        >
          Automations
        </Text>
        <Text className={`text-sm mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          {automations.length} workflow{automations.length !== 1 ? "s" : ""}
        </Text>

        {/* Search */}
        <View
          className={`mt-4 flex-row items-center rounded-xl px-3 py-2.5 ${
            isDark ? "bg-slate-700" : "bg-slate-100"
          }`}
        >
          <Text className="mr-2 text-slate-400">🔍</Text>
          <TextInput
            className={`flex-1 text-sm ${isDark ? "text-slate-100" : "text-slate-900"}`}
            placeholder="Search automations…"
            placeholderTextColor={isDark ? "#64748B" : "#94A3B8"}
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
          />
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={loadWorkflows} />
        }
        renderItem={({ item }) => (
          <AutomationCard
            workflow={item}
            onPress={handleDetail}
            onRun={handleRun}
            isRunning={runningId === item.id}
          />
        )}
        ListEmptyComponent={
          <View className="items-center py-16">
            <Text className="text-4xl mb-3">⚙️</Text>
            <Text
              className={`text-base font-medium ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}
            >
              {search ? "No matching automations" : "No automations yet"}
            </Text>
            <Text className={`text-sm mt-1 ${isDark ? "text-slate-500" : "text-slate-400"}`}>
              {search ? "Try a different search term" : "Connect a server to get started"}
            </Text>
          </View>
        }
      />
    </View>
  );
};
