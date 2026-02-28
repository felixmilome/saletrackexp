const { initializeApp } = require("firebase/app");
const { getStorage } = require("firebase/storage");
// const dotenv = require("dotenv");
// dotenv.config();


// const firebaseConfig = {

//     apiKey: process.env.FRBS_API_KEY,
//     authDomain: process.env.FRBS_AUTH_DOMAIN,
//     projectId: process.env.FRBS_PROJECT_ID,
//     storageBucket: process.env.FRBS_STORAGE_BUCKET,
//     messagingSenderId: process.env.FRBS_MESSAGING_SENDER_ID,
//     appId: process.env.FRBS_APP_ID,
//     measurementId: process.env.FRBS_MEASUREMENT_ID

// };

const firebaseConfig = {
  apiKey: "AIzaSyDyqFYGcqJLuOrUalvutvOSs3VoIukY6VA",
  authDomain: "ahcamb-7af95.firebaseapp.com",
  projectId: "ahcamb-7af95",
  storageBucket: "ahcamb-7af95.firebasestorage.app",
  messagingSenderId: "900096986382",
  appId: "1:900096986382:web:2e10fef8d36d886ba2db5f",
  measurementId: "G-V0B6V6PKW5"
};

  const firebaseApp = initializeApp(firebaseConfig);

  export const storage = getStorage(firebaseApp);