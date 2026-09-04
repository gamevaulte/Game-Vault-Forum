import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDsejuhCdPxHosNFAJn6Bc-0d7lr2hLxNQ",
  authDomain: "game-vault-forum.firebaseapp.com",
  projectId: "game-vault-forum",
  storageBucket: "game-vault-forum.firebasestorage.app",
  messagingSenderId: "941979479410",
  appId: "1:941979479410:web:8cf1ddb6bd50532ec381eb",
  measurementId: "G-PGRZVHNV1N"
};

// Initialize Firebase
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Optional Google Analytics initialization with environment check
if (typeof window !== "undefined") {
  isSupported()
    .then((supported) => {
      if (supported) {
        getAnalytics(app);
      }
    })
    .catch(() => {
      // Analytics not supported in sandbox/restricted environments
    });
}
