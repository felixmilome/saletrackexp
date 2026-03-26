import React, { useRef, useEffect, useState, useMemo } from "react";
import { View, StyleSheet, ActivityIndicator, Image } from "react-native";
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  Polyline,
} from "react-native-maps";
import { rideRequestListener, rideAcceptedListener, rideWaitingListener, onRideListener, rideCompleteListener, rideEndListener, pairLocationListener } from "@/lib/socket";
import { Ride } from "@/types/type";
import MapViewDirections from "react-native-maps-directions";
import { useDeviceLocation } from "@/hooks/useDeviceLocation";
import { fetchAPI } from "@/lib/fetch";
import {
  useAmbulanceMarkersStore,
  useFromLocationStore,
  useSocketStore,
  useToLocationStore,
  useProfileStore,
  useRideStore,
  useAmbulanceLocationStore

} from "@/store";
import { Ionicons } from '@expo/vector-icons';
import { Redirect } from "expo-router";
import ambulanceIcon from "@/assets/icons/ambulance.png"; 
import { useShareLocation } from "@/hooks/useShareLocation";
import { useUserLocationUpdater } from "@/hooks/useUserLocationUpdater";


const Map = () => { 
  const mapRef = useRef<MapView>(null);

  const { deviceLocation } = useDeviceLocation();
  const {ambulanceLocation, setAmbulanceLocation} = useAmbulanceLocationStore();
  const { ambulances, setAmbulances, selectedAmbulance } = useAmbulanceMarkersStore();
  const { toLocation } = useToLocationStore();
  const {socket} = useSocketStore();
  const { fromLocation } = useFromLocationStore();
  const {profile, setProfile} = useProfileStore();
  const {ride} = useRideStore();


  const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_DIRECTIONS_API_KEY;

  const [routeCoords, setRouteCoords] = useState<any[]>([]);
  const [progressIndex, setProgressIndex] = useState(0);

   const ambulanceDetails = ambulances?.filter(
    (ambulance) => ambulance.id === selectedAmbulance,
  )[0]; 



    // ────────────── Hooks ──────────────
  // 1️⃣ Fetch drivers
  useEffect(() => {
    const getDrivers = async () => {
      try {
        const { data, error } = await fetchAPI("/(api)/driver", { method: "GET" });
        if (error) return console.error("Failed to fetch drivers:", error);
        setAmbulances(data || []);
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };
    getDrivers();
  }, [setAmbulances]);

  // useUserLocationUpdater({
  //   socket, user_id:ride?.client_data?.id, 
  //   enabled: (typeof ride?.ride_state === "number" && profile?.account_type ===1)
  // })

  // useEffect (()=>{

  //   if(!socket?.on) return;

  //    socket.on("location:updater", (locData: any) => {
  //       try {
  //         if (
  //           !locData ||
  //           typeof locData.latitude !== "number" ||
  //           typeof locData.longitude !== "number" ||
  //           isNaN(locData.latitude) ||
  //           isNaN(locData.longitude)
  //         ) {
  //           console.log("⚠️ Invalid location:", locData);
  //           return;
  //         }

  //         console.log({locData})


  //         // ✅ ONLY store what UI needs
  //         setAmbulanceLocation({
  //           latitude: locData?.latitude,
  //           longitude: locData?.longitude,
  //           heading: locData?.heading
  //         });

  //       } catch (e) {
  //         console.log("❌ Crash prevented:", e);
  //       }
  //     });

  // },[])

  // 2️⃣ Camera follow
  useEffect(() => {
    if (!deviceLocation || !mapRef.current) return;
    if (profile?.account_type === 0) return;

    mapRef.current.animateCamera(
      {
        center: { latitude: deviceLocation.latitude, longitude: deviceLocation.longitude },
        heading: deviceLocation.heading || 0,
        pitch: 0,
        zoom: 17,
      },
      { duration: 500 }
    );
  }, [deviceLocation?.latitude, deviceLocation?.longitude, deviceLocation?.heading]);

  // 3️⃣ Update route progress
  
  useEffect(() => {
    if (profile?.account_type ===1){
      
      if(!routeCoords.length || !deviceLocation) return;

    let closestIndex = 0;
    let minDistance = Infinity;

    routeCoords.forEach((coord, index) => {
      const distance = Math.sqrt(
        Math.pow(coord.latitude - deviceLocation.latitude, 2) +
        Math.pow(coord.longitude - deviceLocation.longitude, 2)
      );
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    setProgressIndex(closestIndex);
    }else if (profile?.account_type ===0){

       
        if(!routeCoords.length || !ambulanceLocation) return;

        let closestIndex = 0;
        let minDistance = Infinity;

        routeCoords.forEach((coord, index) => {
          const distance = Math.sqrt(
            Math.pow(coord.latitude - ambulanceLocation.latitude, 2) +
            Math.pow(coord.longitude - ambulanceLocation.longitude, 2)
          );
          if (distance < minDistance) {
            minDistance = distance;
            closestIndex = index;
          }
        });

        setProgressIndex(closestIndex);

    }
  }, [deviceLocation, ambulanceLocation, routeCoords]);

  // 4️⃣ Memoized route
  const completedRoute = useMemo(() => routeCoords.slice(0, progressIndex + 1), [routeCoords, progressIndex]);

  // 5️⃣ Socket listeners reload map for best result local
  useEffect(() => {
    //console.log('listeners mounted')
    rideRequestListener();
    rideAcceptedListener(); 
    rideWaitingListener();
    onRideListener();
    rideCompleteListener();
    rideEndListener(); 
    pairLocationListener();
 
  }, [ride]);
  

  useShareLocation({  
      enabled: Boolean(
        profile?.account_type === 1 
        &&ride?.ride_state !== null 
     
      ), 
      eventName: "driver-location-update",
      throttleMs: 1500,
  });


  // ────────────── Conditional rendering ──────────────
  if (!deviceLocation?.latitude || !deviceLocation?.longitude) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    ); 
  }

 if (!profile?.id) return <Redirect href="/(auth)/sign-in" />;

  return (

    // Let it refresh Markers every 5 mins due to location Changes.
    // Only refresh If USER not onRide(avoid interruption)

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
      rotateEnabled={profile?.account===1} 
      followsUserLocation={false}
    >
      {/* Local Rider Marker */}
      {profile?.account_type ==1 &&
      <Marker
        coordinate={{
          latitude: deviceLocation.latitude,
          longitude: deviceLocation.longitude,
        }}
        pinColor="red"
        title="Your Location"
        // rotation={deviceLocation.heading || 0}
        anchor={{ x: 0.5, y: 0.5 }}
      >
       <>
            <Image
              source={ambulanceIcon}
              style={{ width: 40, height: 40 }}
              resizeMode="contain"
            />
            </>
        </Marker>
    }
    {/* requested ambulance marker */}
     {profile?.account_type ===0 
     && ambulanceLocation?.latitude 
     && ambulanceLocation?.longitude &&
      <Marker
        coordinate={{
          latitude: ambulanceLocation.latitude,
          longitude: ambulanceLocation.longitude,
        }}
        pinColor="red"
        title="Your Location"
        rotation={ambulanceLocation.heading || 0}
        anchor={{ x: 0.5, y: 0.5 }}
      >
       <>
            <Image
              source={ambulanceIcon}
              style={{ width: 40, height: 40 }}
              resizeMode="contain"
            />
            </>
        </Marker>
    } 
      
      
       {/* <Marker
          coordinate={{
            latitude: deviceLocation.latitude,
            longitude: deviceLocation.longitude,
          }}
          title="Your Location"
          // Keep the anchor at 0.5 to rotate around the center of the circle
          anchor={{ x: 0.5, y: 0.5 }}
          We apply rotation to the Marker itself so the whole "compass" turns
          // rotation={deviceLocation.heading || 0}
          // This helps with performance on Android when using custom views
          tracksViewChanges={true}
        >
          <View style={styles.userLocationCircle}>
            <Ionicons 
              name="navigate" 
              size={20} 
              color="white" 
              style={{ 
                // Some icons are tilted 45deg by default; adjust if needed
                transform: [
                  { rotate: '70deg' }, 
                  { translateY: -1 }
                ]
              }} 
            />
          </View>
        </Marker> */}

      {fromLocation?.latitude && toLocation?.latitude && (
        <>
          {/* FROM */}
          <Marker
            coordinate={{
              latitude: fromLocation.latitude,
              longitude: fromLocation.longitude,
            }}
            pinColor="green"
            title="Start"
          />

          {/* DESTINATION */}
          <Marker
            coordinate={{
              latitude: toLocation.latitude,
              longitude: toLocation.longitude,
            }}
            pinColor="green"
            title="Destination"
          />
           {/* Directions of */}
          { !ambulanceDetails?.current_latitude &&
           fromLocation?.latitude != null &&
              fromLocation?.longitude != null &&
              toLocation?.latitude != null &&
              toLocation?.longitude != null && 
               <MapViewDirections
            origin={{
              latitude: fromLocation.latitude,
              longitude: fromLocation.longitude,
            }}
            destination={{
              latitude: toLocation.latitude,
              longitude: toLocation.longitude,
            }}
            apikey={GOOGLE_MAPS_API_KEY!}
            strokeWidth={3}
            strokeColor="blue"
            onReady={(result) => {
              setRouteCoords(result.coordinates);
            }}
            onError={(errorMessage) => {
              console.log("Directions error: ", errorMessage);
            }}
          /> }

         {ambulanceDetails?.current_latitude != null &&
              ambulanceDetails?.current_longitude != null &&
              fromLocation?.latitude != null &&
              fromLocation?.longitude != null &&
              toLocation?.latitude != null &&
              toLocation?.longitude != null && (
                <>
                <MapViewDirections
                  origin={{
                    latitude: ambulanceDetails?.current_latitude,
                    longitude: ambulanceDetails?.current_longitude,
                  }}
                  waypoints={[{
                    latitude: fromLocation?.latitude,
                    longitude: fromLocation?.longitude,
                  }]}
                  destination={{
                    latitude: toLocation?.latitude,
                    longitude: toLocation?.longitude,
                  }}
                  apikey={GOOGLE_MAPS_API_KEY!}
                  strokeWidth={3}
                  onReady={(result) => setRouteCoords(result.coordinates)}
                  onError={(err) => console.log(err)}
                />

          {/* FULL ROUTE (GREEN) - Lower Z-Index */}
          <Polyline
            coordinates={routeCoords}
            strokeWidth={6}
            strokeColor="#89F336"
            lineJoin="round"
            lineCap="round"
            zIndex={1}
          />

          {/* COMPLETED ROUTE (GREY) - Higher Z-Index ensures visibility */}
          {completedRoute.length > 0 && (
            <Polyline
              coordinates={completedRoute}
              strokeWidth={7} 
              strokeColor="grey"
              lineJoin="round"
              lineCap="round"
              zIndex={5} 
            />
          )}
          </>

                
              )}
              

          {/* Direction of drive to patient*/}
          {/* <MapViewDirections
            origin={{
              latitude: ambulanceDetails?.current_latitiude,
              longitude: ambulanceDetails?.current_longitude,
            }}
            destination={{
              latitude: fromLocation.latitude,
              longitude: fromLocation.longitude,
            }}
            apikey={GOOGLE_MAPS_API_KEY!}
            strokeWidth={1}
            onReady={(result) => {
              setRouteCoords(result.coordinates);
            }}
            onError={(errorMessage) => {
              console.log("Directions error: ", errorMessage);
            }}
          /> */}

        
        </>
      )}

      {/* Ambulances */}
      {typeof ride?.ride_state !== "number"  && ambulances?.map((amb) => {
        const lat = amb?.ambulance_data?.current_latitude ?? -1.2921;
        const lng = amb?.ambulance_data?.current_longitude ?? 36.8219;

        return (
          <Marker
          key={amb.id}
          coordinate={{
            latitude: lat,
            longitude: lng,
          }}
          title={amb?.name || "Ambulance"}
          >
            <>
            <Image
              source={ambulanceIcon}
              style={{ width: 40, height: 40 }}
              resizeMode="contain"
            />
            </>
          </Marker>
        );
      })}
    </MapView>
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