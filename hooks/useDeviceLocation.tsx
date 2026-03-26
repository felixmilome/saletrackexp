
import { useEffect, useRef } from "react";
import * as Location from "expo-location";
import { useDeviceLocationStore, useProfileStore } from "@/store";
import { DeviceLocation } from "@/types/type";

export const useDeviceLocation = () => {
  const { deviceLocation, setDeviceLocation } = useDeviceLocationStore();
  const { profile } = useProfileStore();
  const headingRef = useRef(0);

  useEffect(() => {
    let positionSub: Location.LocationSubscription;
    let headingSub: Location.LocationSubscription;

    const startTracking = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.warn("Location permission not granted");
        return;
      }

      // 1️⃣ Track Position
      positionSub = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, distanceInterval: 1 },
        async (loc) => {
          let addressStr = "";
          try {
            const address = await Location.reverseGeocodeAsync({
              latitude: loc.coords.latitude,
              longitude: loc.coords.longitude,
            });
            if (address && address.length > 0) {
              addressStr = `${address[0].name ?? ""}, ${address[0].region ?? ""}`;
            }
          } catch (err) {
            console.warn("Reverse geocode failed:", err);
          }

          setDeviceLocation({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
            address: addressStr,
            heading:
              loc.coords.heading && loc.coords.heading > 0
                ? loc.coords.heading
                : headingRef.current,
          });
        }
      );

      // 2️⃣ Track Compass (Heading)
      headingSub = await Location.watchHeadingAsync((h) => {
        headingRef.current = h.trueHeading; // fallback to compass
      });

          //Update after a while
      
        // const res = await fetchAPI("/(api)/location/update", { 
        //     method: "POST",
        //     body: JSON.stringify({user_id:profile?.id, deviceLocation }),
        // });

      //  console.log("Loc updated")
    };

    startTracking();

    return () => {
      positionSub?.remove();
      headingSub?.remove();
    };
  }, []);

  return { deviceLocation };
};

