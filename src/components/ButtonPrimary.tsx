import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  TouchableOpacityProps,
} from "react-native";

interface ButtonPrimaryProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  variant?: "primary" | "secondary" | "danger";
}

export const ButtonPrimary: React.FC<ButtonPrimaryProps> = ({
  title,
  loading = false,
  variant = "primary",
  disabled,
  ...props
}) => {
  const bgClass =
    variant === "danger"
      ? "bg-red-600"
      : variant === "secondary"
      ? "bg-slate-200"
      : "bg-blue-600";

  const textClass =
    variant === "secondary" ? "text-slate-800" : "text-white";

  const opacityClass = disabled || loading ? "opacity-60" : "opacity-100";

  return (
    <TouchableOpacity
      className={`rounded-xl py-4 items-center justify-center ${bgClass} ${opacityClass}`}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "secondary" ? "#1e293b" : "#ffffff"}
          size="small"
        />
      ) : (
        <Text className={`font-semibold text-base ${textClass}`}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};
