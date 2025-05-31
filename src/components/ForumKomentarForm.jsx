//src/components/forumkomentarform.jsx
import React, { useState } from "react";
import axios from "axios";

const ForumKomentarForm = ({ threadId, author, onSuccess }) => {
  const [isi, setIsi] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:3000/api/forum/${threadId}/comment`, {
        isi,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setIsi("");
      onSuccess();
    } catch (err) {
      console.error("❌ Gagal kirim komentar forum:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2 flex flex-col gap-1">
      <input
        type="text"
        value={isi}
        onChange={(e) => setIsi(e.target.value)}
        className="border p-1 text-sm"
        placeholder="Tulis komentar..."
        required
      />
      <button type="submit" className="bg-blue-500 text-white px-2 py-1 rounded text-sm">
        Kirim
      </button>
    </form>
  );
};

export default ForumKomentarForm;
