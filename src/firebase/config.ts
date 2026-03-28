// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBveRDPNHf08fwaUpiIjsA5F0HrFkLPNek",
  authDomain: "arasaka-tis.firebaseapp.com",
  projectId: "arasaka-tis",
  storageBucket: "arasaka-tis.firebasestorage.app",
  messagingSenderId: "102778449227",
  appId: "1:102778449227:web:06d8553359246f619b8cce",
  measurementId: "G-GQTVZ8TZH6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const storage = getStorage(app);