/* aspira-desa/aspira-desa-frontend/firebase-messaging-sw.js */
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyAmE709Obv4-ri-1TyyNU-1jInY2m0320w",
  authDomain: "aspira-desa.firebaseapp.com",
  projectId: "aspira-desa",
  storageBucket: "aspira-desa.firebasestorage.app",
  messagingSenderId: "757384348848",
  appId: "1:757384348848:web:15d30d40ccea2cbe52a775",
  measurementId: "G-9VN572LC8X"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Notifikasi background:", payload);

  const { title, body } = payload.notification;

  self.registration.showNotification(title, {
    body,
    icon: "/logo.png", // pastikan file ini ada di /public/logo.png
  });
});
