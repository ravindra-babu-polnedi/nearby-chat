import * as Location from "expo-location";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Animated,
    StyleSheet,
    Text,
    View,
} from "react-native";
import getSocket from "./src/socket";

const socket = getSocket();

export default function MatchingScreen() {
  const { name, radius, duration } = useLocalSearchParams<{
    name?: string;
    radius: string;
    duration: string;
  }>();

  const [status, setStatus] = useState("Requesting location...");
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const joinedRef = useRef(false);

  useEffect(() => {
    console.log("Socket connected?", socket.connected);

    socket.on("connect", () => {
      console.log("🟢 socket connected", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("🔴 socket disconnected");
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  useEffect(() => {
    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    async function startMatching() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Location permission required");
        router.back();
        return;
      }

      setStatus("Getting your location...");
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = loc.coords;

      if (joinedRef.current) return;
      joinedRef.current = true;

      setStatus("Finding nearby people...");
      console.log("Emitting JOIN_POOL", {
        name,
        latitude,
        longitude,
        radius,
        duration,
      });

      socket.emit("JOIN_POOL", {
        name,
        latitude,
        longitude,
        radius,
        duration,
      });

      socket.emit("JOIN_POOL", {
        name,
        latitude,
        longitude,
        radius: Number(radius),
        duration: Number(duration),
      });

      socket.on("MATCH_FOUND", ({ chatId, otherUserName }) => {
        router.replace({
          pathname: `/chat/[chatId]`,
          params: { otherUserName, chatId },
        });
      });

      socket.on("MATCH_TIMEOUT", ({ message }) => {
        alert(message);
        router.replace("/setup");
      });
    }

    startMatching();

    return () => {
      socket.off("MATCH_FOUND");
    };
  }, []);

  return (
    <View style={matchingStyles.container}>
      <View style={matchingStyles.content}>
        {/* Animated Circle */}
        <Animated.View
          style={[matchingStyles.circle, { transform: [{ scale: pulseAnim }] }]}
        >
          <View style={matchingStyles.innerCircle}>
            <Text style={matchingStyles.emoji}>🔍</Text>
          </View>
        </Animated.View>

        {/* Loading Spinner */}
        <ActivityIndicator size="large" color="#10b981" />

        {/* Status Text */}
        <View style={matchingStyles.textContainer}>
          <Text style={matchingStyles.title}>{status}</Text>
          <Text style={matchingStyles.subtitle}>
            This may take a few moments
          </Text>
        </View>

        {/* Info Card */}
        <View style={matchingStyles.infoCard}>
          <View style={matchingStyles.infoRow}>
            <Text style={matchingStyles.infoLabel}>Radius:</Text>
            <Text style={matchingStyles.infoValue}>{radius} km</Text>
          </View>
          <View style={matchingStyles.divider} />
          <View style={matchingStyles.infoRow}>
            <Text style={matchingStyles.infoLabel}>Duration:</Text>
            <Text style={matchingStyles.infoValue}>{duration} min</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const matchingStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 24,
  },
  circle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#d1fae5",
    alignItems: "center",
    justifyContent: "center",
  },
  innerCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#10b981",
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: {
    fontSize: 48,
  },
  textContainer: {
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
  },
  infoCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 16,
    color: "#6b7280",
  },
  infoValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#10b981",
  },
  divider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 12,
  },
});
