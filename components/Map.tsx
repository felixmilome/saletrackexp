import { useMyAgentsStore } from "@/store";
import React, { useRef, useEffect, useState, useMemo } from "react";
import { View, StyleSheet, ActivityIndicator, Image, TouchableOpacity, Text } from "react-native";
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  Polyline,
} from "react-native-maps";
// import { rideRequestListener, rideAcceptedListener, rideWaitingListener, onRideListener, rideCompleteListener, rideEndListener, pairLocationListener, onMessageListener } from "@/lib/socket";
// import { Ride } from "@/types/type";
// import MapViewDirections from "react-native-maps-directions";
// import { useDeviceLocation } from "@/hooks/useDeviceLocation";
// import { fetchAPI } from "@/lib/fetch";
// import { icons } from "@/constants";
// import {
//   useAmbulanceMarkersStore,
//   useFromLocationStore,
//   useSocketStore,
//   useToLocationStore,
//   useProfileStore,
//   useRideStore,
//   useAmbulanceLocationStore

// } from "@/store";

// import { Ionicons } from '@expo/vector-icons';
// import { Redirect } from "expo-router";
// import ambulanceIcon from "@/assets/icons/ambulance.png"; 
// import { useShareLocation } from "@/hooks/useShareLocation";
// import { useUserLocationUpdater } from "@/hooks/useUserLocationUpdater";
// import ChatModal from "./ChatModal";

// uri
const Map = () => { 
  const mapRef = useRef<MapView>(null);
    const { myAgents, selectedAgentId, setSelectedAgentId} = useMyAgentsStore();

  // const { deviceLocation } = useDeviceLocation();
  // const {ambulanceLocation, setAmbulanceLocation} = useAmbulanceLocationStore();
  // const { ambulances, setAmbulances, selectedAmbulance } = useAmbulanceMarkersStore();
  // const { toLocation } = useToLocationStore();
  // const {socket} = useSocketStore();
  // const { fromLocation } = useFromLocationStore();
  // const {profile, setProfile} = useProfileStore();
  // const {ride} = useRideStore();
  // const [openChat, setOpenChat] = useState(false)

  // const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_DIRECTIONS_API_KEY;

  // const [routeCoords, setRouteCoords] = useState<any[]>([]);
  // const [progressIndex, setProgressIndex] = useState(0);





//  if (!profile?.id) return <Redirect href="/(auth)/sign-in" />;
const validAgents = (myAgents ?? []).filter(
  (agent) =>
    typeof agent.current_latitude === "number" &&
    typeof agent.current_longitude === "number"
);

  return (

    // Let it refresh Markers every 5 mins due to location Changes.
    // Only refresh If USER not onRide(avoid interruption)
    <View className= "relative flex flex-col items-end w-full ">
    <MapView
      ref={mapRef}
      provider={PROVIDER_GOOGLE}
      style={styles.map}
      initialRegion={{
        latitude: -1.286389,
        longitude: 36.817223,
        latitudeDelta: 10,
        longitudeDelta: 10,
      }}
      showsUserLocation
      showsMyLocationButton
      rotateEnabled={true} 
      followsUserLocation={false}
    >
       {Array.isArray(myAgents) && myAgents.length > 0 &&
      myAgents.map((agent) => (
        <Marker
          key={agent.id}
          coordinate={{
            latitude: agent?.current_latitude || 0,
            longitude: agent?.current_longitude || 0,
          }}
          title={agent?.name || "UnknownAgent"}
          onPress={()=>agent?.id &&setSelectedAgentId(agent?.id)}
        />
      ))}
    </MapView>
   
    </View>
  );
};

export default Map;

const styles = StyleSheet.create({
  map: { width: "100%", height: "100%" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  userLocationCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#007AFF', // Standard GPS Blue
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
    // Shadow for depth
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
}); 