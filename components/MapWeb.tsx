import React, { useRef, useEffect } from "react";
import { View } from "react-native";
import { WebView } from "react-native-webview";

import { Driver, MarkerData } from "@/types/type";

interface MapProps {
  userLatitude: number;
  userLongitude: number;
  destinationLatitude?: number;
  destinationLongitude?: number;
  markers?: MarkerData[];
}

const directionsAPI = process.env.EXPO_PUBLIC_DIRECTIONS_API_KEY;

const MapWeb: React.FC<MapProps> = ({
  userLatitude,
  userLongitude,
  destinationLatitude,
  destinationLongitude,
  markers,
}) => {
  const webRef = useRef<WebView>(null);

  // Send markers & destination to WebView whenever they change
  useEffect(() => {
    if (webRef.current) {
      webRef.current.postMessage(
        JSON.stringify({ markers, destination: { lat: destinationLatitude, lng: destinationLongitude } })
      );
    }
  }, [markers, destinationLatitude, destinationLongitude]);

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>html, body, #map { height: 100%; margin: 0; padding: 0; }</style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          let map;
          let driverMarkers = [];
          let destinationMarker = null;
          let directionsService;
          let directionsRenderer;

          function initMap() {
            map = new google.maps.Map(document.getElementById("map"), {
              center: { lat: ${userLatitude}, lng: ${userLongitude} },
              zoom: 15,
            });

            // User location marker
            new google.maps.Marker({
              position: { lat: ${userLatitude}, lng: ${userLongitude} },
              map: map,
              title: "You",
              icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
            });

            directionsService = new google.maps.DirectionsService();
            directionsRenderer = new google.maps.DirectionsRenderer({ map: map });
          }

          function updateMap(data) {
            // Clear previous markers
            driverMarkers.forEach(m => m.setMap(null));
            driverMarkers = [];

            // Add driver markers
            if (data.markers) {
              data.markers.forEach(marker => {
                const m = new google.maps.Marker({
                  position: { lat: marker.latitude, lng: marker.longitude },
                  map: map,
                  title: marker.title
                });
                driverMarkers.push(m);
              });
            }

            // Add destination marker
            if (destinationMarker) destinationMarker.setMap(null);
            if (data.destination && data.destination.lat && data.destination.lng) {
              destinationMarker = new google.maps.Marker({
                position: { lat: data.destination.lat, lng: data.destination.lng },
                map: map,
                title: "Destination",
                icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
              });

              // Draw route
              directionsService.route(
                {
                  origin: { lat: ${userLatitude}, lng: ${userLongitude} },
                  destination: { lat: data.destination.lat, lng: data.destination.lng },
                  travelMode: 'DRIVING'
                },
                (result, status) => {
                  if (status === 'OK') {
                    directionsRenderer.setDirections(result);
                  }
                }
              );
            }
          }

          window.addEventListener('message', event => {
            const data = JSON.parse(event.data);
            updateMap(data);
          });
        </script>
        <script src="https://maps.googleapis.com/maps/api/js?key=${directionsAPI}&callback=initMap" async defer></script>
      </body>
    </html>
  `;

  return (
    <View style={{ flex: 1 }}>
      <WebView
        ref={webRef}
        originWhitelist={['*']}
        source={{ html }}
        style={{ flex: 1 }}
        javaScriptEnabled
        domStorageEnabled
      />
    </View>
  );
};

export default MapWeb;
