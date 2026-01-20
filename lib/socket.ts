// socket.ts
import { io, Socket } from "socket.io-client";
import { Alert } from "react-native";

// Replace with your computer's LAN IP if using a device
const SOCKET_URL = "http://192.168.100.3:3000";

let socket: Socket | null = null;

/**
 * Initialize socket and register user
 */
export const initSocket = (email: string) => {
    if (!socket) {
      socket = io(SOCKET_URL, { transports: ["websocket"] });
  
      socket.on("connect", () => {
        console.log("Socket connected:", socket?.id);
  
        // Register user
        socket?.emit("register_user", { email });
      });
  
      socket.on("disconnect", () => console.log("Socket disconnected"));
  
      // Listen for hello messages
      socket.on("hello", (msg: string) => {
        Alert.alert("Socket.IO Message", msg);
      });
    }
    return socket;
  };

/**
 * Send a hello to a specific user by email
 */
export const sendHello = (email: string) => {
    console.log('sendingHello')
  if (!socket) throw new Error("Socket not initialized");
  console.log({socket})
  socket.emit("send_hello", email);
};

export const onHello = (callback: (msg: string) => void) => {
    console.log('receivinghello')
    
    if (!socket) throw new Error("Socket not initialized");
    socket.on("hello", callback);
  };
