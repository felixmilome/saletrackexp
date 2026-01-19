import { usePathname } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";

import { icons } from "@/constants";
import { useFetch } from "@/lib/fetch";
import {
  calculateDriverTimes,
  calculateRegion,
  generateMarkersFromData,
  reverseGeocode
} from "@/lib/map";
import {
  useDriverStore,
  useLocationStore,
  usePackageStore,
  useProfileStore
} from "@/store";
import { Driver, MarkerData } from "@/types/type";

const directionsAPI = process.env.EXPO_PUBLIC_DIRECTIONS_API_KEY;

const Map = () => {
  const {
    userLatitude,
    userLongitude,
    destinationLatitude,
    destinationLongitude,
    setUserLocation,
    setDestinationLocation,
  } = useLocationStore();

  const { packageWeight } = usePackageStore();
  const { selectedDriver, setDrivers } = useDriverStore();
  const { profile, setProfile } = useProfileStore();

  const { data: drivers, loading, error } =
    useFetch<Driver[]>("/(api)/driver");

  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const mapRef = useRef<MapView>(null);
  const pathname = usePathname();

  console.log(profile?.account_type)

  /* ------------------ DRIVER MARKERS ------------------ */
  useEffect(() => {
    if (!Array.isArray(drivers)) return;
    if (!userLatitude || !userLongitude) return;

    const newMarkers = generateMarkersFromData({
      data: drivers,
      userLatitude,
      userLongitude,
    });

    setMarkers(newMarkers);
  }, [drivers, userLatitude, userLongitude]);

  /* ------------------ DRIVER ETA CALC ------------------ */
  useEffect(() => {
    if (
      markers.length > 0 &&
      destinationLatitude &&
      destinationLongitude
    ) {
      calculateDriverTimes({
        markers,
        userLatitude,
        userLongitude,
        destinationLatitude,
        destinationLongitude,
        packageWeight,
      }).then((updatedDrivers) => {
        setDrivers(updatedDrivers as MarkerData[]);
      });
    }
  }, [markers, destinationLatitude, destinationLongitude]);

  /* ------------------ FIT MAP TO PICKUP + DEST ------------------ */
  const fitMapToMarkers = () => {
    if (userLatitude && userLongitude && destinationLatitude && destinationLongitude) {
      mapRef.current?.fitToCoordinates(
        [
          { latitude: userLatitude, longitude: userLongitude },
          { latitude: destinationLatitude, longitude: destinationLongitude },
        ],
        {
          edgePadding: { top: 120, right: 50, bottom: 120, left: 50 },
          animated: true,
        }
      );
    }
  };

  useEffect(() => {
    fitMapToMarkers();
  }, [userLatitude, userLongitude, destinationLatitude, destinationLongitude, pathname]);

  /* ------------------ MAP REGION ------------------ */
  const region = calculateRegion({
    userLatitude,
    userLongitude,
    destinationLatitude,
    destinationLongitude,
  });

  /* ------------------ EARLY RETURN ------------------ */
  if (loading || (!userLatitude && !userLongitude)) {
    return (
      <View className="flex items-center justify-center w-full">
        <ActivityIndicator size="small" color="#000" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex items-center justify-center w-full">
        <Text>Error: {error}</Text>
      </View>
    );
  }

  /* ------------------ RENDER MAP ------------------ */
  return (
    <View style={{ flex: 1 }}>
       
      <MapView
        provider={PROVIDER_GOOGLE}
        style={{ width: "100%", height: "100%" }}
        initialRegion={region}
        showsPointsOfInterest={false}
        ref={mapRef}
        showsUserLocation={true}
        userInterfaceStyle="light"
      >
        {/* Pickup Marker */}
        {userLatitude && userLongitude && (
          <Marker
            coordinate={{ latitude: userLatitude, longitude: userLongitude }}
            draggable
            title="Pickup location"
            image={icons.pin}
            onDragEnd={async (e) => {
              const { latitude, longitude } = e.nativeEvent.coordinate;
              const address = await reverseGeocode(latitude, longitude);
              setUserLocation({ latitude, longitude, address });
              fitMapToMarkers(); // recenter when dragged
            }}
          />
        )}

        {/* Driver Markers */}
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
            title={marker.title}
            image={
              profile?.account_type === "client" ?
              (selectedDriver === +marker.id ? icons.selectedMarker: icons.marker )
            : (selectedDriver === +marker.id ? icons.selectedMarker: icons.person )

            }
          />
        ))}

        {/* Destination Marker */}
        {destinationLatitude && destinationLongitude && (
          <>
            <Marker
              coordinate={{ latitude: destinationLatitude, longitude: destinationLongitude }}
              draggable
              title="Destination"
              image={icons.point}
              onDragEnd={async (e) => {
                const { latitude, longitude } = e.nativeEvent.coordinate;
                const address = await reverseGeocode(latitude, longitude);
                setDestinationLocation({ latitude, longitude, address });
                fitMapToMarkers(); // recenter when dragged
              }}
            />

            <MapViewDirections
              origin={{ latitude: userLatitude!, longitude: userLongitude! }}
              destination={{ latitude: destinationLatitude, longitude: destinationLongitude }}
              apikey={directionsAPI!}
              strokeWidth={3}
              strokeColor="#0286FF"
            />
          </>
        )}
      </MapView>
    </View>
  );
};

export default Map;
