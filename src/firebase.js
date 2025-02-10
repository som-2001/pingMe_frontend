import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyC7ppf0kKz6Uaz29qgDER7TjTObc_bS5Mk",
  authDomain: "pingme-bf4d5.firebaseapp.com",
  projectId: "pingme-bf4d5",
  storageBucket: "pingme-bf4d5.appspot.com",
  messagingSenderId: "72156534914",
  appId: "1:72156534914:web:fb20fba4495e35c3f07c9b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

let messaging;
if ("serviceWorker" in navigator && "PushManager" in window) {
  messaging = getMessaging(app);
} else {
  console.warn("🚨 Firebase Messaging is not supported on this browser.");
}

export const requestNotificationPermission = async () => {
  if (!messaging) return null;
  try {
    const token = await getToken(messaging, {
      vapidKey:
        "BHWpJTjY9zui56PdnGkYh5qOk28wcYdxH0iipBYK3XzWKF3iCC1n4zhcKJNeZqk5op1CAEr9p164jp2LPNXHHwU",
    });
    console.log("✅ FCM Token:", token);
    return token;
  } catch (error) {
    console.error("❌ Error getting FCM token:", error);
  }
};
