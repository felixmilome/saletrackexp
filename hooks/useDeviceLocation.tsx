import { useEffect, useRef, useState } from "react";
import * as Location from "expo-location";
import { DeviceLocation } from "@/types/type";
import { useDeviceLocationStore } from "@/store";


export const useDeviceLocation = () => {
 // const [deviceLocation, setDeviceLocation] = useState<DeviceLocation | null>(null);
  const {deviceLocation, setDeviceLocation} = useDeviceLocationStore();
  const headingRef = useRef(0);

  useEffect(() => {
    let positionSub: Location.LocationSubscription;
    let headingSub: Location.LocationSubscription;

    const startTracking = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      // 1. Track Position
        positionSub = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, distanceInterval: 1 },
        async (loc) => {  // <-- make callback async
            const address = await Location.reverseGeocodeAsync({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            });

            setDeviceLocation({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
            address:`${address[0].name}, ${address[0].region}`,
            heading:
                loc.coords.heading && loc.coords.heading > 0
                ? loc.coords.heading
                : headingRef.current,
            });
        }
        );

      // 2. Track Compass (Heading)
      headingSub = await Location.watchHeadingAsync((h) => {
        headingRef.current = h.trueHeading; // Or h.magHeading
      });
    };

    startTracking();
    return () => {
      positionSub?.remove();
      headingSub?.remove();
    };
  }, []);

  return { deviceLocation };
};

