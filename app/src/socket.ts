// src/socket.ts
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export default function getSocket(): Socket {
  if (!socket) {
    socket = io("http://192.168.1.2:8000", {
      transports: ["websocket"],
      autoConnect: false,
    });
  }
  return socket;
}
