import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../types";
import { LoginScreen } from "../screens/LoginScreen";
import { ConnectServerScreen } from "../screens/ConnectServerScreen";

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthStackNavigator: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="ConnectServer" component={ConnectServerScreen} />
  </Stack.Navigator>
);
