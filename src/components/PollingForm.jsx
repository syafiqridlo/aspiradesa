import React, { useState } from "react";
import axios from "axios";

function PollingForm({ token, onSuccess, onCancel }) {
  const [judul, setJudul] = useState("");
  const [status, setStatus] = useState("aktif");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!judul.trim()) return alert("Judul polling tidak boleh kosong.");
    setLoading(true);

    try {
      await axios.post(
        "http://localhost:3000/api/polling",
        { judul, status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Polling berhasil ditambahkan");
      if (onSuccess) onSuccess();
      setJudul("");
      setStatus("aktif");
    } catch (err) {
      console.error("Gagal menambahkan polling", err);
      alert("Gagal menambahkan polling");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-indigo-100 p-4 rounded shadow mb-6">
      <h3 className="text-lg font-semibold mb-2">Form Tambah Polling</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          value={judul}
          onChange={(e) => setJudul(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Judul Polling"
          required
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="aktif">Aktif</option>
          <option value="nonaktif">Nonaktif</option>
        </select>
        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            disabled={loading}
          >
            {loading ? "Menyimpan..." : "Simpan Polling"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}

export default PollingForm;
