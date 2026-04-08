import React from "react";
import { useColorScheme, View, Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MainTabParamList } from "../types";
import { HomeScreen } from "../screens/HomeScreen";
import { AutomationsStack } from "./AutomationsStack";
import { ActivityScreen } from "../screens/ActivityScreen";
import { AIChatScreen } from "../screens/AIChatScreen";
import { SettingsScreen } from "../screens/SettingsScreen";

const Tab = createBottomTabNavigator<MainTabParamList>();

const TAB_ICONS: Record<string, string> = {
  Home: "🏠",
  Automations: "⚙️",
  Activity: "📋",
  AIChat: "🤖",
  Settings: "⚙",
};

const TabIcon = ({
  name,
  focused,
  isDark,
}: {
  name: string;
  focused: boolean;
  isDark: boolean;
}) => (
  <View style={{ alignItems: "center" }}>
    <Text style={{ fontSize: focused ? 22 : 20, opacity: focused ? 1 : 0.55 }}>
      {TAB_ICONS[name]}
    </Text>
  </View>
);

export const MainTabNavigator: React.FC = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <TabIcon name={route.name} focused={focused} isDark={isDark} />
        ),
        tabBarActiveTintColor: "#2563EB",
        tabBarInactiveTintColor: isDark ? "#64748B" : "#94A3B8",
        tabBarStyle: {
          backgroundColor: isDark ? "#1E293B" : "#FFFFFF",
          borderTopColor: isDark ? "#334155" : "#E2E8F0",
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: "Home" }}
      />
      <Tab.Screen
        name="Automations"
        component={AutomationsStack}
        options={{ tabBarLabel: "Flows" }}
      />
      <Tab.Screen
        name="Activity"
        component={ActivityScreen}
        options={{ tabBarLabel: "Activity" }}
      />
      <Tab.Screen
        name="AIChat"
        component={AIChatScreen}
        options={{ tabBarLabel: "AI", tabBarIcon: ({ focused }) => (
          <TabIcon name="AIChat" focused={focused} isDark={isDark} />
        )}}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ tabBarLabel: "Settings", tabBarIcon: ({ focused }) => (
          <Text style={{ fontSize: focused ? 22 : 20, opacity: focused ? 1 : 0.55 }}>🔧</Text>
        )}}
      />
    </Tab.Navigator>
  );
};
