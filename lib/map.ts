import { Driver, MarkerData } from "@/types/type";
import { getVehicleType } from "./utils";

const directionsAPI = process.env.EXPO_PUBLIC_DIRECTIONS_API_KEY;


export const generateMarkersFromData = ({
  data,
  userLatitude,
  userLongitude,
}: {
  data: Driver[];
  userLatitude: number;
  userLongitude: number;
}): MarkerData[] => {
  return data.map((driver) => {
    const latOffset = (Math.random() - 0.5) * 0.01; // Random offset between -0.005 and 0.005
    const lngOffset = (Math.random() - 0.5) * 0.01; // Random offset between -0.005 and 0.005

    return {
      latitude: userLatitude + latOffset,
      longitude: userLongitude + lngOffset,
      title: `${driver.name}`,
      ...driver,
    };
  });
};



// Fetch driver locations from server and build markers
export async function generateDriverMarkers({
  drivers,
  userLatitude,
  userLongitude,
  socket,
}: {
  drivers: Driver[];
  userLatitude: number;
  userLongitude: number;
  socket: any; // socket.io client
}): Promise<MarkerData[]> {
  // Step 1: Ask server for each driver's latest location
  const driverLocations = await Promise.all(
    drivers.map(
      (driver) =>
        new Promise<{ lat: number; lng: number } | null>((resolve) => {
          socket.emit("get:user:location", { userId:driver.user_id }, (location:any) => {
            resolve(location); // could be null if driver hasn't sent location yet
          });
        })
    )
  );

  // Step 2: Build markers
  return drivers.map((driver, index) => {
    const loc = driverLocations[index];

    // fallback: if no location, put near current user with small random offset
    const latitude = loc?.lat ?? userLatitude + (Math.random() - 0.5) * 0.01;
    const longitude = loc?.lng ?? userLongitude + (Math.random() - 0.5) * 0.01;

    return {
      ...driver,
      latitude,
      longitude,
      title: driver.name,
    };
  });
}

export const calculateRegion = ({
  userLatitude,
  userLongitude,
  destinationLatitude,
  destinationLongitude,
}: {
  userLatitude: number | null;
  userLongitude: number | null;
  destinationLatitude?: number | null;
  destinationLongitude?: number | null;
}) => {
  if (!userLatitude || !userLongitude) {
    return {
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
  }

  if (!destinationLatitude || !destinationLongitude) {
    return {
      latitude: userLatitude,
      longitude: userLongitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
  }

  const minLat = Math.min(userLatitude, destinationLatitude);
  const maxLat = Math.max(userLatitude, destinationLatitude);
  const minLng = Math.min(userLongitude, destinationLongitude);
  const maxLng = Math.max(userLongitude, destinationLongitude);

  const latitudeDelta = (maxLat - minLat) * 1.3; // Adding some padding
  const longitudeDelta = (maxLng - minLng) * 1.3; // Adding some padding

  const latitude = (userLatitude + destinationLatitude) / 2;
  const longitude = (userLongitude + destinationLongitude) / 2;

  return {
    latitude,
    longitude,
    latitudeDelta,
    longitudeDelta,
  };
};

export const calculateDriverTimes = async ({
  markers,
  userLatitude,
  userLongitude,
  destinationLatitude,
  destinationLongitude,
  packageWeight,
}: {
  markers: MarkerData[];
  userLatitude: number | null;
  userLongitude: number | null;
  destinationLatitude: number | null;
  destinationLongitude: number | null;
  packageWeight: number | null
}) => {
  if (
    !userLatitude ||
    !userLongitude ||
    !destinationLatitude ||
    !destinationLongitude ||
    !packageWeight
  )
    return;

  try {

    const timesPromises = markers.map(async (marker) => {
      const responseToUser = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${marker.latitude},${marker.longitude}&destination=${userLatitude},${userLongitude}&key=${directionsAPI}`,
      );
      const dataToUser = await responseToUser.json();
      const timeToUser = dataToUser.routes[0].legs[0].duration.value; // Time in seconds

      const responseToDestination = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${userLatitude},${userLongitude}&destination=${destinationLatitude},${destinationLongitude}&key=${directionsAPI}`,
      );
      const dataToDestination = await responseToDestination.json();
      const timeToDestination =
        dataToDestination.routes[0].legs[0].duration.value; // Time in seconds
      
      const vehicleDetails = getVehicleType( marker?.vehicle_type);
      const timeRatio = vehicleDetails?.timeRatio;

     // const totalTime = (timeToUser + timeToDestination)*timeRatio / 60; // Total time in minutes
     const totalTime = (timeToDestination)*timeRatio / 60; 
     const packageWeightNumber = (Number(packageWeight)/ 10) + 1
    
      //const vehicleDetails = getVehicleType( marker?.car_seats);
      const vehicleRate = vehicleDetails?.rate;
      const price = ((totalTime/timeRatio) * (10 + vehicleRate + packageWeightNumber)).toFixed(2); // Calculate price based on time

      return { ...marker, time: totalTime, price };
    });

    return await Promise.all(timesPromises);
  } catch (error) {
    console.error("Error calculating driver times:", error);
  }
};

// lib/geocode.ts
export const reverseGeocode = async (
  latitude: number,
  longitude: number
): Promise<string> => {
  const res = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.EXPO_PUBLIC_DIRECTIONS_API_KEY}`
  );

  const data = await res.json();

  return (
    data?.results?.[0]?.formatted_address ??
    "Pinned location"
  );
};
