// hooks/useUserLocationUpdater.ts
import { useEffect, useRef } from "react";
import * as Location from "expo-location";
import { Socket } from "socket.io-client";

// helper to calculate distance in meters between two coords
function getDistance(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number } 
) {
  const R = 6371e3; // meters
  const φ1 = (a.lat * Math.PI) / 180;
  const φ2 = (b.lat * Math.PI) / 180;
  const Δφ = ((b.lat - a.lat) * Math.PI) / 180;
  const Δλ = ((b.lng - a.lng) * Math.PI) / 180;

  const x =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));

  return R * c; // distance in meters
}

export function useUserLocationUpdater({socket, user_id}: {socket: Socket, user_id: string}) {
  const lastSentLocation = useRef<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    let watcher: Location.LocationSubscription;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission denied for location");
        return;
      }

      watcher = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5 * 60 * 1000, // 5 minutes
          distanceInterval: 200, // only trigger if moved 200m
        },
        (location) => {
          const { latitude, longitude } = location.coords;

          // send only if moved more than 200m from last sent location
          if (
            !lastSentLocation.current ||
            getDistance(lastSentLocation.current, { lat: latitude, lng: longitude }) > 200
          ) {
            socket.emit("user:location:update", {
              user_id,
              lat: latitude,
              lng: longitude, 
              timestamp: Date.now(),
            });

            lastSentLocation.current = { lat: latitude, lng: longitude };
          }
        }
      );
    })();

    return () => {
      watcher?.remove();
    };
  }, [socket, user_id]);
}
