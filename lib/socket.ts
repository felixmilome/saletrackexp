// socket.ts
// socket.ts 
import { io, Socket } from "socket.io-client";
import { useSocketStore, useFromLocationStore, useToLocationStore, useRideStore, useProfileStore, useAmbulanceMarkersStore } from "@/store";
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
  const clearDestination = useFromLocationStore.getState().clearFromLocation;
  const clearRide = useRideStore.getState().clearRide;
  const clearFromLocation = useFromLocationStore.getState().clearFromLocation;

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
            clearFromLocation();
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
    socket.on?.("ride:requested", (ride: Ride) => {
      const setRide = useRideStore.getState().setRide;
      const setFromLocation = useFromLocationStore.getState().setFromLocation;
      const setToLocation = useToLocationStore.getState().setToLocation;
      const { setSelectedAmbulance } = useAmbulanceMarkersStore.getState();

      
      if( ride && ride?.driver_data?.id &&
        ride?.origin_latitude && ride?.origin_longitude && ride?.origin_address
       && ride?.destination_latitude && ride?.destination_longitude && ride?.destination_address
      ){
      setRide(ride);
      setSelectedAmbulance(ride?.driver_data?.id);
      
      setFromLocation({
        latitude: ride?.origin_latitude,
        longitude: ride?.origin_longitude,
        address: ride?.origin_address,
      });
      setToLocation({
        latitude: ride?.destination_latitude,
        longitude: ride?.destination_longitude,
        address: ride?.destination_address,
      });
    }

      router.push("/(root)/confirm-ride");
    });
  } catch (err) {
    console.error("Error setting ride listener:", err);
  }
};


// export const rideRequestListener = () => {

//   const socket = getSocket();
//   if(socket?.on && socket?.off){
//     const setRide = useRideStore.getState().setRide; // get Zustand setter
//     const setFromLocation = useFromLocationStore.getState().setFromLocation

    
//     // remove previous listener if exists to avoid duplicates
//     socket.off("ride:requested"); 

//     socket.on("ride:requested", (ride: Ride) => {
//       setRide(ride);
//       const {drivers, setSelectedAmbulance} = useAmbulanceMarkersStore.getState();
//       setSelectedAmbulance(ride?.driver_data?.id); 

//       // const matchedUser = drivers.find(
//       //   (driver) => driver.user_id === ride?.user_id
//       // );
//       // if(matchedUser){
//       //   setSelectedAmbulance(matchedUser);
//       // }
      
//       //setSelectedAmbulance(ride?.user_id);   // user willl be fed on driver datas
//       setFromLocation({latitude:ride?.origin_latitude, longitude:ride?.origin_longitude, address:ride?.origin_address})               // update Zustand state
//       router.push("/(root)/confirm-ride"); // navigate
//     });
//   }
//};

export const rideAcceptedListener = () => {
  const socket = getSocket();
  const setRide = useRideStore.getState().setRide; // Zustand setter


  // remove previous listener to avoid duplicates
  socket.off("ride:accepted");

  socket.on("ride:accepted", (ride:Ride
  ) => {
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
    const newRide = {...ride, ride_state:1}
    setRide(newRide);                 // update global state
    router.push("/(root)/on-ride"); // navigate to Approaching page
  });
};

// export const rideRejectedListener = () => {
//   const socket = getSocket();
//   const  clearRide  = useRideStore.getState().clearRide; // use clearRide from Zustand
//   const clearFromLocation = useLocationStore.getState().clearFromLocation;
//   const clearDestination = useLocationStore.getState().clearDestination;
//   const profile = useProfileStore.getState().profile;


//   // Remove previous listener to avoid duplicates
//   socket.off("ride:rejected");

//   socket.on("ride:rejected", () => {
//     // Navigate to book-ride first
//     if(profile.account_type === 'client'){
//       router.push("/(root)/confirm-ride"); //back to riders list
//       clearRide();
//     }else{
//       router.push("/(root)/(tabs)/home"); //back to riders list
//       clearRide();
//       clearFromLocation();
//       clearDestination();
//     }
 

//     // Show alert
//     Alert.alert(
//       "Errand Rejected",
//       "The user cancelled the errand.",
//       [{ text: "OK" }]
//     );

//     // Clear ride using Zustand action
 
   
//   });
// };
 

export const rideCompletedListener = () => {
  const socket = getSocket();
  
  const setRide = useRideStore.getState().setRide; // Zustand setter
  const ride = useRideStore.getState().ride;

  // remove previous listener to avoid duplicates
  socket.off("ride:completed");

  socket.on("ride:completed", () => { 
    if (!ride) return;
    const newRide = {...ride, ride_state:4}
    setRide(newRide);                 // update global state
    router.push("/(root)/completed"); // navigate to Approaching page
  });
};

//Ride Listener is on map
 