// 1. ChatScreen.tsx - Modern Chat UI
// ============================================
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import getSocket from "../src/socket";

const socket = getSocket();

type Message = {
  chatId?: string;
  sender: string;
  text: string;
  timestamp?: string;
};

export default function ChatScreen() {
  const { chatId, otherUserName } = useLocalSearchParams<{
    chatId: string;
    otherUserName: string;
  }>();

  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    socket.emit("JOIN_CHAT", { chatId });

    socket.on("RECEIVE_MESSAGE", (msg: Message) => {
      if (msg.chatId !== chatId) return;
      setMessages((prev) => [
        ...prev,
        { ...msg, timestamp: new Date().toISOString() },
      ]);
    });

    return () => {
      socket.off("RECEIVE_MESSAGE");
    };
  }, []);

  function send() {
    if (!text.trim()) return;

    const newMessage = {
      sender: "me",
      text,
      timestamp: new Date().toISOString(),
    };

    socket.emit("SEND_MESSAGE", {
      chatId,
      text,
    });

    setMessages((prev) => [...prev, newMessage]);
    setText("");

    // Auto scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }

  const renderMessage = ({ item }: { item: Message }) => {
    const isMe = item.sender === "me";

    return (
      <View
        style={[
          chatStyles.messageContainer,
          isMe
            ? chatStyles.myMessageContainer
            : chatStyles.otherMessageContainer,
        ]}
      >
        <View
          style={[
            chatStyles.messageBubble,
            isMe ? chatStyles.myMessage : chatStyles.otherMessage,
          ]}
        >
          <Text
            style={[
              chatStyles.messageText,
              isMe ? chatStyles.myMessageText : chatStyles.otherMessageText,
            ]}
          >
            {item.text}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={chatStyles.container}>
      {/* Header */}
      <View style={chatStyles.header}>
        <Pressable onPress={() => router.back()} style={chatStyles.backButton}>
          <Text style={chatStyles.backIcon}>←</Text>
        </Pressable>
        <View style={chatStyles.headerContent}>
          <View style={chatStyles.avatar}>
            <Text style={chatStyles.avatarText}>
              {otherUserName?.charAt(0).toUpperCase() || "?"}
            </Text>
          </View>
          <View style={chatStyles.headerInfo}>
            <Text style={chatStyles.headerName}>{otherUserName}</Text>
            <View style={chatStyles.onlineIndicator}>
              <View style={chatStyles.onlineDot} />
              <Text style={chatStyles.onlineText}>Online</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Messages */}
      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(_, i) => i.toString()}
        renderItem={renderMessage}
        contentContainerStyle={chatStyles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <View style={chatStyles.emptyState}>
            <Text style={chatStyles.emptyEmoji}>💬</Text>
            <Text style={chatStyles.emptyText}>No messages yet</Text>
            <Text style={chatStyles.emptySubtext}>Start the conversation!</Text>
          </View>
        }
      />

      {/* Input (keyboard-aware ONLY) */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <View style={chatStyles.inputContainer}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Type a message..."
            placeholderTextColor="#9ca3af"
            style={chatStyles.input}
            multiline
            maxLength={500}
          />
          <Pressable
            onPress={send}
            style={({ pressed }) => [
              chatStyles.sendButton,
              pressed && chatStyles.sendButtonPressed,
              !text.trim() && chatStyles.sendButtonDisabled,
            ]}
            disabled={!text.trim()}
          >
            <Text style={chatStyles.sendIcon}>➤</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const chatStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    backgroundColor: "#ffffff",
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
  },
  backIcon: {
    fontSize: 24,
    color: "#374151",
  },
  headerContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#10b981",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  onlineIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 2,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#10b981",
  },
  onlineText: {
    fontSize: 12,
    color: "#6b7280",
  },
  keyboardView: {
    flex: 1,
  },
  messagesList: {
    padding: 16,
    gap: 12,
  },
  messageContainer: {
    marginVertical: 4,
  },
  myMessageContainer: {
    alignItems: "flex-end",
  },
  otherMessageContainer: {
    alignItems: "flex-start",
  },
  messageBubble: {
    maxWidth: "75%",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  myMessage: {
    backgroundColor: "#10b981",
    borderBottomRightRadius: 4,
  },
  otherMessage: {
    backgroundColor: "#ffffff",
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  myMessageText: {
    color: "#ffffff",
  },
  otherMessageText: {
    color: "#111827",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#9ca3af",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 12,
    paddingBottom: Platform.OS === "ios" ? 24 : 12, // 👈 IMPORTANT
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    gap: 12,
    alignItems: "flex-end",
  },

  input: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#111827",
    maxHeight: 100,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#10b981",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  sendButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendIcon: {
    fontSize: 20,
    color: "#ffffff",
  },
});
