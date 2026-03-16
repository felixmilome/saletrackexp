// socket.ts
// socket.ts 
import { io, Socket } from "socket.io-client";
import { useSocketStore, useLocationStore, useRideStore, useProfileStore, useDriverStore } from "@/store";
import { fetchAPI } from "./fetch";
import { Alert } from "react-native";
import { Ride } from "@/types/type";
import { router } from "expo-router";
import { use } from "react";



const SOCKET_URL = "http://192.168.100.201:3000";


const getSocket = (): Socket => {
  const socket = useSocketStore.getState().socket;
  if (!socket) {
    console.log("Socket not initialized");
  }
  return socket;
};


export const initSocket = async (
  email: string,
  user_id: string
): Promise<Socket | null> => {
  try {
    const socket = io(SOCKET_URL, { transports: ["websocket"] });

    console.log("initing");

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      socket.emit("register_user", { email, user_id });
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    socket.on("hello", (msg: string) => {
      Alert.alert("Socket.IO Message", msg);
    });

    // Store in Zustand
    const setSocket = useSocketStore.getState().setSocket;
    setSocket(socket);

    return socket;
  } catch (error) {
    console.error("Socket initialization failed:", error);
    return null;
  }
};

// export const initSocket = (email: string, user_id: string): Socket => {
//   const socket = io(SOCKET_URL, { transports: ["websocket"] });
// console.log('initing')
//   socket.on("connect", () => {
//     console.log("Socket connected:", socket.id);
//     socket.emit("register_user", { email, user_id });
//   });

//   socket.on("disconnect", () => console.log("Socket disconnected"));

//   socket.on("hello", (msg: string) => {
//     Alert.alert("Socket.IO Message", msg);
//   });

//   // Store in Zustand
//   const setSocket = useSocketStore.getState().setSocket;
//   setSocket(socket);
//   //console.log(socket);

//   return socket;
// };
 

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

//GETUSER LOCATION ON DRIVER MARKERS

// export const getDriverLocation = (callback: (msg: string) => void) => {
//   //console.log("receivingHello");
//   const socket = getSocket();
//   socket.on("hello", callback); 
// };
 
//  RIDES SOCKETSSSSSSS

export const sendRideRequest = (ride: Ride, callback?: (response: any) => void) => {
  const socket = getSocket();

  // emit a ride request to the server
  socket.emit("request:ride", ride, (response: any) => {
    // server can respond with ACK
    if (callback) callback(response);
  });
};
export const acceptRideRequest = async (ride: Ride, callback?: (response: any) => void) => {
  const socket = getSocket();

  const response = await fetchAPI("/(api)/ride", { 
    method: "POST",
    body: JSON.stringify(ride)
  });
  const newRide = response?.data

  if(newRide) {
    // emit a ride request to the server
    socket.emit("accept:ride", newRide, (response: any) => {
      // server can respond with ACK
      if (callback) callback(response); 
    });
  }

};
export const sendRiderWaiting = (user_id:string, callback?: (response: any) => void) => {
  const socket = getSocket();

  // emit a ride request to the server
  socket.emit("ride:waiting", user_id, (response: any) => {
    // server can respond with ACK
    if (callback) callback(response); 

   
    
  });
};
export const sendOnRide = (user_id:string, callback?: (response: any) => void) => {
  const socket = getSocket();

  // emit a ride request to the server
  socket.emit("on:ride", user_id, (response: any) => {
    // server can respond with ACK
    if (callback) callback(response); 
   
    
  });
};
export const sendRideCompleted = (user_id:string, callback?: (response: any) => void) => {
  const socket = getSocket();

  // emit a ride request to the server 
  socket.emit("ride:completed", user_id, (response: any) => {
    // server can respond with ACK
    if (callback) callback(response); 

   
    
  });
};

export const rejectRideRequest = (
  user_id: string | number,
  callback?: (response: any) => void
) => {
  const socket = getSocket();
  const clearDestination = useLocationStore.getState().clearDestination;
  const clearRide = useRideStore.getState().clearRide;
  const clearOrigin = useLocationStore.getState().clearOrigin;

  Alert.alert(
    "Cancel Ride",
    "Are you sure you want to cancel this ride?",
    [
      {
        text: "No",
        style: "cancel",
      },
      {
        text: "Yes",
        style: "destructive",
        onPress: () => {
          socket.emit("reject:ride", user_id, (response: any) => {
            callback?.(response);

            clearDestination();
            clearOrigin();
            clearRide();
            router.push("/(root)/(tabs)/home");
          });
        },
      },
    ],
    { cancelable: true }
  );
};

