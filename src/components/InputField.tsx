import React, { useState } from "react";
import {
  TextInput,
  Text,
  View,
  TextInputProps,
  useColorScheme,
  TouchableOpacity,
  Clipboard,
  Alert,
} from "react-native";

interface InputFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  showPasteButton?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  error,
  showPasteButton,
  value,
  onChangeText,
  secureTextEntry,
  ...props
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [isPasting, setIsPasting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handlePaste = async () => {
    try {
      setIsPasting(true);
      const clipboardText = await Clipboard.getString();
      if (clipboardText) {
        onChangeText?.(clipboardText);
      } else {
        Alert.alert("Clipboard Empty", "Nothing to paste");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to read clipboard");
    } finally {
      setIsPasting(false);
    }
  };

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
      <View className="flex-row items-center">
        <TextInput
          className={`flex-1 rounded-xl px-4 py-3.5 text-base border ${
            error
              ? "border-red-500"
              : isDark
              ? "border-slate-700 bg-slate-800 text-slate-100"
              : "border-slate-200 bg-white text-slate-900"
          }`}
          placeholderTextColor={isDark ? "#64748B" : "#94A3B8"}
          autoCapitalize="none"
          autoCorrect={false}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !showPassword}
          {...props}
        />
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            className={`ml-2 px-3 py-3.5 rounded-xl items-center justify-center ${
              isDark ? "bg-slate-700" : "bg-slate-100"
            }`}
          >
            <Text className="text-lg">{showPassword ? "👁️" : "👁️‍🗨️"}</Text>
          </TouchableOpacity>
        )}
        {showPasteButton && (
          <TouchableOpacity
            onPress={handlePaste}
            disabled={isPasting}
            className={`ml-2 px-3 py-3.5 rounded-xl items-center justify-center ${
              isDark ? "bg-slate-700" : "bg-slate-100"
            }`}
          >
            <Text className={`text-lg ${isPasting ? "opacity-50" : ""}`}>📋</Text>
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text className="text-red-500 text-xs mt-1">{error}</Text>
      )}
    </View>
  );
};
