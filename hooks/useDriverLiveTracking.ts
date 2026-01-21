// hooks/useDriverLiveTracking.ts
import * as Location from "expo-location";
import { useEffect, useRef } from "react";
import { calculateBearing } from "@/lib/utils";

const USE_FAKE_LOCATIONS = false;
const fakePath = [
  { lat: -1.2921, lng: 36.8219 },
  { lat: -1.2925, lng: 36.8225 },
  { lat: -1.2930, lng: 36.8230 },
  { lat: -1.2935, lng: 36.8235 },
];


export function useDriverLiveTracking({
  driverId,
  animateTo,
  socket,
  email,
  setHeading,

}: {
  driverId: string;
  animateTo: (lat: number, lng: number, duration?: number) => void;
  socket: any;
  email: string;
  setHeading: (heading: number) => void;
}) {
  const prev = useRef<{ lat: number; lng: number } | null>(null);
  const lastTs = useRef<number>(Date.now());
  const index = useRef<number>(0);

  useEffect(() => {
    let sub: Location.LocationSubscription;
    let interval: ReturnType<typeof setInterval>; // ✅ safe type

    if (USE_FAKE_LOCATIONS) {
      interval = setInterval(() => {
        const loc = fakePath[index.current % fakePath.length];
        const now = Date.now();
        const duration = Math.min(1200, now - lastTs.current);
        lastTs.current = now;

       // animateTo(loc.lat, loc.lng, duration);

        let finalHeading = 0;
        if (prev.current) {
          finalHeading = calculateBearing(
            prev.current.lat,
            prev.current.lng,
            loc.lat,
            loc.lng,
        
          );
        }
        prev.current = { lat: loc.lat, lng: loc.lng };
        setHeading(finalHeading);

        socket.emit("driverLocation", {
          email,
          data: {
            driverId,
            lat: loc.lat,
            lng: loc.lng,
            heading: finalHeading,
            speed: 5,
            ts: now,
          },
        });

        index.current += 1;
      }, 1500);
    } else {
      (async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") return;

        sub = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.BestForNavigation,
            distanceInterval: 5,
          },
          (loc) => {
            const { latitude, longitude, heading, speed } = loc.coords;
            const now = Date.now();
            const duration = Math.min(1200, now - lastTs.current);
            lastTs.current = now;

            animateTo(latitude, longitude, duration);

            let finalHeading = heading ?? 0;
            if (prev.current) {
              finalHeading = calculateBearing(
                prev.current.lat,
                prev.current.lng,
                latitude,
                longitude,
                heading
              );
            }
            prev.current = { lat: latitude, lng: longitude };

            console.log(finalHeading)

            setHeading(finalHeading);


            //console.log(socket);

            if (socket?.emit){

            socket.emit("driverLocation", {
              email,
              data: {
                driverId,
                lat: latitude,
                lng: longitude,
                heading: finalHeading,
                speed: speed ?? 0,
                ts: now,
              },
            });
          }
          }
        );
      })();
    }

    return () => {
      sub?.remove?.();
      clearInterval(interval); // ✅ works with ReturnType<typeof setInterval>
    };
  }, []);
}
