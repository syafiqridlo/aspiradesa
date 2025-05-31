// aspira-desa-frontend/src/app.jsx
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { messaging, subscribeToNotifications } from "./firebase";
import { onMessage, getToken } from "firebase/messaging"; // Tambah import getToken
import LandingPage from "./components/LandingPage";
import Beranda from "./components/Beranda";
import AspirasiForm from "./components/AspirasiForm";
import AspirasiList from "./components/AspirasiList";
import PollingSection from "./components/PollingSection";
import PollingForm from "./components/PollingForm";
import PollingList from "./components/PollingList";
import PollingResult from "./components/PollingResult";
import LoginForm from "./components/LoginForm";
import AdminDashboard from "./components/AdminDashboard";
import AddUserForm from "./components/AddUserForm";
import ReportedAspirasiList from "./components/ReportedAspirasiList";
import PerangkatDashboard from "./components/PerangkatDashboard.jsx";
import AdminView from "./components/views/AdminView";
import PerangkatDesaView from "./components/views/PerangkatDesaView";
import UserView from "./components/views/UserView";
import { jwtDecode } from "jwt-decode"; 
import Footer from "./components/Footer";





function App() {
  const [aspirasi, setAspirasi] = useState([]);
  const [pollingId, setPollingId] = useState(null);
  const [user, setUser] = useState(null);
  const [jumlahUser, setJumlahUser] = useState(0);
  const [showLogin, setShowLogin] = useState(false);
  const [showAspirasiForm, setShowAspirasiForm] = useState(false);
  const [showPolling, setShowPolling] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showAllUserForm, setShowAllUserForm] = useState(false);
  const [showAspirasiListForm, setShowAspirasiListForm] = useState(false);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [showAddPollingForm, setShowAddPollingForm] = useState(false);
  const [pollingList, setPollingList] = useState([]);
  const [jumlahPollingAktif, setJumlahPollingAktif] = useState(0);
  const [agendaList, setAgendaList] = useState([]);
  const [pengumumanList, setPengumumanList] = useState([]);
  const [isAuthChecked, setIsAuthChecked] = useState(false);


  const token = localStorage.getItem("token") || ""; // Pastikan tidak null

  useEffect(() => {
  const savedToken = localStorage.getItem("token");
  const savedUser = localStorage.getItem("user");

  if (savedToken && savedUser && !user) {
    try {
      const decodedToken = jwtDecode(savedToken);
      const currentTime = Date.now() / 1000; // dalam detik

      if (decodedToken.exp < currentTime) {
        console.warn("Token sudah kedaluwarsa");
        handleLogout(); // hapus token dan user
      } else {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error("Gagal memproses token:", error);
      handleLogout();
    }
  }
}, [user]);


  // Fetch pengumuman sekali saat mount
  useEffect(() => {
    const fetchPengumuman = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/pengumuman");
        setPengumumanList(res.data);
      } catch (err) {
        console.error("Gagal memuat pengumuman:", err);
      }
    };
    fetchPengumuman();
  }, []);

  // Init FCM dan kirim token ke backend
  useEffect(() => {
  const initNotifications = async () => {
    if (!token) {
      console.warn("Token JWT kosong, tidak bisa kirim token FCM ke backend");
      return;
    }

    const fcmToken = await subscribeToNotifications((payload) => {
      const { title, body } = payload.notification;
      if (Notification.permission === "granted") {
        new Notification(title, {
          body,
          icon: "/logo.png",
        });
      }
    });

    if (fcmToken) {
      try {
        console.log("Kirim token FCM ke backend dengan token JWT:", token);
        await axios.post(
          "http://localhost:3000/api/notifikasi/token",
          { token: fcmToken },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Kirim notifikasi opsional
        await axios.post(
          "http://localhost:3000/api/notifikasi/kirim",
          {
            title: "Notifikasi Baru",
            body: "Selamat datang di Aspira Desa!",
            token: fcmToken,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        console.error("❌ Gagal kirim token ke backend:", err);
      }
    }
  };
  initNotifications();
}, [token]);
// tambah token sebagai dependency agar update jika token berubah

  // Listen pesan FCM saat app aktif
  useEffect(() => {
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("📨 Notifikasi diterima saat app aktif:", payload);
      const { title, body } = payload.notification;

      if (Notification.permission === "granted") {
        new Notification(title, {
          body,
          icon: "/logo.png",
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch data tiap kali user berubah (login/logout)
  useEffect(() => {
    if (user) {
      fetchAspirasi();
      fetchPollingList();
      fetchJumlahUser();
      fetchAgendaList();
    }
  }, [user]);

  // Fungsi ambil token FCM (tidak dipakai di sini, bisa dipanggil di useEffect jika diperlukan)
  const ambilTokenFCM = async () => {
    try {
      const fcmToken = await getToken(messaging, {
        vapidKey:
          "BC7Rq5Fsvv0MhBItIhgH46kqat9aFMnBm7EiPEYrGQ5BqVKY-RhFlTIvIpeNBQI-jlfYOE6NUkDhgf0ghk4IJtM",
      });

      if (fcmToken) {
        console.log("✅ Token FCM:", fcmToken);
        await axios.post(
          "http://localhost:3000/api/notifikasi/fcm/token",
          {
            title: "Notifikasi Baru",
            body: "Selamat datang di Aspira Desa!",
            token: fcmToken,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        console.warn("⚠️ Token tidak tersedia atau izin belum diberikan");
      }
    } catch (error) {
      console.error("❌ Gagal mengambil token FCM:", error);
    }
  };

  const fetchAspirasi = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/aspirasi");
      setAspirasi(response.data);
    } catch (error) {
      console.error("Gagal memuat aspirasi:", error);
    }
  }, []);

  const fetchPollingList = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/polling/aktif");
      if (res.status === 200 && Array.isArray(res.data)) {
        setPollingList(res.data);
        const aktifList = res.data.filter((p) => p.status === "aktif");
        setJumlahPollingAktif(aktifList.length);
        const aktif = aktifList[0];
        if (aktif) setPollingId(aktif.id);
      }
    } catch (error) {
      console.error("Gagal memuat polling:", error);
    }
  }, []);

  const fetchJumlahUser = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/user/count");
      setJumlahUser(res.data.count);
    } catch (error) {
      console.error("Gagal memuat jumlah pengguna:", error);
    }
  }, []);

  const fetchAgendaList = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/agenda");
      setAgendaList(res.data);
    } catch (error) {
      console.error("Gagal memuat agenda:", error);
    }
  }, []);

  const handleAdd = (newAspirasi) => {
    setAspirasi((prev) => [newAspirasi, ...prev]);
  };

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }, []);

  const handleReport = useCallback(
    async (aspirasiId) => {
      try {
        await axios.post(
          `http://localhost:3000/api/aspirasi/lapor/${aspirasiId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert("Aspirasi berhasil dilaporkan!");
        fetchAspirasi();
      } catch (error) {
        console.error("❌ Gagal melaporkan aspirasi:", error);
        alert("Gagal melaporkan aspirasi.");
      }
    },
    [fetchAspirasi, token]
  );

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      document.documentElement.classList.toggle("dark", !prev);
      return !prev;
    });
  };

  // Rename parameter agar tidak conflict dengan state token
  const handleLogin = (loggedInUser, tokenValue) => {
    if (loggedInUser && loggedInUser.role) {
      setUser(loggedInUser);
      localStorage.setItem("token", tokenValue);
      localStorage.setItem("user", JSON.stringify(loggedInUser));
    }
  };

  const handleDeletePolling = useCallback(
    async (id) => {
      try {
        await axios.delete(`http://localhost:3000/api/polling/${id}`);
        fetchPollingList();
      } catch (error) {
        console.error("Gagal menghapus polling:", error);
      }
    },
    [fetchPollingList]
  );

  const handleChangeStatus = useCallback(
    async (id, newStatus) => {
      try {
        await axios.put(`http://localhost:3000/api/polling/${id}/status`, {
          status: newStatus,
        });
        fetchPollingList();
      } catch (error) {
        console.error("Gagal ubah status polling:", error);
      }
    },
    [fetchPollingList]
  );

  console.log("Logged-in user:", user);

  // Render berdasarkan role dan login
  if (!user && !showLogin) {
    return <LandingPage onLoginClick={() => setShowLogin(true)} />;
  }
  if (!user) {
  const savedToken = localStorage.getItem("token");
  const savedUser = localStorage.getItem("user");

  if (savedToken && savedUser) {
    // Masih menunggu validasi token
    return <div>Loading...</div>;
  }

  if (!showLogin) {
    return <LandingPage onLoginClick={() => setShowLogin(true)} />;
  }

  return (
    <div className="max-w-sm mx-auto p-4">
      <LoginForm onLogin={handleLogin} />
    </div>
  );
}

  const role = user.role?.trim().toLowerCase();

  if (role === "admin") {
    return (
      <>
      <AdminView
        user={user}
        token={token}
        pollingList={pollingList}
        jumlahPollingAktif={jumlahPollingAktif}
        showAddUserForm={showAddUserForm}
        showAddPollingForm={showAddPollingForm}
        setShowAddUserForm={setShowAddUserForm}
        setShowAddPollingForm={setShowAddPollingForm}
        handleLogout={handleLogout}
        handleDeletePolling={handleDeletePolling}
        handleChangeStatus={handleChangeStatus}
        fetchPollingList={fetchPollingList}
        showAllUserForm={showAllUserForm}
        setShowAllUserForm={setShowAllUserForm}
        showAspirasiListForm={showAspirasiListForm}
        setShowAspirasiListForm={setShowAspirasiListForm}
      />
      <Footer />
      </>
    );
  }

  if (role === "perangkat") {
    return (
      <PerangkatDesaView user={user} token={token} handleLogout={handleLogout} />
    );
  }

  if (role === "user" || !["admin", "perangkat"].includes(role)) {
    return (
      <>
      <UserView
        user={user}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        handleLogout={handleLogout}
        aspirasi={aspirasi}
        jumlahUser={jumlahUser}
        pollingList={pollingList}
        pollingId={pollingId}
        showAspirasiForm={showAspirasiForm}
        setShowAspirasiForm={setShowAspirasiForm}
        showPolling={showPolling}
        setShowPolling={setShowPolling}
        handleAdd={handleAdd}
        handleReport={handleReport}
        agenda={agendaList}
        pengumuman={pengumumanList}
      />
      <Footer />
      </>
    );
  }

  return null; // fallback jika role tidak sesuai
}

export default App;
