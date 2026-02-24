import { useSegments } from "expo-router";
import React from "react";
import { KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  children: React.ReactNode;
};

export default function AppScreen({ children }: Props) {
  const segments = useSegments();

  // 👇 adjust "chat" if your folder name is different
  const isChat = segments[0] === "chat";

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      {isChat ? (
        children
      ) : (
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={0}
        >
          {children}
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
});
