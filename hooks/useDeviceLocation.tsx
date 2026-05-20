import { useEffect, useRef } from "react";
import * as Location from "expo-location";
import { useDeviceLocationStore, useFromLocationStore } from "@/store";
import { fetchAPI } from "@/lib/fetch";
import { useProfileStore } from "@/store";

console

function getDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3;
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;

  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function useLiveDeviceLocation() {
  const { setDeviceLocation } = useDeviceLocationStore();
  const { setFromLocation } = useFromLocationStore();
  const { profile } = useProfileStore();

  const watchRef = useRef<Location.LocationSubscription | null>(null);
  const lastRef = useRef<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    if (!profile?.id) return;

    let mounted = true;

    // reset on profile change
    lastRef.current = null;
    watchRef.current?.remove();

    const sync = async (lat: number, lon: number, address: string) => {
      try {
        const res = await fetchAPI("/(api)/user/edit-profile", {
          method: "PATCH",
          body: JSON.stringify({
            id: profile.id,
            table: "users",
            data: {
              current_latitude: lat,
              current_longitude: lon,
              current_address: address,
            },
          }),
        });
        console.log("sync result", res);
      } catch (e) {
        console.log("sync error", e);
      }
    };

    const start = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      watchRef.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 5,
          timeInterval: 5000,
        },
        async (loc) => {
          if (!mounted) return;

          const lat = loc.coords.latitude;
          const lon = loc.coords.longitude;

          const geo = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lon });

          const address = geo?.[0]
            ? `${geo[0].name ?? ""}, ${geo[0].region ?? ""}`
            : "";

          const last = lastRef.current;

          // FIRST RUN
          if (!last) {
            lastRef.current = { latitude: lat, longitude: lon };

            setDeviceLocation({
              latitude: lat,
              longitude: lon,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
              heading: loc.coords.heading ?? 0,
              address,
            });

            setFromLocation({ latitude: lat, longitude: lon, address });

            await sync(lat, lon, address);
            return;
          }

          // DISTANCE CHECK
          const distance = getDistanceMeters(last.latitude, last.longitude, lat, lon);

          if (distance < 50) return;

          lastRef.current = { latitude: lat, longitude: lon };

          setDeviceLocation({
            latitude: lat,
            longitude: lon,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
            heading: loc.coords.heading ?? 0,
            address,
          });

          setFromLocation({ latitude: lat, longitude: lon, address });

          await sync(lat, lon, address);
        }
      );
    };

    start();

    return () => {
      mounted = false;
      watchRef.current?.remove();
      watchRef.current = null;
    };
  }, [profile?.id]);
}