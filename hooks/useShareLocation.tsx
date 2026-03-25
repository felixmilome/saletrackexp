import { useEffect, useRef } from "react";
import { useDeviceLocation } from "@/hooks/useDeviceLocation";
import { useSocketStore } from "@/store";
import { useRideStore } from "@/store";

type ShareLocationProps = {
  enabled?: boolean; // toggle (e.g. only during ride)
  eventName?: string; // socket event name
  throttleMs?: number; // limit spam
};

export const useShareLocation = ({
  enabled = true,
  eventName = "location:update",
  throttleMs = 2000,
}: ShareLocationProps = {}) => {
  const { deviceLocation } = useDeviceLocation();
  const { socket } = useSocketStore();
  const {ride} = useRideStore();

  const lastSentRef = useRef<number>(0);

  useEffect(() => {
    //console.log({enabled})
    if (!enabled) return;
    if (!socket) return;
    if (!deviceLocation?.latitude || !deviceLocation?.longitude) return;

    const now = Date.now();

    // ⛔ throttle updates (important!)
    if (now - lastSentRef.current < throttleMs) return;

    lastSentRef.current = now;

    // console.log('sending')
  
        socket.emit("location:update", {
            recepient_id: ride?.client_id, 
            latitude: deviceLocation.latitude, 
            longitude: deviceLocation.longitude,
            heading: deviceLocation.heading || 0,
            //timestamp: now,
        });
    

  }, [
    deviceLocation?.latitude,
    deviceLocation?.longitude,
    deviceLocation?.heading,
    enabled,
    socket,
    ride?.ride_state
  ]);
};