import React from "react";
import {
  TextInput,
  Text,
  View,
  TextInputProps,
  useColorScheme,
} from "react-native";

interface InputFieldProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  error,
  ...props
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View className="mb-4">
      {label && (
        <Text
          className={`text-sm font-semibold mb-1.5 ${
            isDark ? "text-slate-300" : "text-slate-700"
          }`}
        >
          {label}
        </Text>
      )}
      <TextInput
        className={`rounded-xl px-4 py-3.5 text-base border ${
          error
            ? "border-red-500"
            : isDark
            ? "border-slate-700 bg-slate-800 text-slate-100"
            : "border-slate-200 bg-white text-slate-900"
        }`}
        placeholderTextColor={isDark ? "#64748B" : "#94A3B8"}
        autoCapitalize="none"
        autoCorrect={false}
        {...props}
      />
      {error && (
        <Text className="text-red-500 text-xs mt-1">{error}</Text>
      )}
    </View>
  );
};
