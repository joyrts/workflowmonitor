import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AutomationsStackParamList } from "../types";
import { AutomationsScreen } from "../screens/AutomationsScreen";
import { AutomationDetailScreen } from "../screens/AutomationDetailScreen";

const Stack = createNativeStackNavigator<AutomationsStackParamList>();

export const AutomationsStack: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="AutomationsList" component={AutomationsScreen} />
    <Stack.Screen name="AutomationDetail" component={AutomationDetailScreen} />
  </Stack.Navigator>
);
