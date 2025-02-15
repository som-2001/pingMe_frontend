// Import Firebase SDKs (Compatibility mode)
importScripts(
  "https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js"
);

self.addEventListener("install", (event) => {
  console.log("🛠 Service Worker installing...");
});

self.addEventListener("activate", (event) => {
  console.log("🚀 Service Worker activated!");
});

// Ensure Firebase is available before accessing it
self.addEventListener("message", (event) => {
  console.log("📩 Service Worker received message:", event);
});

// Initialize Firebase only if it's available
if (self.firebase) {
  self.firebase.initializeApp({
    apiKey: "AIzaSyC7ppf0kKz6Uaz29qgDER7TjTObc_bS5Mk",
    authDomain: "pingme-bf4d5.firebaseapp.com",
    projectId: "pingme-bf4d5",
    storageBucket: "pingme-bf4d5.appspot.com",
    messagingSenderId: "72156534914",
    appId: "1:72156534914:web:fb20fba4495e35c3f07c9b",
  });

  const messaging = self.firebase.messaging();

  // Handle background push notifications
  messaging.onBackgroundMessage((payload) => {
    console.log("📩 Background Notification Received:", payload);

    const notificationTitle = payload.data?.title || "New Notification";
    const notificationOptions = {
      body: payload.data?.body || "You have a new message.",
      icon: "/logo.webp",
      data: {
        url: payload.data?.url || "/",
        username: payload.data?.username || "Unknown",
        profileImg: payload.data?.profileImg || "/default-user.png",
      },
    };

    self.registration.showNotification(notificationTitle, notificationOptions);

    if (payload.notification) {
      // Skip showing any notification
      return;
    }
  });

  self.addEventListener("notificationclick", (event) => {
    console.log("🔔 Notification Clicked:", event.notification.data);

    const url = event.notification.data?.url || "/"; // Default to home if no URL
    event.notification.close();

    event.waitUntil(
      clients
        .matchAll({ type: "window", includeUncontrolled: true })
        .then((clientList) => {
          for (const client of clientList) {
            if (client.url === url && "focus" in client) {
              return client.focus();
            }
          }
          if (clients.openWindow) return clients.openWindow(url);
        })
    );
  });
} else {
  console.error("❌ Firebase SDK failed to load in service worker.");
}
