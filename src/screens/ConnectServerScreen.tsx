import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  useColorScheme,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../types";
import { InputField } from "../components/InputField";
import { ButtonPrimary } from "../components/ButtonPrimary";
import { StatusBadge } from "../components/StatusBadge";
import { connectServer } from "../services/auth.service";
import { useAppStore } from "../store/useAppStore";

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, "ConnectServer">;
};

export const ConnectServerScreen: React.FC<Props> = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const connection = useAppStore((s) => s.connection);

  const [serverUrl, setServerUrl] = useState(connection.serverUrl);
  const [apiKey, setApiKey] = useState(connection.apiKey);
  const [testing, setTesting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testResult, setTestResult] = useState<"success" | "error" | null>(null);
  const [testError, setTestError] = useState("");

  const handleTestConnection = async () => {
    if (!serverUrl.trim() || !apiKey.trim()) {
      Alert.alert("Missing Info", "Please enter both Server URL and API Key");
      return;
    }
    setTesting(true);
    setTestResult(null);
    setTestError("");
    try {
      await connectServer(serverUrl.trim(), apiKey.trim());
      setTestResult("success");
    } catch (err: any) {
      setTestResult("error");
      setTestError(err.message ?? "Connection failed");
    } finally {
      setTesting(false);
    }
  };

  const handleSave = async () => {
    if (!serverUrl.trim() || !apiKey.trim()) {
      Alert.alert("Missing Info", "Please enter both Server URL and API Key");
      return;
    }
    setSaving(true);
    try {
      await connectServer(serverUrl.trim(), apiKey.trim());
      // navigation is handled by RootNavigator watching connection.status
    } catch (err: any) {
      Alert.alert("Connection Error", err.message ?? "Could not connect to server");
    } finally {
      setSaving(false);
    }
  };

  const handleSkip = () => {
    // Allow skipping for demo — use mock data
    useAppStore.getState().setConnection({
      serverUrl: "http://demo.activepieces.local",
      apiKey: "demo-key-mock",
      status: "connected",
    });
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        className={`flex-1 ${isDark ? "bg-slate-900" : "bg-slate-50"}`}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 justify-center px-6 py-8">
          {/* Icon & Title */}
          <View className="items-center mb-8">
            <View className="w-14 h-14 bg-blue-600 rounded-xl items-center justify-center mb-3">
              <Text className="text-white text-xl font-bold">AP</Text>
            </View>
            <Text
              className={`text-2xl font-bold mb-1 ${
                isDark ? "text-slate-100" : "text-slate-900"
              }`}
            >
              Connect Server
            </Text>
            <Text
              className={`text-sm text-center ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Enter your Activepieces server details
            </Text>
          </View>

          {/* Form card */}
          <View
            className={`rounded-2xl p-5 mb-4 ${isDark ? "bg-slate-800" : "bg-white"}`}
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: isDark ? 0 : 0.08,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <InputField
              label="Server URL"
              placeholder="https://your-server.com"
              value={serverUrl}
              onChangeText={(v) => {
                setServerUrl(v);
                setTestResult(null);
              }}
              keyboardType="url"
            />
            <InputField
              label="API Key"
              placeholder="ap_xxxxxxxxxxxxxxxx"
              value={apiKey}
              onChangeText={(v) => {
                setApiKey(v);
                setTestResult(null);
              }}
              secureTextEntry
            />

            {/* Test result feedback */}
            {testResult && (
              <View
                className={`rounded-xl p-3 mb-4 flex-row items-center ${
                  testResult === "success" ? "bg-green-50" : "bg-red-50"
                }`}
              >
                <StatusBadge
                  status={testResult === "success" ? "connected" : "error"}
                  size="md"
                />
                <Text
                  className={`ml-2 text-sm flex-1 ${
                    testResult === "success" ? "text-green-700" : "text-red-600"
                  }`}
                >
                  {testResult === "success"
                    ? "Server reachable!"
                    : testError || "Connection failed"}
                </Text>
              </View>
            )}

            <ButtonPrimary
              title="Test Connection"
              variant="secondary"
              loading={testing}
              onPress={handleTestConnection}
            />
            <View className="h-3" />
            <ButtonPrimary
              title="Save & Connect"
              loading={saving}
              onPress={handleSave}
            />
          </View>

          {/* Skip for demo */}
          <ButtonPrimary
            title="Use Demo Mode"
            variant="secondary"
            onPress={handleSkip}
          />
          <Text
            className={`text-xs text-center mt-3 ${
              isDark ? "text-slate-500" : "text-slate-400"
            }`}
          >
            Demo mode uses mock data — no server required
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
