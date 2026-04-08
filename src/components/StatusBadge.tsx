import React from "react";
import { View, Text } from "react-native";
import { ExecutionStatus, WorkflowStatus } from "../types";

type Status = ExecutionStatus | WorkflowStatus | "connected" | "disconnected" | "error";

interface StatusBadgeProps {
  status: Status;
  size?: "sm" | "md";
}

const STATUS_CONFIG: Record<
  Status,
  { label: string; bgClass: string; textClass: string; dotClass: string }
> = {
  SUCCEEDED: {
    label: "Success",
    bgClass: "bg-green-100",
    textClass: "text-green-800",
    dotClass: "bg-green-500",
  },
  FAILED: {
    label: "Failed",
    bgClass: "bg-red-100",
    textClass: "text-red-700",
    dotClass: "bg-red-500",
  },
  RUNNING: {
    label: "Running",
    bgClass: "bg-yellow-100",
    textClass: "text-yellow-800",
    dotClass: "bg-yellow-500",
  },
  STOPPED: {
    label: "Stopped",
    bgClass: "bg-slate-100",
    textClass: "text-slate-600",
    dotClass: "bg-slate-400",
  },
  ENABLED: {
    label: "Active",
    bgClass: "bg-green-100",
    textClass: "text-green-800",
    dotClass: "bg-green-500",
  },
  DISABLED: {
    label: "Disabled",
    bgClass: "bg-slate-100",
    textClass: "text-slate-600",
    dotClass: "bg-slate-400",
  },
  DRAFT: {
    label: "Draft",
    bgClass: "bg-blue-100",
    textClass: "text-blue-700",
    dotClass: "bg-blue-400",
  },
  connected: {
    label: "Connected",
    bgClass: "bg-green-100",
    textClass: "text-green-800",
    dotClass: "bg-green-500",
  },
  disconnected: {
    label: "Disconnected",
    bgClass: "bg-slate-100",
    textClass: "text-slate-500",
    dotClass: "bg-slate-400",
  },
  error: {
    label: "Error",
    bgClass: "bg-red-100",
    textClass: "text-red-700",
    dotClass: "bg-red-500",
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = "sm",
}) => {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.STOPPED;
  const padding = size === "md" ? "px-3 py-1.5" : "px-2.5 py-1";
  const textSize = size === "md" ? "text-sm" : "text-xs";

  return (
    <View className={`flex-row items-center rounded-full ${padding} ${config.bgClass}`}>
      <View className={`w-1.5 h-1.5 rounded-full mr-1.5 ${config.dotClass}`} />
      <Text className={`font-semibold ${textSize} ${config.textClass}`}>
        {config.label}
      </Text>
    </View>
  );
};
