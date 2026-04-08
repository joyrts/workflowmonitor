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
import { useAppStore } from "../store/useAppStore";
import { login } from "../services/auth.service";

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, "Login">;
};

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const setUser = useAppStore((s) => s.setUser);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const validate = (): boolean => {
    let valid = true;
    if (!email.trim()) {
      setEmailError("Email is required");
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Enter a valid email address");
      valid = false;
    } else {
      setEmailError("");
    }
    if (!password) {
      setPasswordError("Password is required");
      valid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      valid = false;
    } else {
      setPasswordError("");
    }
    return valid;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const user = await login({ email: email.trim(), password });
      setUser({ id: user.id, email: user.email, name: user.name });
      navigation.navigate("ConnectServer");
    } catch (err: any) {
      Alert.alert("Login Failed", err.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
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
          {/* Logo & Title */}
          <View className="items-center mb-10">
            <View className="w-16 h-16 bg-blue-600 rounded-2xl items-center justify-center mb-4">
              <Text className="text-white text-2xl font-bold">FC</Text>
            </View>
            <Text
              className={`text-3xl font-bold mb-1 ${
                isDark ? "text-slate-100" : "text-slate-900"
              }`}
            >
              Flow Control
            </Text>
            <Text
              className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}
            >
              Manage your automations on the go
            </Text>
          </View>

          {/* Form */}
          <View
            className={`rounded-2xl p-6 ${
              isDark ? "bg-slate-800" : "bg-white"
            }`}
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: isDark ? 0 : 0.08,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <Text
              className={`text-lg font-bold mb-5 ${
                isDark ? "text-slate-100" : "text-slate-900"
              }`}
            >
              Sign In
            </Text>
            <InputField
              label="Email"
              placeholder="you@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              error={emailError}
              autoComplete="email"
            />
            <InputField
              label="Password"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              error={passwordError}
              autoComplete="password"
            />
            <ButtonPrimary
              title="Sign In"
              loading={loading}
              onPress={handleLogin}
            />
          </View>

          <Text
            className={`text-center text-xs mt-6 ${
              isDark ? "text-slate-500" : "text-slate-400"
            }`}
          >
            Demo: any valid email + 6+ char password
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
