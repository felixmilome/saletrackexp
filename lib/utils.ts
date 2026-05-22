import cyclist from "@/assets/icons/cyclist.png";
import lorry from "@/assets/icons/lorry.png";
import messenger from "@/assets/icons/messenger.png";
import mkokoteni from "@/assets/icons/mkokoteni.png";
import motorcycle from "@/assets/icons/motorcycle.png";
import pickup from "@/assets/icons/pickup.png";
import trolley from "@/assets/icons/trolley.png";
import tuktuk from "@/assets/icons/tuktuk.png";
import van from "@/assets/icons/van.png";
import { Ride } from "@/types/type";
import { useProfileStore, useRideStore } from "@/store";
import { Alert } from "react-native";
// import { rejectRideRequest } from "./socket";
import { accountNames, serviceTypes } from "@/constants";


import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "./firebase";

const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_DIRECTIONS_API_KEY;

export const sortRides = (rides: Ride[]): Ride[] => {
  const result = rides.sort((a, b) => {
    const dateA = new Date(`${a.requested_at}T${a.requested_at}`);
    const dateB = new Date(`${b.requested_at}T${b.requested_at}`);
    return dateB.getTime() - dateA.getTime();
  });

  return result.reverse();
};
export function formatTime(minutes: number): string {
  const m = Math.round(minutes);
  if (m < 60) return `${m} min`;

  const h = Math.floor(m / 60);
  const r = m % 60;
  return `${h}h ${r}m`;
}


// export function formatTime(minutes: number): string {
//   const formattedMinutes = +minutes?.toFixed(0) || 0;

