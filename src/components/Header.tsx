import React from "react";
import { View, Text, useColorScheme, TouchableOpacity } from "react-native";

interface HeaderProps {
  title: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
  onBackPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  rightElement,
  onBackPress,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View
      className={`px-5 pt-14 pb-4 flex-row items-center justify-between ${
        isDark ? "bg-slate-900" : "bg-white"
      }`}
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: isDark ? 0.3 : 0.05,
        shadowRadius: 3,
        elevation: 2,
      }}
    >
      <View className="flex-row items-center flex-1">
        {onBackPress && (
          <TouchableOpacity onPress={onBackPress} className="mr-3 p-1">
            <Text
              className={`text-xl ${isDark ? "text-slate-200" : "text-slate-700"}`}
            >
              ←
            </Text>
          </TouchableOpacity>
        )}
        <View className="flex-1">
          <Text
            className={`text-xl font-bold ${
              isDark ? "text-slate-100" : "text-slate-900"
            }`}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              className={`text-sm mt-0.5 ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      {rightElement && <View className="ml-2">{rightElement}</View>}
    </View>
  );
};
