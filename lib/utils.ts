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

import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "./firebase";

export const sortRides = (rides: Ride[]): Ride[] => {
  const result = rides.sort((a, b) => {
    const dateA = new Date(`${a.created_at}T${a.ride_time}`);
    const dateB = new Date(`${b.created_at}T${b.ride_time}`);
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

// export const getVehicleType = (num: number) => 
//   ["Messenger","Trolley","Mkokoteni","Bicycle","Motorcycle","Tuktuk","Pickup","Van","Lorry"][num] ?? "Unknown";

export const getVehicleType = (num: number) => {
  const list = [
    { name: "Messenger",  image: messenger,  payload: 5,    rate: 2, timeRatio:5 },
    { name: "Trolley",    image: trolley,    payload: 30,   rate: 3, timeRatio:5 },
    { name: "Mkokoteni",  image: mkokoteni,  payload: 200,  rate: 3, timeRatio:5 },
    { name: "Bicycle",    image: cyclist,    payload: 10,   rate: 4, timeRatio:2 },
    { name: "Motorcycle", image: motorcycle, payload: 20,   rate: 8, timeRatio:0.8},
    { name: "Tuktuk",     image: tuktuk,     payload: 100,  rate: 8, timeRatio:1.2},
    { name: "Pickup",     image: pickup,     payload: 500,  rate: 12, timeRatio:1 },
    { name: "Van",        image: van,        payload: 800,  rate: 15, timeRatio:1 },
    { name: "Lorry",      image: lorry,      payload: 3000, rate: 25, timeRatio:1.2 }  
  ]; 

  return list[num] ?? list[0]; // fallback
};

export function roundToNearestTen(num: number): number {
  return Math.round(num / 10) * 10;
}
export function decimalizeInput(
  text: string,
  max: number = 1000000,
  decimals: number = 2
): string {
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
  if (Number(numeric) > max) {
    numeric = max.toString();
  }

  // round to decimals if valid number
  // if (numeric !== "" numeric !== ".") {
  //   const rounded = Number(numeric).toFixed(decimals);
  //   numeric = rounded.replace(/\.?0+$/, ""); // remove unnecessary trailing zeros
  // }

  return numeric;
}



export async function uploadImageFromUri(
  uri: string,
  user_id: string,
  key: string,
): Promise<string> {

  console.log(user_id);
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
  console.log({downloadURL});

  return filename;
}

export function imageUrlCombiner(
  folder: string,
  slug?: string | null
): string {
  if (!folder || !slug) return "";

  const baseUrl =
    "https://firebasestorage.googleapis.com/v0/b/zooruraweb.appspot.com/o/";

  const token = "?alt=media&token=cd5eb6ad-2b34-4a1a-937f-5c167a253a9f";

  // Ensure folder ends with /
  const safeFolder: string = folder.endsWith("/") ? folder : `${folder}/`;

  // Firebase requires encoded path (folder%2Ffile)
  const encodedPath: string = encodeURIComponent(safeFolder + slug);

  const finalUrl = `${baseUrl}${encodedPath}${token}`

  return finalUrl;
}

