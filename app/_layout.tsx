import { Stack } from "expo-router";
import { useEffect } from "react";
import getSocket from "./src/socket";

export default function RootLayout() {
  useEffect(() => {
    const socket = getSocket();
    socket.connect();

    socket.on("connect", () => {
      console.log("🟢 Socket connected", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Socket disconnected");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