//   if (formattedMinutes < 60) {
//     return `${minutes} min`;
//   } else {
//     const hours = Math.floor(formattedMinutes / 60);
//     const remainingMinutes = formattedMinutes % 60;
//     return `${hours}h ${remainingMinutes}m`;
//   }
// }

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDate();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  return `${day < 10 ? "0" + day : day} ${month} ${year}`;
}
export function formatDateTime(dateInput: string | Date): string {
  if (!dateInput) return "";

  const normalized =
    typeof dateInput === "string"
      ? dateInput.replace(" ", "T")
      : dateInput;

  const date = new Date(normalized);

  if (isNaN(date.getTime())) return "";

  const day = date.getDate();
  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];

  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${day < 10 ? "0" + day : day} ${month} ${year}, ${hours}:${minutes}`;
}

// export const getVehicleType = (num: number) => 
//   ["Messenger","Trolley","Mkokoteni","Bicycle","Motorcycle","Tuktuk","Pickup","Van","Lorry"][num] ?? "Unknown";
export const getVehicleType = (num: number) => { 
  const list = [
    { name: "Messenger",  image: motorcycle,  payload: 5,    rate: 2, timeRatio:5 },
    { name: "Trolley",    image: motorcycle,    payload: 30,   rate: 3, timeRatio:5 },
    { name: "Mkokoteni",  image: van,  payload: 200,  rate: 3, timeRatio:5 },
    { name: "Bicycle",    image: van,    payload: 10,   rate: 4, timeRatio:2 },
    { name: "Motorcycle", image: motorcycle, payload: 20,   rate: 8, timeRatio:0.8},
    { name: "Tuktuk",     image: tuktuk,     payload: 100,  rate: 8, timeRatio:1.2},
    { name: "Pickup",     image: pickup,     payload: 500,  rate: 12, timeRatio:1 },
    { name: "Van",        image: van,        payload: 800,  rate: 15, timeRatio:1 },
    { name: "Lorry",      image: lorry,      payload: 3000, rate: 25, timeRatio:1.2 }  
  ]; 

  return list[num] ?? list[0]; // fallback
};

// export const getVehicleType = (num: number) => {
//   const list = [
//     { name: "Messenger",  image: messenger,  payload: 5,    rate: 2, timeRatio:5 },
//     { name: "Trolley",    image: trolley,    payload: 30,   rate: 3, timeRatio:5 },
//     { name: "Mkokoteni",  image: mkokoteni,  payload: 200,  rate: 3, timeRatio:5 },
//     { name: "Bicycle",    image: cyclist,    payload: 10,   rate: 4, timeRatio:2 },
//     { name: "Motorcycle", image: motorcycle, payload: 20,   rate: 8, timeRatio:0.8},
//     { name: "Tuktuk",     image: tuktuk,     payload: 100,  rate: 8, timeRatio:1.2},
//     { name: "Pickup",     image: pickup,     payload: 500,  rate: 12, timeRatio:1 },
//     { name: "Van",        image: van,        payload: 800,  rate: 15, timeRatio:1 },
//     { name: "Lorry",      image: lorry,      payload: 3000, rate: 25, timeRatio:1.2 }  
//   ]; 

//   return list[num] ?? list[0]; // fallback
// };

export function roundToNearestTen(num: number): number {
  return Math.round(num / 10) * 10;
}
export function decimalizeInput(
  text: string,
  max: number = 1000000,
  decimals: number = 2
): number {
  // allow only digits and dot
  let numeric = text.replace(/[^0-9.]/g, "");

  // allow only one dot
  const firstDot = numeric.indexOf(".");
  if (firstDot !== -1) {
    numeric =
      numeric.slice(0, firstDot + 1) +
      numeric.slice(firstDot + 1).replace(/\./g, "");
  }

  // handle leading zeros
  if (/^0+[0-9]/.test(numeric)) {
    numeric = numeric.replace(/^0+/, "");
  }

  // handle dot-first input like ".98"
  if (numeric.startsWith(".")) {
    numeric = "0" + numeric;
  }

  // clamp max
  // if (Number(numeric) > max) {
  //   numeric = max.toString();
  // }

  // round to decimals if valid number
  // if (numeric !== "" numeric !== ".") {
  //   const rounded = Number(numeric).toFixed(decimals);
  //   numeric = rounded.replace(/\.?0+$/, ""); // remove unnecessary trailing zeros
  // }

  return max;
}



export async function uploadImageFromUri(
  uri: string,
  user_id: string,
  key: string,
): Promise<string> {


  const folder = key
  const uriToBlob = async (uri: string): Promise<Blob> => {
    const response = await fetch(uri);
    return await response.blob();
  };

  const blob = await uriToBlob(uri);

  const timestamp = Date.now();
  const filename = `${folder}-${user_id}-${timestamp}.jpg`;

  const imageRef = ref(storage, `${folder}/${filename}`);

  await uploadBytes(imageRef, blob, {
    contentType: "image/jpeg",
  });

  const downloadURL = await getDownloadURL(imageRef);
  console.log(downloadURL);


  return filename;
}

export function imageUrlCombiner(
  folder: string,
  slug?: string | null
): string {
  if (!folder || !slug) return "";

  const baseUrl =
    "https://firebasestorage.googleapis.com/v0/b/ahcamb-7af95.firebasestorage.app/o/";

  const token = "?alt=media&token=c0e2d4e3-11ac-4216-8c22-194f03d5c8a8";

  // Ensure folder ends with /
  const safeFolder: string = folder.endsWith("/") ? folder : `${folder}/`;

  // Firebase requires encoded path (folder%2Ffile)
  const encodedPath: string = encodeURIComponent(safeFolder + slug);

  const finalUrl = `${baseUrl}${encodedPath}${token}`

  return finalUrl;
}



// utils/bearing.ts
// export function calculateBearing(
//   lat1: number,
//   lng1: number,
//   lat2: number,
//   lng2: number
// ) {
//   const toRad = (v: number) => (v * Math.PI) / 180;
//   const toDeg = (v: number) => (v * 180) / Math.PI;

//   const dLng = toRad(lng2 - lng1);

//   const y = Math.sin(dLng) * Math.cos(toRad(lat2));
//   const x =
//     Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
//     Math.sin(toRad(lat1)) *
//       Math.cos(toRad(lat2)) *
//       Math.cos(dLng);

//   return (toDeg(Math.atan2(y, x)) + 360) % 360;
// }

/**
 * Calculate smooth bearing for React Native Maps marker rotation
 * @param lat1 Starting latitude
 * @param lng1 Starting longitude
 * @param lat2 Ending latitude
 * @param lng2 Ending longitude
 * @param prevHeading Previous heading (optional) for smoothing
 * @param alpha Smoothing factor (0–1), default 0.3
 * @returns heading in degrees for RN Maps rotation
 */
export function calculateBearing(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
  prevHeading?: number | null,
  alpha = 0.3
) {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const toDeg = (v: number) => (v * 180) / Math.PI;

  const dLng = toRad(lng2 - lng1);

  const y = Math.sin(dLng) * Math.cos(toRad(lat2));
  const x =
    Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLng);

  // Bearing relative to true north
  let bearing = (toDeg(Math.atan2(y, x)) + 360) % 360;

  // Convert to RN Maps rotation (0° = East)
  bearing = (bearing - 90 + 360) % 360;

  // Smooth heading if previous heading is provided
  if ( prevHeading && prevHeading !== undefined ) {
    // Interpolate shortest path around 360°
    const delta = ((bearing - prevHeading + 540) % 360) - 180;
    bearing = prevHeading + delta * alpha;
    bearing = (bearing + 360) % 360; // ensure 0–360
  }

  return bearing;
}

export const handleCancelRide = (router: any) => {
  // const clearDestination = useLocationStore.getState().clearDestination;
  // const clearOrigin = useLocationStore.getState().clearOrigin;
  // const clearRide = useRideStore.getState().clearRide;
  // const ride = useRideStore.getState().ride;
  // const profile = useProfileStore.getState().profile;

  // Alert.alert(
  //   "Cancel Ride",
  //   "Are you sure you want to cancel this ride?",
  //   [
  //     {
  //       text: "No", // user cancels the alert
  //       style: "cancel",
  //     },
  //     {
  //       text: "Yes", // user confirms cancellation
  //       onPress: () => {
  //         clearDestination();
  //         clearOrigin();
  //         clearRide();
  //         if(ride){

  //           if(profile.type === 'client' ){
  //             rejectRideRequest(ride?.driver_id);
  //           }else{
  //             rejectRideRequest(ride?.user_id);
  //           }

  //         }
         
  //         router.push("/(root)/(tabs)/home");
  //       },
  //       style: "destructive",
  //     },
      
  //   ],
  //   { cancelable: true } // allows tapping outside to dismiss
  // );
};

export const accountNameGetter = (index: number): string => {
  switch (index) {
    case 0:
      return accountNames?.client;
    case 1:
      return accountNames.ambulance;
    case 2:
      return accountNames?.fleet;
    default:
      return "Unknown";
  }
};

export const getServiceByNumber = (num: number): string | null => {
  const serviceKeys = Object.keys(serviceTypes); // inside function
  if (num < 0 || num >= serviceKeys.length) return null;
  const key = serviceKeys[num];
  return serviceTypes[key as keyof typeof serviceTypes];
};
 

// Price CALCULATOR BLOCK ++++++++++++++++++++++++++++++++++++

type LatLng = {
  lat: number
  lng: number
}

type AmbulanceType = 0 | 1 | 2 | 3
// 0 = specimen motorcycle
// 1 = bike ambulance
// 2 = BLS ambulance
// 3 = ACLS ambulance

type CalculatorInput = {
  baseFee: number
  driverLoc: LatLng
  patientLoc: LatLng
  hospitalLoc: LatLng
  type: AmbulanceType
  //apiKey: string // Google Directions API key
}

type CalculatorResult = {
  distanceToPatient: number
  distanceToHospital: number
  timeToPatientMinutes: number
  timeToHospitalMinutes: number
  totalETA: number
  price: number
}

const TYPE_MULTIPLIER: Record<AmbulanceType, number> = {
  0: 0.5,
  1: 0.7,
  2: 1,
  3: 1.8
}

// Optional: you can still use TYPE_SPEED for fallback or reference
const TYPE_SPEED: Record<AmbulanceType, number> = {
  0: 45, // specimen motorcycle
  1: 50, // bike ambulance
  2: 35, // BLS ambulance
  3: 30  // ACLS ambulance
}

const PRICE_PER_KM = 120

// Fetch road distance and duration from Google Directions API
async function getRoadDistanceAndDuration(origin: LatLng, destination: LatLng) {
  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&mode=driving&departure_time=now&key=${GOOGLE_MAPS_API_KEY}`
  
  const res = await fetch(url)
  const data = await res.json()

  if (!data.routes || data.routes.length === 0) {
    throw new Error('No route found')
  }

  const leg = data.routes[0].legs[0]

  return {
    distanceKm: leg.distance.value / 1000,       // meters → km
    durationMinutes: leg.duration_in_traffic 
      ? leg.duration_in_traffic.value / 60       // seconds → minutes
      : leg.duration.value / 60                  // fallback
  }
}

