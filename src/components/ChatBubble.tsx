import React, { memo } from "react";
import { View, Text, useColorScheme } from "react-native";
import { ChatMessage } from "../types";

interface ChatBubbleProps {
  message: ChatMessage;
}

export const ChatBubble: React.FC<ChatBubbleProps> = memo(({ message }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const isUser = message.role === "user";

  return (
    <View
      className={`mb-3 max-w-[82%] ${isUser ? "self-end" : "self-start"}`}
    >
      <View
        className={`rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-blue-600 rounded-tr-md"
            : isDark
            ? "bg-slate-700 rounded-tl-md"
            : "bg-slate-100 rounded-tl-md"
        }`}
        style={
          isUser
            ? {
                shadowColor: "#2563EB",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 4,
              }
            : {}
        }
      >
        <Text
          className={`text-sm leading-5 ${
            isUser
              ? "text-white"
              : isDark
              ? "text-slate-100"
              : "text-slate-800"
          }`}
        >
          {message.content}
        </Text>
      </View>
      <Text
        className={`text-xs mt-1 ${
          isUser ? "text-right" : "text-left"
        } ${isDark ? "text-slate-500" : "text-slate-400"}`}
      >
        {new Date(message.timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Text>
    </View>
  );
});
