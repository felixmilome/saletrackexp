// hooks/useAnimatedMarker.ts
import { useRef } from "react";
import { AnimatedRegion } from "react-native-maps";

export function useAnimatedMarker(lat: number, lng: number) {
  const region = useRef(
    new AnimatedRegion({
      latitude: lat,
      longitude: lng,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    })
  ).current;

  const animateTo = (lat: number, lng: number, duration = 1000) => {
    (region as any).timing({
      latitude: lat,
      longitude: lng,
      duration,
      useNativeDriver: false,
    }).start();
  };

  return { region, animateTo };
}