export const rideRequestListener = () => {
  const socket = getSocket();

  // Guard against null socket
  if (!socket) {
    console.warn("Socket not initialized yet");
    return;
  }

  try {
    // Safely remove previous listener
    socket.off?.("ride:requested");

    // Add new listener
    socket.on?.("ride:requested", (ride: any) => {
      const setRide = useRideStore.getState().setRide;
      const setOriginLocation = useLocationStore.getState().setOriginLocation;
      const { setSelectedDriver } = useDriverStore.getState();

      setRide(ride);
      setSelectedDriver(ride?.user_id);

      setOriginLocation({
        latitude: ride?.originLatitude,
        longitude: ride?.originLongitude,
        address: ride?.originAddress,
      });

      router.push("/(root)/book-ride");
    });
  } catch (err) {
    console.error("Error setting ride listener:", err);
  }
};


// export const rideRequestListener = () => {

//   const socket = getSocket();
//   if(socket?.on && socket?.off){
//     const setRide = useRideStore.getState().setRide; // get Zustand setter
//     const setOriginLocation = useLocationStore.getState().setOriginLocation

    
//     // remove previous listener if exists to avoid duplicates
//     socket.off("ride:requested"); 

//     socket.on("ride:requested", (ride: any) => {
//       setRide(ride);
//       const {drivers, setSelectedDriver} = useDriverStore.getState();
//       setSelectedDriver(ride.user_id); 

//       // const matchedUser = drivers.find(
//       //   (driver) => driver.user_id === ride?.user_id
//       // );
//       // if(matchedUser){
//       //   setSelectedDriver(matchedUser);
//       // }
      
//       setSelectedDriver(ride?.user_id);   // user willl be fed on driver datas
//       setOriginLocation({latitude:ride.originLatitude, longitude:ride.originLongitude, address:ride.originAddress})               // update Zustand state
//       router.push("/(root)/book-ride"); // navigate
//     });
//   }
// };

export const rideAcceptedListener = () => {
  const socket = getSocket();
  const setRide = useRideStore.getState().setRide; // Zustand setter


  // remove previous listener to avoid duplicates
  socket.off("ride:accepted");

  socket.on("ride:accepted", (ride: any) => {
    setRide(ride);                 // update global state
    router.push("/(root)/approaching"); // navigate to Approaching page
  });
};

export const onRideListener = () => {
  const socket = getSocket();
  
  const setRide = useRideStore.getState().setRide; // Zustand setter
  const ride = useRideStore.getState().ride;

  // remove previous listener to avoid duplicates
  socket.off("on:ride");

  socket.on("on:ride", () => { 
    if (!ride) return;
    const newRide = {...ride, ride_state:'on-ride'}
    setRide(newRide);                 // update global state
    router.push("/(root)/on-ride"); // navigate to Approaching page
  });
};

export const rideRejectedListener = () => {
  const socket = getSocket();
  const  clearRide  = useRideStore.getState().clearRide; // use clearRide from Zustand
  const clearOrigin = useLocationStore.getState().clearOrigin;
  const clearDestination = useLocationStore.getState().clearDestination;
  const profile = useProfileStore.getState().profile;


  // Remove previous listener to avoid duplicates
  socket.off("ride:rejected");

  socket.on("ride:rejected", () => {
    // Navigate to book-ride first
    if(profile.account_type === 'client'){
      router.push("/(root)/confirm-ride"); //back to riders list
      clearRide();
    }else{
      router.push("/(root)/(tabs)/home"); //back to riders list
      clearRide();
      clearOrigin();
      clearDestination();
    }
 

    // Show alert
    Alert.alert(
      "Errand Rejected",
      "The user cancelled the errand.",
      [{ text: "OK" }]
    );

    // Clear ride using Zustand action
 
   
  });
};
 

export const rideCompletedListener = () => {
  const socket = getSocket();
  
  const setRide = useRideStore.getState().setRide; // Zustand setter
  const ride = useRideStore.getState().ride;

  // remove previous listener to avoid duplicates
  socket.off("ride:completed");

  socket.on("ride:completed", () => { 
    if (!ride) return;
    const newRide = {...ride, ride_state:'completed'}
    setRide(newRide);                 // update global state
    router.push("/(root)/completed"); // navigate to Approaching page
  });
};

//Ride Listener is on map
 