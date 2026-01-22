// socket.ts
// socket.ts 
import { io, Socket } from "socket.io-client";
import { useSocketStore } from "@/store";
import { Alert } from "react-native";
import { Ride } from "@/types/type";


const SOCKET_URL = "http://192.168.100.3:3000";


const getSocket = (): Socket => {
  const socket = useSocketStore.getState().socket;
  if (!socket) {
    throw new Error("Socket not initialized");
  }
  return socket;
};


export const initSocket = (email: string): Socket => {
  const socket = io(SOCKET_URL, { transports: ["websocket"] });

  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
    socket.emit("register_user", { email });
  });

  socket.on("disconnect", () => console.log("Socket disconnected"));

  socket.on("hello", (msg: string) => {
    Alert.alert("Socket.IO Message", msg);
  });

  // Store in Zustand
  const setSocket = useSocketStore.getState().setSocket;
  setSocket(socket);

  return socket;
};
 

/**
 * Send a hello to a specific user by email
 */
export const sendHello = (email: string) => {
  console.log("sendingHello");
  const socket = getSocket();
  socket.emit("send_hello", email);
};

export const onHello = (callback: (msg: string) => void) => {
  console.log("receivingHello");
  const socket = getSocket();
  socket.on("hello", callback);
};
export const getDriverLocation = (callback: (msg: string) => void) => {
  //console.log("receivingHello");
  const socket = getSocket();
  socket.on("hello", callback);
};

//  RIDES SOCKETSSSSSSS

export const sendRideRequest = (ride: Ride, callback?: (response: any) => void) => {
  const socket = getSocket();

  // emit a ride request to the server
  socket.emit("request:ride", ride, (response: any) => {
    // server can respond with ACK
    if (callback) callback(response);
  });
};
export const acceptRideRequest = (ride: Ride, callback?: (response: any) => void) => {
  const socket = getSocket();

  // emit a ride request to the server
  socket.emit("accept:ride", ride, (response: any) => {
    // server can respond with ACK
    if (callback) callback(response);

   
    
  });
};