export async function calculateAmbulancePrice(input: CalculatorInput): Promise<CalculatorResult> {
  // Road distances with traffic
  const patientData = await getRoadDistanceAndDuration(input.driverLoc, input.patientLoc)
  const hospitalData = await getRoadDistanceAndDuration(input.patientLoc, input.hospitalLoc)

  const totalDistance = patientData.distanceKm + hospitalData.distanceKm
  const multiplier = TYPE_MULTIPLIER[input.type]
  const price = input.baseFee + totalDistance * PRICE_PER_KM * multiplier

  const timeToPatientMinutes = patientData.durationMinutes
  const timeToHospitalMinutes = hospitalData.durationMinutes

  return {
    distanceToPatient: Number(patientData.distanceKm.toFixed(1)),
    distanceToHospital: Number(hospitalData.distanceKm.toFixed(1)),
    timeToPatientMinutes: Math.round(timeToPatientMinutes),
    timeToHospitalMinutes: Math.round(timeToHospitalMinutes),
    totalETA: Math.round(timeToPatientMinutes + timeToHospitalMinutes),
    price: Math.round(price)
  }
}

export const formatTimestamp = (value: string): string => {
  const date = new Date(value.replace(" ", "T"));

  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export const statusMap: Record<number, { label: string; color: string }> = {
  1: { label: "Pending", color: "text-yellow-600" },
  2: { label: "In Progress", color: "text-blue-600" },
  3: { label: "Completed", color: "text-green-600" },
  4: { label: "Reported", color: "text-orange-600" },
  5: { label: "Cancelled", color: "text-red-600" },
};
