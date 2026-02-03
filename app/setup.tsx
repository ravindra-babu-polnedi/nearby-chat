import Slider from "@react-native-community/slider";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function SetupScreen() {
  const { name } = useLocalSearchParams<{ name?: string }>();
  const [radius, setRadius] = useState(5);
  const [duration, setDuration] = useState(10);

  function connect() {
    router.push({
      pathname: "/matching",
      params: { name, radius, duration },
    });
  }

  return (
    <KeyboardAvoidingView
      style={setupStyles.keyboardView}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={setupStyles.container}>
        <ScrollView
          contentContainerStyle={setupStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={setupStyles.header}>
            <Text style={setupStyles.greeting}>
              Hello, {name || "Anonymous"}! 👤
            </Text>
            <Text style={setupStyles.subtitle}>
              Configure your matching preferences
            </Text>
            <Pressable onPress={() => router.push("/recent")}>
              <Text
                style={{ color: "#10b981", marginTop: 8, fontWeight: "600" }}
              >
                Go to Recent Chats
              </Text>
            </Pressable>
          </View>

          {/* Settings Cards */}
          <View style={setupStyles.cardsContainer}>
            {/* Radius Card */}
            <View style={setupStyles.card}>
              <View style={setupStyles.iconContainer}>
                <Text style={setupStyles.icon}>📍</Text>
              </View>
              <View style={setupStyles.cardContent}>
                <Text style={setupStyles.cardTitle}>Search Radius</Text>
                <Text style={setupStyles.cardSubtitle}>
                  Find people within this distance
                </Text>

                {/* Radius Value Display */}
                <View style={setupStyles.valueContainer}>
                  <Text style={setupStyles.valueText}>{radius}</Text>
                  <Text style={setupStyles.unit}>km</Text>
                </View>

                {/* Slider */}
                <Slider
                  style={setupStyles.slider}
                  minimumValue={1}
                  maximumValue={50}
                  step={1}
                  value={radius}
                  onValueChange={setRadius}
                  minimumTrackTintColor="#10b981"
                  maximumTrackTintColor="#e5e7eb"
                  thumbTintColor="#10b981"
                />

                {/* Range Labels */}
                <View style={setupStyles.rangeLabels}>
                  <Text style={setupStyles.rangeLabel}>1 km</Text>
                  <Text style={setupStyles.rangeLabel}>50 km</Text>
                </View>
              </View>
            </View>

            {/* Duration Card */}
            <View style={setupStyles.card}>
              <View style={setupStyles.iconContainer}>
                <Text style={setupStyles.icon}>⏱️</Text>
              </View>
              <View style={setupStyles.cardContent}>
                <Text style={setupStyles.cardTitle}>Search Duration</Text>
                <Text style={setupStyles.cardSubtitle}>
                  How long you want to search
                </Text>

                {/* Duration Value Display */}
                <View style={setupStyles.valueContainer}>
                  <Text style={setupStyles.valueText}>{duration}</Text>
                  <Text style={setupStyles.unit}>minutes</Text>
                </View>

                {/* Slider */}
                <Slider
                  style={setupStyles.slider}
                  minimumValue={5}
                  maximumValue={60}
                  step={5}
                  value={duration}
                  onValueChange={setDuration}
                  minimumTrackTintColor="#10b981"
                  maximumTrackTintColor="#e5e7eb"
                  thumbTintColor="#10b981"
                />

                {/* Range Labels */}
                <View style={setupStyles.rangeLabels}>
                  <Text style={setupStyles.rangeLabel}>5 min</Text>
                  <Text style={setupStyles.rangeLabel}>60 min</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Connect Button */}
          <Pressable
            onPress={connect}
            style={({ pressed }) => [
              setupStyles.connectButton,
              pressed && setupStyles.buttonPressed,
            ]}
          >
            <Text style={setupStyles.connectButtonText}>Start Matching</Text>
          </Pressable>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const setupStyles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  scrollContent: {
    padding: 24,
    gap: 24,
  },
  header: {
    gap: 8,
    marginTop: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
  },
  cardsContainer: {
    gap: 16,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    width: 56,
    height: 56,
    backgroundColor: "#f0fdf4",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: 28,
  },
  cardContent: {
    flex: 1,
    gap: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#6b7280",
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
    marginTop: 8,
  },
  valueText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#10b981",
  },
  unit: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6b7280",
  },
  slider: {
    width: "100%",
    height: 40,
  },
  rangeLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  rangeLabel: {
    fontSize: 12,
    color: "#9ca3af",
    fontWeight: "500",
  },
  connectButton: {
    backgroundColor: "#10b981",
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 8,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  connectButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
  },
});
