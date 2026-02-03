// src/socket.ts
import { io, Socket } from "socket.io-client";
import { BACKEND_URL } from "../utils/constants";

let socket: Socket | null = null;

export default function getSocket(): Socket {
  if (!socket) {
    socket = io(BACKEND_URL, {
      transports: ["websocket"],
      autoConnect: false,
    });
  }
  return socket;
}
