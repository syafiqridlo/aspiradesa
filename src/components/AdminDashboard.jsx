// aspira-desa-frontend/src/components/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import AddUserForm from "./AddUserForm"; // Sesuaikan path jika perlu
import PollingList from "./PollingList";
import ReportedAspirasiList from "./ReportedAspirasiList";
import AspirasiList from "./AspirasiList"; 
import SelesaiAspirasiList from "./SelesaiAspirasiList";

function AdminDashboard({ user, token, showAllUserForm, showAspirasiListForm }) {
  const [aspirasiList, setAspirasiList] = useState([]);
  const [pollingList, setPollingList] = useState([]);
  const [pengguna, setPengguna] = useState([]);
  const [userToEdit, setUserToEdit] = useState(null);
  const [namaEdit, setNamaEdit] = useState("");
  const [nikEdit, setNikEdit] = useState("");
  const [passwordEdit, setPasswordEdit] = useState("");
  const [activeTab, setActiveTab] = useState("reported");

  useEffect(() => {
    fetchAspirasi();
    fetchPolling();
    fetchPengguna();
  }, []);

  const fetchAspirasi = async () => {
    try {
      console.log("📡 Memanggil fetchAspirasi..."); // Tambahkan ini
      const res = await axios.get("http://localhost:3000/api/aspirasi");
      console.log("Data aspirasi yang diterima dari API:", res.data);
      const data = res.data;
      setAspirasiList(res.data);
    } catch (err) {
      console.error("Gagal memuat aspirasi", err);
    }
  };

  const fetchPolling = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/polling/aktif");
      setPollingList(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Gagal memuat polling", err);
    }
  };

  const fetchPengguna = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/user/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPengguna(res.data);
    } catch (err) {
      console.error("Gagal memuat pengguna", err);
      if (err.response) {
        console.error("Respons dari server:", err.response.data);
        console.error("Status error:", err.response.status);
      } else if (err.request) {
        console.error("Permintaan tidak mendapat respons:", err.request);
      } else {
        console.error("Error lainnya:", err.message);
      }
    }
  };

  const handleEditUser = (user) => {
    setUserToEdit(user);
    setNamaEdit(user.nama);
    setNikEdit(user.nik);
    setPasswordEdit(""); // Kosongkan saat mulai edit
  };

  const submitEditUser = async () => {
    try {
      await axios.patch(
        `http://localhost:3000/api/user/edit/${userToEdit.id}`,
        {
          nama: namaEdit,
          nik: nikEdit,
          password: passwordEdit, // Kirim passwordEdit jika diisi
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Pengguna berhasil diedit");
      setUserToEdit(null);
      fetchPengguna(); // Refresh data setelah edit
    } catch (err) {
      console.error("Gagal edit pengguna", err);
      alert("Gagal mengedit pengguna");
    }
  };

  const handleDeleteUser = async (userId) => {
    const konfirmasi = window.confirm("Yakin ingin menghapus pengguna ini?");
    if (!konfirmasi) return;

    try {
      await axios.delete(`http://localhost:3000/api/user/hapus/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Pengguna berhasil dihapus");
      fetchPengguna();
    } catch (err) {
      console.error("Gagal menghapus pengguna", err);
      alert("Gagal menghapus pengguna");
    }
  };

  const handleReport = (aspirasiId) => {
    alert(`Melaporkan aspirasi dengan ID: ${aspirasiId}`);
    // Logic kirim laporan ke backend bisa ditambahkan di sini
  };

  // Tambahkan di atas return, bisa di dalam komponen
const tabStyles = {
  reported: {
    active: "bg-blue-600 text-white",
    inactive: "bg-gray-200 text-gray-700",
  },
  selesai: {
    active: "bg-green-600 text-white",
    inactive: "bg-gray-200 text-gray-700",
  },
};


  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">Dashboard Admin</h1>
      <p className="text-gray-600 mb-6">Selamat datang, {user?.nama}!</p>

      {/* Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
  {[
    { label: "Total Aspirasi", value: aspirasiList.length, color: "blue" },
    { label: "Poling Aktif", value: pollingList.length, color: "green" },
    { label: "Total Pengguna", value: pengguna.length, color: "purple" },
  ].map((stat, idx) => (
    <div
      key={idx}
      className={`bg-${stat.color}-100 p-4 rounded text-center shadow`}
    >
      <h2 className={`text-xl font-bold text-${stat.color}-700`}>
        {stat.value}
      </h2>
      <p className="text-gray-600">{stat.label}</p>
    </div>
  ))}
</div>

      {/* Polling Aktif Terbaru (Maksimal 3) */}
     <div className="mb-6">
  <h3 className="text-lg font-semibold mb-2 text-blue-700">Polling Aktif Terbaru</h3>
  {pollingList.length === 0 ? (
    <p className="text-gray-500">Belum ada polling aktif.</p>
  ) : (
    <ul className="list-disc pl-5 space-y-1">
      {pollingList
        .filter((p) => p.status === "aktif")
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 3)
        .map((poll) => (
          <li key={poll.id}>
            <span className="font-medium">{poll.judul}</span>{" "}
            <span className="text-xs text-gray-500">
              ({new Date(poll.created_at).toLocaleDateString("id-ID")})
            </span>
          </li>
        ))}
    </ul>
  )}
</div>


      {/* Tab Dilaporkan dan Selesai */}
<div className="mb-6">
  <div className="flex space-x-2 mb-4">
    {["reported", "selesai"].map((tabKey) => (
      <button
        key={tabKey}
        onClick={() => setActiveTab(tabKey)}
        className={`px-4 py-2 rounded ${
          activeTab === tabKey
            ? tabStyles[tabKey].active
            : tabStyles[tabKey].inactive
        }`}
      >
        {tabKey === "reported" ? "Dilaporkan" : "Selesai"}
      </button>
    ))}
  </div>

  <div>
    {activeTab === "reported" && (
      <div className="bg-white p-4 rounded shadow">
        <ReportedAspirasiList token={token} />
      </div>
    )}
    {activeTab === "selesai" && (
      <div className="bg-white p-4 rounded shadow">
        <SelesaiAspirasiList token={token} />
      </div>
    )}
  </div>
</div>



      {/* Aspirasi Terbaru */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Daftar Aspirasi Terbaru</h3>
        {aspirasiList.length === 0 ? (
          <p className="text-gray-500">Belum ada aspirasi yang masuk.</p>
        ) : (
          <ul className="space-y-3">
            {aspirasiList
  .slice()
  .sort((a, b) => new Date(b.waktu_kirim) - new Date(a.waktu_kirim)) // Sort terbaru ke lama
  .slice(0, 3) // Ambil 3 teratas (terbaru)
  .map((asp) => (
    <li key={asp.id} className="p-3 border rounded bg-gray-50 text-sm shadow-sm">
      <div className="font-semibold text-blue-700">{asp.nama_user}</div>
      <div className="text-gray-800">{asp.isi}</div>
      <div className="text-gray-400 text-xs">
        {new Date(asp.waktu_kirim).toLocaleString("id-ID")}
      </div>
    </li>
  ))}

          </ul>
        )}
      </div>

      {/* Semua Pengguna */}
      {showAllUserForm && (
        <div className="mb-6 bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-4 text-blue-700">Daftar Seluruh Pengguna</h3>
          {pengguna.length === 0 ? (
            <p className="text-gray-500">Tidak ada pengguna.</p>
          ) : (
            <table className="w-full border-collapse shadow-sm">
  <thead className="bg-gray-100 text-gray-700 text-left text-sm">
    <tr>
      <th className="p-2 border">ID</th>
      <th className="p-2 border">Nama</th>
      <th className="p-2 border">NIK</th>
      <th className="p-2 border">Aksi</th>
    </tr>
  </thead>
  <tbody>
    {pengguna.map((user) => (
      <tr key={user.id} className="hover:bg-gray-50 text-sm">
        <td className="border px-2 py-1">{user.id}</td>
        <td className="border px-2 py-1">{user.nama}</td>
        <td className="border px-2 py-1">{user.nik}</td>
        <td className="border px-2 py-1">
          <button
            onClick={() => handleEditUser(user)}
            className="text-yellow-600 hover:underline mr-2"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteUser(user.id)}
            className="text-red-600 hover:underline"
          >
            Hapus
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

          )}
        </div>
      )}

      {/* Semua Aspirasi */}
      {showAspirasiListForm && (
        <div className="mb-6 bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-4 text-green-700">Daftar Semua Aspirasi</h3>
          {aspirasiList.length === 0 ? (
  <p className="text-gray-500">Belum ada aspirasi yang dikirim.</p>
) : (
  <AspirasiList data={aspirasiList} onReport={handleReport} />
)}
        </div>
      )}

      {/* Form Edit Pengguna */}
      {userToEdit && (
  <div className="mb-6 p-4 bg-yellow-100 rounded shadow">
    <h3 className="text-lg font-semibold mb-2">Edit Pengguna</h3>
    <div className="grid gap-3">
      <input
        className="border p-2 rounded"
        value={namaEdit}
        onChange={(e) => setNamaEdit(e.target.value)}
        placeholder="Nama"
      />
      <input
        className="border p-2 rounded"
        value={nikEdit}
        onChange={(e) => setNikEdit(e.target.value)}
        placeholder="NIK"
      />
      <input
        type="password"
        className="border p-2 rounded"
        value={passwordEdit}
        onChange={(e) => setPasswordEdit(e.target.value)}
        placeholder="Password (opsional)"
      />
      <div className="flex gap-2">
        <button
          onClick={submitEditUser}
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
        >
          Simpan
        </button>
        <button
          onClick={() => setUserToEdit(null)}
          className="bg-gray-400 text-white px-4 py-1 rounded hover:bg-gray-500"
        >
          Batal
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}

export default AdminDashboard;
