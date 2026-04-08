import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  useColorScheme,
} from "react-native";
import { useAppStore } from "../store/useAppStore";
import { StatusBadge } from "../components/StatusBadge";
import { ButtonPrimary } from "../components/ButtonPrimary";

export const SettingsScreen: React.FC = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const user = useAppStore((s) => s.user);
  const connection = useAppStore((s) => s.connection);
  const logout = useAppStore((s) => s.logout);
  const setConnection = useAppStore((s) => s.setConnection);

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: logout,
      },
    ]);
  };

  const handleDisconnect = () => {
    Alert.alert("Disconnect Server", "This will remove the saved connection.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Disconnect",
        style: "destructive",
        onPress: () =>
          setConnection({ serverUrl: "", apiKey: "", status: "disconnected" }),
      },
    ]);
  };

  const bg = isDark ? "bg-slate-900" : "bg-slate-50";
  const cardBg = isDark ? "bg-slate-800" : "bg-white";
  const text = isDark ? "text-slate-100" : "text-slate-900";
  const subtext = isDark ? "text-slate-400" : "text-slate-500";

  return (
    <ScrollView className={`flex-1 ${bg}`}>
      {/* Header */}
      <View className={`px-5 pt-14 pb-5 ${isDark ? "bg-slate-900" : "bg-white"}`}>
        <Text className={`text-2xl font-bold ${text}`}>Settings</Text>
      </View>

      <View className="px-5 py-5">
        {/* Profile section */}
        <SectionLabel label="Profile" isDark={isDark} />
        <View
          className={`rounded-2xl px-4 py-4 mb-5 ${cardBg}`}
          style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: isDark ? 0 : 0.05, shadowRadius: 4, elevation: 1 }}
        >
          <View className="flex-row items-center">
            <View className="w-12 h-12 bg-blue-600 rounded-full items-center justify-center mr-3">
              <Text className="text-white font-bold text-base">
                {(user?.name?.[0] ?? "U").toUpperCase()}
              </Text>
            </View>
            <View>
              <Text className={`font-semibold ${text}`}>{user?.name ?? "User"}</Text>
              <Text className={`text-sm ${subtext}`}>{user?.email ?? "-"}</Text>
            </View>
          </View>
        </View>

        {/* Connection section */}
        <SectionLabel label="Connection" isDark={isDark} />
        <View
          className={`rounded-2xl overflow-hidden mb-5 ${cardBg}`}
          style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: isDark ? 0 : 0.05, shadowRadius: 4, elevation: 1 }}
        >
          <SettingsRow label="Status" isDark={isDark}>
            <StatusBadge
              status={
                connection.status === "connected" ? "connected" : "disconnected"
              }
            />
          </SettingsRow>
          <Divider isDark={isDark} />
          <SettingsRow label="Server URL" isDark={isDark}>
            <Text
              className={`text-xs max-w-[180px] ${subtext}`}
              numberOfLines={1}
            >
              {connection.serverUrl || "Not set"}
            </Text>
          </SettingsRow>
          <Divider isDark={isDark} />
          <SettingsRow label="API Key" isDark={isDark}>
            <Text className={`text-xs ${subtext}`}>
              {connection.apiKey
                ? `${"•".repeat(8)}${connection.apiKey.slice(-4)}`
                : "Not set"}
            </Text>
          </SettingsRow>
        </View>

        {/* Actions section */}
        <SectionLabel label="Actions" isDark={isDark} />
        <View
          className={`rounded-2xl overflow-hidden mb-5 ${cardBg}`}
          style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: isDark ? 0 : 0.05, shadowRadius: 4, elevation: 1 }}
        >
          <TouchableActionRow
            label="Change Server"
            icon="🔗"
            isDark={isDark}
            onPress={handleDisconnect}
          />
          <Divider isDark={isDark} />
          <TouchableActionRow
            label="Disconnect Server"
            icon="⚡"
            isDark={isDark}
            onPress={handleDisconnect}
            destructive
          />
        </View>

        {/* App info */}
        <SectionLabel label="About" isDark={isDark} />
        <View
          className={`rounded-2xl overflow-hidden mb-8 ${cardBg}`}
          style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: isDark ? 0 : 0.05, shadowRadius: 4, elevation: 1 }}
        >
          <SettingsRow label="App" isDark={isDark}>
            <Text className={`text-sm ${subtext}`}>Flow Control</Text>
          </SettingsRow>
          <Divider isDark={isDark} />
          <SettingsRow label="Version" isDark={isDark}>
            <Text className={`text-sm ${subtext}`}>1.0.0</Text>
          </SettingsRow>
        </View>

        <ButtonPrimary
          title="Sign Out"
          variant="danger"
          onPress={handleLogout}
        />
      </View>
    </ScrollView>
  );
};

// ─── Sub-components ──────────────────────────────────────────────────────────

const SectionLabel: React.FC<{ label: string; isDark: boolean }> = ({
  label,
  isDark,
}) => (
  <Text
    className={`text-xs font-semibold uppercase tracking-wider mb-2 px-1 ${
      isDark ? "text-slate-400" : "text-slate-500"
    }`}
  >
    {label}
  </Text>
);

const Divider: React.FC<{ isDark: boolean }> = ({ isDark }) => (
  <View
    className={`h-px mx-4 ${isDark ? "bg-slate-700" : "bg-slate-100"}`}
  />
);

const SettingsRow: React.FC<{
  label: string;
  isDark: boolean;
  children: React.ReactNode;
}> = ({ label, isDark, children }) => (
  <View className="px-4 py-3.5 flex-row items-center justify-between">
    <Text className={`text-sm ${isDark ? "text-slate-300" : "text-slate-700"}`}>
      {label}
    </Text>
    {children}
  </View>
);

const TouchableActionRow: React.FC<{
  label: string;
  icon: string;
  isDark: boolean;
  onPress: () => void;
  destructive?: boolean;
}> = ({ label, icon, isDark, onPress, destructive }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    className="px-4 py-3.5 flex-row items-center"
  >
    <Text className="mr-3">{icon}</Text>
    <Text
      className={`text-sm ${
        destructive
          ? "text-red-500"
          : isDark
          ? "text-slate-300"
          : "text-slate-700"
      }`}
    >
      {label}
    </Text>
    <Text className={`ml-auto ${isDark ? "text-slate-500" : "text-slate-400"}`}>
      →
    </Text>
  </TouchableOpacity>
);
