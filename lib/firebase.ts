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

            apiKey: "AIzaSyAR_U3loT-Qmc8-bXjBn6d9N22C9avB5ZU",
            authDomain: "zooruraweb.firebaseapp.com",
            projectId: "zooruraweb",
            storageBucket: "zooruraweb.appspot.com",
            messagingSenderId: "210073924030",
            appId: "1:210073924030:web:b036e6fb9763903d2c09ef",
            measurementId: "G-1SXEYXQM0E"
        
      };

  const firebaseApp = initializeApp(firebaseConfig);

  export const storage = getStorage(firebaseApp);