// src/components/AddUserForm
import React, { useState } from "react";
import axios from "axios";

function AddUserForm({ token }) {
  const [nama, setNama] = useState("");
  const [nik, setNik] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("warga"); // Default: warga
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/user/tambah",
        {
          nama,
          nik,
          password,
          role, // Tambahkan role ke body request
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess(`✅ Pengguna ditambahkan: ${response.data?.user?.nama || nama}`);
      setNama("");
      setNik("");
      setPassword("");
      setRole("warga"); // Reset ke default
    } catch (err) {
      console.error("Gagal menambahkan pengguna:", err);
      setError(err.response?.data?.error || "Terjadi kesalahan.");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mt-6">
      <h2 className="text-lg font-semibold mb-4">Tambah Pengguna Baru</h2>

      {success && <div className="text-green-600 mb-2">{success}</div>}
      {error && <div className="text-red-600 mb-2">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Nama</label>
          <input
            type="text"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">NIK</label>
          <input
            type="text"
            value={nik}
            onChange={(e) => setNik(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Peran (Role)</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="warga">Warga</option>
            <option value="perangkat">Perangkat</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Tambah Pengguna
        </button>
      </form>
    </div>
  );
}

export default AddUserForm;
