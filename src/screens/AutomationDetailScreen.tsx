import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Alert,
  useColorScheme,
  ActivityIndicator,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { AutomationsStackParamList, Workflow, Execution } from "../types";
import { StatusBadge } from "../components/StatusBadge";
import { ButtonPrimary } from "../components/ButtonPrimary";
import { useAppStore } from "../store/useAppStore";
import { getWorkflowById, triggerWorkflow } from "../services/workflow.service";
import { getExecutions } from "../services/execution.service";
import { formatRelativeTime, formatDuration } from "../utils/helpers";

type Props = {
  navigation: NativeStackNavigationProp<
    AutomationsStackParamList,
    "AutomationDetail"
  >;
  route: RouteProp<AutomationsStackParamList, "AutomationDetail">;
};

export const AutomationDetailScreen: React.FC<Props> = ({
  navigation,
  route,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { id, name } = route.params;

  const [workflow, setWorkflow] = useState<Workflow | undefined>(
    useAppStore.getState().automations.find((w) => w.id === id)
  );
  const [executions, setExecutions] = useState<Execution[]>([]);
  const [loading, setLoading] = useState(!workflow);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [wf, execs] = await Promise.all([
          getWorkflowById(id),
          getExecutions(id),
        ]);
        if (wf) setWorkflow(wf);
        setExecutions(execs.slice(0, 5));
      } catch {
        // use existing data
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleRun = async () => {
    if (!workflow || workflow.status === "DISABLED") return;
    setRunning(true);
    try {
      await triggerWorkflow(id);
      Alert.alert("✓ Triggered", `"${name}" has been triggered successfully`);
    } catch {
      Alert.alert("Error", "Failed to trigger workflow");
    } finally {
      setRunning(false);
    }
  };

  const bg = isDark ? "bg-slate-900" : "bg-slate-50";
  const cardBg = isDark ? "bg-slate-800" : "bg-white";
  const text = isDark ? "text-slate-100" : "text-slate-900";
  const subtext = isDark ? "text-slate-400" : "text-slate-500";

  if (loading) {
    return (
      <View className={`flex-1 items-center justify-center ${bg}`}>
        <ActivityIndicator color="#2563EB" size="large" />
      </View>
    );
  }

  if (!workflow) {
    return (
      <View className={`flex-1 items-center justify-center px-8 ${bg}`}>
        <Text className={`text-lg font-medium ${text}`}>Workflow not found</Text>
        <ButtonPrimary
          title="Go Back"
          variant="secondary"
          onPress={() => navigation.goBack()}
          style={{ marginTop: 16, width: 200 }}
        />
      </View>
    );
  }

  return (
    <ScrollView className={`flex-1 ${bg}`} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Back header */}
      <View
        className={`px-5 pt-14 pb-5 ${isDark ? "bg-slate-900" : "bg-white"}`}
      >
        <Text
          onPress={() => navigation.goBack()}
          className="text-blue-500 text-sm mb-3"
        >
          ← Back
        </Text>
        <View className="flex-row items-start justify-between">
          <Text className={`text-xl font-bold flex-1 mr-3 ${text}`}>
            {workflow.name}
          </Text>
          <StatusBadge status={workflow.status} size="md" />
        </View>
        {workflow.description && (
          <Text className={`mt-2 text-sm ${subtext}`}>{workflow.description}</Text>
        )}
      </View>

      <View className="px-5 pt-5">
        {/* Run button */}
        <ButtonPrimary
          title={running ? "Running…" : "▶  Run Now"}
          loading={running}
          disabled={workflow.status === "DISABLED"}
          onPress={handleRun}
        />
        {workflow.status === "DISABLED" && (
          <Text className={`text-xs text-center mt-2 ${subtext}`}>
            Enable this workflow to run it
          </Text>
        )}

        {/* Steps */}
        <Text
          className={`text-sm font-semibold uppercase tracking-wider mt-6 mb-3 ${subtext}`}
        >
          Steps ({workflow.steps.length})
        </Text>
        <View className={`rounded-2xl overflow-hidden ${cardBg}`}>
          {workflow.steps.map((step, i) => (
            <View
              key={step.id}
              className={`px-4 py-3.5 flex-row items-center ${
                i < workflow.steps.length - 1
                  ? isDark
                    ? "border-b border-slate-700"
                    : "border-b border-slate-100"
                  : ""
              }`}
            >
              <View
                className={`w-7 h-7 rounded-full items-center justify-center mr-3 ${
                  step.type === "TRIGGER" ? "bg-blue-100" : "bg-slate-100"
                }`}
              >
                <Text className="text-xs font-bold text-slate-600">
                  {i + 1}
                </Text>
              </View>
              <View className="flex-1">
                <Text className={`text-sm font-medium ${text}`}>
                  {step.name}
                </Text>
                <Text className={`text-xs mt-0.5 ${subtext}`}>
                  {step.type}
                </Text>
              </View>
              <View
                className={`w-2 h-2 rounded-full ${
                  step.valid ? "bg-green-500" : "bg-red-500"
                }`}
              />
            </View>
          ))}
        </View>

        {/* Recent executions */}
        <Text
          className={`text-sm font-semibold uppercase tracking-wider mt-6 mb-3 ${subtext}`}
        >
          Recent Runs
        </Text>
        {executions.length === 0 ? (
          <View className={`rounded-2xl p-6 items-center ${cardBg}`}>
            <Text className={`text-sm ${subtext}`}>No executions yet</Text>
          </View>
        ) : (
          <View className={`rounded-2xl overflow-hidden ${cardBg}`}>
            {executions.map((exec, i) => (
              <View
                key={exec.id}
                className={`px-4 py-3.5 flex-row items-center justify-between ${
                  i < executions.length - 1
                    ? isDark
                      ? "border-b border-slate-700"
                      : "border-b border-slate-100"
                    : ""
                }`}
              >
                <View className="flex-row items-center flex-1">
                  <StatusBadge status={exec.status} />
                  <Text className={`ml-3 text-xs ${subtext}`}>
                    {formatRelativeTime(exec.startTime)}
                  </Text>
                </View>
                <Text className={`text-xs ${subtext}`}>
                  {formatDuration(exec.durationMs)}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};
