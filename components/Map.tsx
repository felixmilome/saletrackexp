import React, { useRef, useEffect } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { useDeviceLocation } from "@/hooks/useDeviceLocation";
import { fetchAPI } from "@/lib/fetch";
import { useAmbulanceMarkersStore, useFromLocationStore, useToLocationStore } from "@/store";

const Map = () => {
  const mapRef = useRef<MapView>(null);

  const { deviceLocation } = useDeviceLocation();
  const { ambulances, setAmbulances } = useAmbulanceMarkersStore();
  const {toLocation} = useToLocationStore();
  const {fromLocation} = useFromLocationStore();

  const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_DIRECTIONS_API_KEY

  /**
   * 1️⃣ Fetch drivers once on mount
   * MUST be before any conditional return
   */
  useEffect(() => {
    const getDrivers = async () => {
      try {
        const { data, error } = await fetchAPI("/(api)/driver", {
          method: "GET",
        });

        if (error) {
          console.error("Failed to fetch drivers:", error);
          return;
        }

        setAmbulances(data || []);
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

    getDrivers();
  }, []);

  /**
   * 2️⃣ Animate camera when location updates
   */
  useEffect(() => {
    if (!deviceLocation || !mapRef.current) return;

    mapRef.current.animateCamera(
      {
        center: {
          latitude: deviceLocation.latitude,
          longitude: deviceLocation.longitude,
        },
        heading: deviceLocation.heading || 0,
        pitch: 45,
        zoom: 17,
      },
      { duration: 500 }
    );
  }, [
    deviceLocation?.latitude,
    deviceLocation?.longitude,
    deviceLocation?.heading,
  ]);

  /**
   * 3️⃣ Loader while waiting for device location
   */
  if (!deviceLocation?.latitude || !deviceLocation?.longitude) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <MapView
      ref={mapRef}
      provider={PROVIDER_GOOGLE}
      style={{ width: "100%", height: "100%" }}
      showsUserLocation
      showsMyLocationButton
      followsUserLocation={false}
    >
      {/* 🟢 User Marker */}
      <Marker
        coordinate={{
          latitude: deviceLocation.latitude,
          longitude: deviceLocation.longitude,
        }}
        pinColor="red"
        title="Your Location"
        rotation={deviceLocation.heading || 0}
        anchor={{ x: 0.5, y: 0.5 }}
      />

            
      {fromLocation?.latitude && toLocation?.latitude && (
        <>

        <Marker
        coordinate={{
          latitude: fromLocation.latitude,
          longitude: fromLocation.longitude,
        }}
        pinColor="red"
        title="Your Location"
        //rotation={fromLocation.heading || 0}
        anchor={{ x: 0.5, y: 0.5 }}
      />
      <Marker
        coordinate={{
          latitude: toLocation.latitude,
          longitude: toLocation.longitude,
        }}
        pinColor="red"
        title="Your Location"
       // rotation={deviceLocation.heading || 0}
        anchor={{ x: 0.5, y: 0.5 }}
      />

        // NB::::: HAVE A RESET COURSE BUTTON WHEN SOMEONE GOES OFF COURSE ==================

         <MapViewDirections
              origin={{ latitude: fromLocation.latitude!, longitude: fromLocation.longitude! }}
              destination={{ latitude: toLocation.latitude, longitude: toLocation.longitude}}
              apikey={GOOGLE_MAPS_API_KEY!}
              strokeWidth={3}
              strokeColor="#90EE90"
            />
            </>

      )
      
      }


      {/* 🚑 Ambulance Markers */}
      {ambulances?.map((amb) => {
        const lat =
          amb?.ambulance_data?.current_latitude ?? -1.2921; // Nairobi fallback
        const lng =
          amb?.ambulance_data?.current_longitude ?? 36.8219;

        return (
          <Marker
            key={amb.id}
            coordinate={{ latitude: lat, longitude: lng }}
            title={amb?.name || undefined}
            pinColor="green"
          />
        );
      })}
    </MapView>
  );
};

export default Map;

const styles = StyleSheet.create({
  map: { flex: 1 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
});