import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider, GithubAuthProvider, FacebookAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBveRDPNHf08fwaUpiIjsA5F0HrFkLPNek",
  authDomain: "arasaka-tis.firebaseapp.com",
  projectId: "arasaka-tis",
  storageBucket: "arasaka-tis.firebasestorage.app",
  messagingSenderId: "102778449227",
  appId: "1:102778449227:web:06d8553359246f619b8cce",
  measurementId: "G-GQTVZ8TZH6"
};

const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
facebookProvider.addScope('public_profile');