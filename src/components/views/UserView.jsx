// src/components/views/UserView.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import Beranda from "../Beranda";
import AspirasiForm from "../AspirasiForm";
import AspirasiList from "../AspirasiList";
import PollingSection from "../PollingSection";
import PollingResult from "../PollingResult";
import AgendaList from "../AgendaList";
import ForumThreadItem from "../ForumThreadItem";


const UserView = ({
  user,
  isDarkMode,
  toggleDarkMode,
  handleLogout,
  aspirasi,
  jumlahUser,
  pollingList,
  pollingId,
  agenda = [],
  handleAdd,
  handleReport,
  pengumuman = []
}) => {
  const [activeTab, setActiveTab] = useState("beranda");
  const [forumThreads, setForumThreads] = useState([]);

  useEffect(() => {
    if (activeTab === "forum") {
      getForumData();
    }
  }, [activeTab]);

  const getForumData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3000/api/forum", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForumThreads(res.data);
    } catch (err) {
      console.error("Gagal memuat data forum:", err);
    }
  };

 const refreshForumThreads = (updatedThread) => {
  setForumThreads((prevThreads) =>
    prevThreads.map((thread) =>
      thread.id === updatedThread.id ? updatedThread : thread
    )
  );
};

const handleAddComment = async (newComment) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.post(
      `http://localhost:3000/api/forum/${thread.id}/comments`,
      newComment,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // res.data adalah thread terbaru dengan komentar baru
    if (onSuccess) {
      onSuccess(res.data);
    }
  } catch (err) {
    console.error("Gagal menambahkan komentar:", err);
  }
};

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark" : ""} bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100`}>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-blue-600 dark:bg-gray-800 text-white px-4 py-3 rounded mb-6 shadow flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img src="/logo.png" alt="Logo" className="h-8 w-8" />
            <span className="font-bold text-lg">Aspira Desa</span>
          </div>

          {/* Navigasi Tab */}
          <div className="hidden md:flex space-x-4 font-medium">
            {[
              { key: "beranda", label: "Beranda" },
              { key: "aspirasi", label: "Aspirasi" },
              { key: "polling", label: "Polling" },
              { key: "forum", label: "Forum" },
              { key: "agenda", label: "Agenda" },
              { key: "pengumuman", label: "Pengumuman" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded transition-colors ${
                  activeTab === tab.key
                    ? "bg-yellow-400 text-gray-900 font-semibold"
                    : "hover:text-yellow-300 text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <button onClick={toggleDarkMode} className="text-sm hover:underline focus:outline-none">
              {isDarkMode ? "☀️ Light" : "🌙 Dark"}
            </button>
            <span className="text-sm">👤 {user?.nama}</span>
            <button onClick={handleLogout} className="text-red-200 hover:underline text-sm">
              Logout
            </button>
          </div>
        </div>

        {/* Konten Berdasarkan Tab */}
        {activeTab === "beranda" && (
          <Beranda
            user={user}
            totalAspirasi={aspirasi.length}
            totalPengguna={jumlahUser}
            pollingAktif={!!pollingId}
            data={aspirasi}
            onAspirasiClick={() => setActiveTab("aspirasi")}
            onPollingClick={() => setActiveTab("polling")}
            pollingList={pollingList}
          />
        )}

        {activeTab === "aspirasi" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-white dark:bg-gray-800 shadow-md rounded p-4 mb-4">
              <h2 className="text-lg font-semibold mb-2">Kirim Aspirasi</h2>
              <AspirasiForm onAdd={handleAdd} />
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-md rounded p-4 mb-4">
              <h2 className="text-lg font-semibold mb-2">Semua Aspirasi</h2>
              <AspirasiList data={aspirasi} onReport={handleReport} />
            </div>
          </div>
        )}

        {activeTab === "polling" && (
          <div className="bg-white dark:bg-gray-800 shadow-md rounded p-4 mb-4">
            <h2 className="text-lg font-semibold mb-2">Polling</h2>
            <PollingSection user={user} />
            {pollingId && <PollingResult pollingId={pollingId} />}
          </div>
        )}

        {activeTab === "forum" && (
  <div className="mt-6">
    <h2 className="text-xl font-semibold mb-4">Forum Diskusi</h2>
    {forumThreads.length === 0 ? (
      <p className="text-gray-600 dark:text-gray-400">Belum ada topik diskusi.</p>
    ) : (
      <ul className="space-y-4">
        {forumThreads.map((thread) => (
          <ForumThreadItem key={thread.id} thread={thread} user={user} onSuccess={refreshForumThreads} />

        ))}
      </ul>
    )}
  </div>
)}


        {activeTab === "agenda" && (
          <div className="mt-6">
            <AgendaList agenda={agenda} />
          </div>
        )}

        {activeTab === "pengumuman" && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Pengumuman</h2>
            {pengumuman.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400">Belum ada pengumuman.</p>
            ) : (
              <ul className="space-y-4">
                {pengumuman.map((item) => (
                  <li key={item.id} className="bg-white dark:bg-gray-800 shadow-md rounded p-4">
                    <h3 className="text-lg font-semibold">{item.judul}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(item.tanggal).toLocaleDateString()}
                    </p>
                    <p className="mt-2">{item.isi}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserView;
