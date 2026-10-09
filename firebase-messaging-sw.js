/* DFCraft Firebase Messaging Service Worker */
importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBQwJ7qB9pYPIAB0Dbes4P2kvikIfuZU64",
  authDomain: "dfcraft-430ed.firebaseapp.com",
  projectId: "dfcraft-430ed",
  storageBucket: "dfcraft-430ed.firebasestorage.app",
  messagingSenderId: "718019451273",
  appId: "1:718019451273:web:5fdd509e229978df3a2958"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  // Jika payload memiliki bagian "notification", Firebase Messaging akan
  // menampilkan notifikasi itu sendiri saat halaman berada di background.
  // Jangan panggil showNotification() lagi agar tidak muncul dua kali.
  if (payload && payload.notification) return;

  // Untuk pesan data-only, Service Worker perlu menampilkan notifikasi sendiri.
  const data = (payload && payload.data) || {};
  const title = data.title || "DFCraft";
  const options = {
    body: data.body || "Ada Add-On atau pembaruan baru di DFCraft.",
    icon: data.icon || "./dfcraft-favicon.png",
    badge: data.badge || "./dfcraft-favicon.png",
    data: { url: data.url || "./" },
    tag: data.tag || "dfcraft-addon"
  };
  self.registration.showNotification(title, options);
});

self.addEventListener("notificationclick", function(event) {
  event.notification.close();
  const target = (event.notification.data && event.notification.data.url) || "./";
  event.waitUntil(
    clients.matchAll({type:"window", includeUncontrolled:true}).then(function(list) {
      for (const client of list) {
        if ("focus" in client) {
          client.navigate(target);
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(target);
    })
  );
});
