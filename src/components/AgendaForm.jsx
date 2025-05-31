//src/components/agendaform.jsx
import React, { useState } from "react";

const AgendaForm = ({ onAdd }) => {
  const [judul, setJudul] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [deskripsi, setDeskripsi] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!judul || !tanggal || !deskripsi) return;
    onAdd({ judul, tanggal, deskripsi });
    setJudul("");
    setTanggal("");
    setDeskripsi("");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-4">
      <h2 className="text-xl font-semibold mb-3">Tambah Agenda</h2>
      <input
        className="w-full mb-2 p-2 border rounded"
        placeholder="Judul"
        value={judul}
        onChange={(e) => setJudul(e.target.value)}
      />
      <input
        type="date"
        className="w-full mb-2 p-2 border rounded"
        value={tanggal}
        onChange={(e) => setTanggal(e.target.value)}
      />
      <textarea
        className="w-full mb-2 p-2 border rounded"
        placeholder="Deskripsi"
        value={deskripsi}
        onChange={(e) => setDeskripsi(e.target.value)}
      />
      <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
        Simpan
      </button>
    </form>
  );
};

export default AgendaForm;
