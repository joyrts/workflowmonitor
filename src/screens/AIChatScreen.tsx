import React, { useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
  Alert,
} from "react-native";
import { useAppStore } from "../store/useAppStore";
import { sendChatMessage } from "../services/ai.service";
import { ChatBubble } from "../components/ChatBubble";
import { ChatMessage } from "../types";
import { generateId } from "../utils/helpers";

export const AIChatScreen: React.FC = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const messages = useAppStore((s) => s.chatMessages);
  const isLoading = useAppStore((s) => s.isLoadingAI);
  const addMessage = useAppStore((s) => s.addChatMessage);
  const clearChat = useAppStore((s) => s.clearChat);
  const setLoadingAI = useAppStore((s) => s.setLoadingAI);

  const [input, setInput] = useState("");
  const listRef = useRef<FlatList>(null);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: generateId(),
      role: "user",
      content: text,
      timestamp: new Date().toISOString(),
    };

    setInput("");
    addMessage(userMessage);
    setLoadingAI(true);

    // Scroll to bottom after sending
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);

    try {
      const response = await sendChatMessage(text);

      const assistantMessage: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content: response.message,
        timestamp: new Date().toISOString(),
        generatedWorkflow: response.workflowJson as any,
      };

      addMessage(assistantMessage);
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    } catch {
      const errMsg: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date().toISOString(),
      };
      addMessage(errMsg);
    } finally {
      setLoadingAI(false);
    }
  };

  const SUGGESTIONS = [
    "Notify Slack when a new lead arrives",
    "Send a daily email report",
    "Sync Airtable to Notion on new row",
  ];

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <View className={`flex-1 ${isDark ? "bg-slate-900" : "bg-slate-50"}`}>
        {/* Header */}
        <View
          className={`px-5 pt-14 pb-4 flex-row items-center justify-between ${
            isDark ? "bg-slate-900" : "bg-white"
          }`}
        >
          <View>
            <Text
              className={`text-2xl font-bold ${
                isDark ? "text-slate-100" : "text-slate-900"
              }`}
            >
              AI Chat
            </Text>
            <Text className={`text-sm mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Create workflows with natural language
            </Text>
          </View>
          {messages.length > 0 && (
            <TouchableOpacity
              onPress={() =>
                Alert.alert("Clear Chat", "Delete all messages?", [
                  { text: "Cancel", style: "cancel" },
                  { text: "Clear", style: "destructive", onPress: clearChat },
                ])
              }
              className="p-2"
            >
              <Text className="text-slate-400 text-sm">Clear</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Message list */}
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            padding: 16,
            paddingBottom: 8,
            flexGrow: messages.length === 0 ? 1 : undefined,
          }}
          renderItem={({ item }) => <ChatBubble message={item} />}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-12">
              <Text className="text-5xl mb-4">🤖</Text>
              <Text
                className={`text-base font-semibold mb-1 ${
                  isDark ? "text-slate-200" : "text-slate-700"
                }`}
              >
                AI Workflow Assistant
              </Text>
              <Text
                className={`text-sm text-center mb-8 ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Describe what you want to automate
              </Text>

              {/* Suggestion chips */}
              {SUGGESTIONS.map((s) => (
                <TouchableOpacity
                  key={s}
                  onPress={() => setInput(s)}
                  className={`rounded-xl px-4 py-2.5 mb-2 ${
                    isDark ? "bg-slate-700" : "bg-white"
                  }`}
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.05,
                    shadowRadius: 3,
                    elevation: 1,
                  }}
                >
                  <Text
                    className={`text-sm ${isDark ? "text-slate-300" : "text-slate-700"}`}
                  >
                    💡 {s}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          }
        />

        {/* Typing indicator */}
        {isLoading && (
          <View className="px-4 pb-2">
            <View
              className={`self-start rounded-2xl rounded-tl-md px-4 py-3 ${
                isDark ? "bg-slate-700" : "bg-slate-100"
              }`}
            >
              <Text className={`text-sm ${isDark ? "text-slate-300" : "text-slate-500"}`}>
                AI is thinking…
              </Text>
            </View>
          </View>
        )}

        {/* Input bar */}
        <View
          className={`px-4 py-3 flex-row items-end gap-2 ${
            isDark ? "bg-slate-900 border-t border-slate-700" : "bg-white border-t border-slate-100"
          }`}
        >
          <TextInput
            className={`flex-1 rounded-2xl px-4 py-3 text-sm min-h-[44px] max-h-28 ${
              isDark
                ? "bg-slate-700 text-slate-100"
                : "bg-slate-100 text-slate-900"
            }`}
            placeholder="Describe your automation…"
            placeholderTextColor={isDark ? "#64748B" : "#94A3B8"}
            value={input}
            onChangeText={setInput}
            multiline
            maxLength={500}
            returnKeyType="default"
          />
          <TouchableOpacity
            onPress={handleSend}
            disabled={!input.trim() || isLoading}
            activeOpacity={0.8}
            className={`w-11 h-11 rounded-2xl items-center justify-center ${
              !input.trim() || isLoading ? "bg-slate-300" : "bg-blue-600"
            }`}
          >
            <Text className="text-white font-bold text-base">↑</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};
