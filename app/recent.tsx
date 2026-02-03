import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    RefreshControl,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BACKEND_URL } from "./utils/constants";

type RecentChat = {
  chatId: string;
  otherUserName: string;
  lastMessage?: string;
  timestamp?: string;
  unread?: number;
};

export default function RecentChatsScreen() {
  const [chats, setChats] = useState<RecentChat[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function loadChats() {
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND_URL}/chats`);
      const data = await res.json();
      setChats(data);
    } catch (error) {
      console.error("Failed to load chats:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadChats();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadChats();
  };

  const renderChatItem = ({ item }: { item: RecentChat }) => (
    <Pressable
      onPress={() =>
        router.push({
          pathname: `/chat/[chatId]`,
          params: {
            otherUserName: item.otherUserName,
            chatId: item.chatId,
          },
        })
      }
      style={({ pressed }) => [
        recentStyles.chatCard,
        pressed && recentStyles.chatCardPressed,
      ]}
    >
      <View style={recentStyles.chatAvatar}>
        <Text style={recentStyles.chatAvatarText}>
          {item.otherUserName?.charAt(0).toUpperCase() || "?"}
        </Text>
      </View>

      <View style={recentStyles.chatContent}>
        <View style={recentStyles.chatHeader}>
          <Text style={recentStyles.chatName} numberOfLines={1}>
            {item.otherUserName}
          </Text>
          {item.timestamp && (
            <Text style={recentStyles.chatTime}>
              {new Date(item.timestamp).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          )}
        </View>

        <View style={recentStyles.chatFooter}>
          <Text style={recentStyles.chatMessage} numberOfLines={1}>
            {item.lastMessage || "No messages yet"}
          </Text>
          {item.unread ? (
            <View style={recentStyles.unreadBadge}>
              <Text style={recentStyles.unreadText}>
                {item.unread > 9 ? "9+" : item.unread}
              </Text>
            </View>
          ) : null}
        </View>
      </View>

      <Text style={recentStyles.chevron}>›</Text>
    </Pressable>
  );

  if (loading) {
    return (
      <View style={recentStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#10b981" />
        <Text style={recentStyles.loadingText}>Loading chats...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={recentStyles.container}>
      {/* Header */}
      <View style={recentStyles.header}>
        <Text style={recentStyles.headerTitle}>Messages</Text>
        <View style={recentStyles.headerBadge}>
          <Text style={recentStyles.headerBadgeText}>{chats.length}</Text>
        </View>
      </View>

      {/* Chat List */}
      <FlatList
        data={chats}
        keyExtractor={(item) => item.chatId}
        renderItem={renderChatItem}
        contentContainerStyle={recentStyles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#10b981"
          />
        }
        ListEmptyComponent={
          <View style={recentStyles.emptyState}>
            <Text style={recentStyles.emptyEmoji}>💭</Text>
            <Text style={recentStyles.emptyTitle}>No chats yet</Text>
            <Text style={recentStyles.emptySubtitle}>
              Start a conversation to see your chats here
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const recentStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    backgroundColor: "#ffffff",
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
  },
  headerBadge: {
    backgroundColor: "#10b981",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  headerBadgeText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#ffffff",
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  chatCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  chatCardPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  chatAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#10b981",
    alignItems: "center",
    justifyContent: "center",
  },
  chatAvatarText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffffff",
  },
  chatContent: {
    flex: 1,
    gap: 6,
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chatName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
    flex: 1,
  },
  chatTime: {
    fontSize: 12,
    color: "#9ca3af",
    marginLeft: 8,
  },
  chatFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  chatMessage: {
    fontSize: 14,
    color: "#6b7280",
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: "#10b981",
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  unreadText: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#ffffff",
  },
  chevron: {
    fontSize: 28,
    color: "#d1d5db",
    fontWeight: "300",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9fafb",
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: "#6b7280",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyEmoji: {
    fontSize: 72,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 24,
  },
});
