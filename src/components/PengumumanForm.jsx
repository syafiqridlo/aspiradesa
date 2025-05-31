// components/PengumumanForm.jsx
import React, { useState } from "react";
import axios from "axios";

const PengumumanForm = ({ token, onSuccess }) => {
  const [judul, setJudul] = useState("");
  const [isi, setIsi] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/api/pengumuman", {
        judul,
        isi,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("✅ Pengumuman berhasil ditambahkan!");
      setJudul("");
      setIsi("");
      onSuccess?.();
    } catch (error) {
      console.error("❌ Gagal menambah pengumuman:", error);
      alert("Gagal menambah pengumuman.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mt-4">
      <h2 className="text-lg font-semibold mb-3">Form Tambah Pengumuman</h2>
      <input
        type="text"
        value={judul}
        onChange={(e) => setJudul(e.target.value)}
        placeholder="Judul Pengumuman"
        className="w-full border px-3 py-2 mb-3 rounded"
        required
      />
      <textarea
        value={isi}
        onChange={(e) => setIsi(e.target.value)}
        placeholder="Isi Pengumuman"
        className="w-full border px-3 py-2 mb-3 rounded"
        required
      />
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
        Kirim
      </button>
    </form>
  );
};

export default PengumumanForm;
