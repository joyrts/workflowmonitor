import React, { memo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { Workflow } from "../types";
import { StatusBadge } from "./StatusBadge";
import { formatRelativeTime } from "../utils/helpers";

interface AutomationCardProps {
  workflow: Workflow;
  onPress: (workflow: Workflow) => void;
  onRun: (workflow: Workflow) => void;
  isRunning?: boolean;
}

export const AutomationCard: React.FC<AutomationCardProps> = memo(
  ({ workflow, onPress, onRun, isRunning }) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    return (
      <TouchableOpacity
        onPress={() => onPress(workflow)}
        activeOpacity={0.75}
        className={`rounded-2xl p-4 mb-3 shadow-sm ${
          isDark ? "bg-slate-800" : "bg-white"
        }`}
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: isDark ? 0 : 0.06,
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        {/* Header row */}
        <View className="flex-row items-start justify-between mb-2">
          <View className="flex-1 mr-3">
            <Text
              className={`font-semibold text-base mb-0.5 ${
                isDark ? "text-slate-100" : "text-slate-900"
              }`}
              numberOfLines={2}
            >
              {workflow.name}
            </Text>
            {workflow.description && (
              <Text
                className={`text-sm ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
                numberOfLines={1}
              >
                {workflow.description}
              </Text>
            )}
          </View>
          <StatusBadge status={workflow.status} />
        </View>

        {/* Meta row */}
        <View className="flex-row items-center justify-between mt-3">
          <View className="flex-row items-center">
            <Text
              className={`text-xs mr-3 ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              {workflow.steps.length} step{workflow.steps.length !== 1 ? "s" : ""}
            </Text>
            {workflow.lastRunAt && (
              <Text
                className={`text-xs ${
                  isDark ? "text-slate-500" : "text-slate-400"
                }`}
              >
                Last run {formatRelativeTime(workflow.lastRunAt)}
              </Text>
            )}
          </View>

          {/* Run button */}
          <TouchableOpacity
            onPress={() => onRun(workflow)}
            disabled={isRunning || workflow.status === "DISABLED"}
            activeOpacity={0.7}
            className={`rounded-xl px-4 py-2 ${
              workflow.status === "DISABLED" || isRunning
                ? "bg-slate-200"
                : "bg-blue-600"
            }`}
          >
            <Text
              className={`text-xs font-semibold ${
                workflow.status === "DISABLED" || isRunning
                  ? "text-slate-500"
                  : "text-white"
              }`}
            >
              {isRunning ? "Running…" : "Run"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Last run status */}
        {workflow.lastRunStatus && (
          <View className="mt-2 pt-2 border-t border-slate-100 flex-row items-center">
            <Text
              className={`text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}
            >
              Last result:{" "}
            </Text>
            <StatusBadge status={workflow.lastRunStatus} />
          </View>
        )}
      </TouchableOpacity>
    );
  }
);
