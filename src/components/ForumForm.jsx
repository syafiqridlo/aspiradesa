// src/components/ForumForm.jsx
import React, { useState } from "react";
import axios from "axios";

const ForumForm = ({ onSuccess }) => {
  const [title, setTitle] = useState("");
  const [isi, setIsi] = useState("");
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !isi.trim()) {
      alert("Judul dan isi tidak boleh kosong");
      return;
    }

    try {
      await axios.post(
        "http://localhost:3000/api/forum",
        { title, isi },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Thread berhasil dibuat");
      setTitle("");
      setIsi("");
      if (onSuccess) onSuccess(); // untuk refresh data
    } catch (err) {
      console.error("Gagal membuat thread:", err);
      alert("Gagal membuat thread");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 border rounded shadow mb-4">
      <h3 className="font-semibold mb-2">Buat Topik Baru</h3>
      <input
        type="text"
        placeholder="Judul Topik"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border p-2 mb-2 rounded"
      />
      <textarea
        placeholder="Isi Diskusi"
        value={isi}
        onChange={(e) => setIsi(e.target.value)}
        className="w-full border p-2 mb-2 rounded"
      />
      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
      >
        Kirim
      </button>
    </form>
  );
};

export default ForumForm;
