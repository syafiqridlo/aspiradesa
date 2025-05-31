//frontend/src/firebase.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Konfigurasi Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAmE709Obv4-ri-1TyyNU-1jInY2m0320w",
  authDomain: "aspira-desa.firebaseapp.com",
  projectId: "aspira-desa",
  storageBucket: "aspira-desa.firebasestorage.app",
  messagingSenderId: "757384348848",
  appId: "1:757384348848:web:15d30d40ccea2cbe52a775",
  measurementId: "G-9VN572LC8X",
};

// Inisialisasi Firebase
const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

/**
 * Langganan notifikasi FCM (harus dipanggil sekali)
 * @param {(payload: import("firebase/messaging").MessagePayload) => void} onForegroundMessage
 */
export const subscribeToNotifications = async (onForegroundMessage) => {
  console.log("🔔 Memulai langganan notifikasi...");

  try {
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.warn("❌ Izin notifikasi ditolak");
      return null;
    }

    console.log("✅ Izin notifikasi diberikan");

    // Ambil token
    const token = await getToken(messaging, {
      vapidKey: "BC7Rq5Fsvv0MhBItIhgH46kqat9aFMnBm7EiPEYrGQ5BqVKY-RhFlTIvIpeNBQI-jlfYOE6NUkDhgf0ghk4IJtM",
    });

    if (!token) {
      console.warn("⚠️ Token FCM kosong");
      return null;
    }

    console.log("✅ Token FCM:", token);

    // Dengarkan pesan saat aplikasi aktif
    onMessage(messaging, (payload) => {
      console.log("📥 Notifikasi diterima:", payload);
      if (typeof onForegroundMessage === "function") {
        onForegroundMessage(payload);
      }
    });

    return token;
  } catch (err) {
    console.error("❌ Gagal langganan notifikasi:", err);
    return null;
  }
};

export { messaging };
