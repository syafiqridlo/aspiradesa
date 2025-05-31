// src/components/AgendaList.jsx
import React from "react";

const AgendaList = ({ agenda }) => (
  <div className="bg-white p-4 rounded shadow">
    <h2 className="text-xl font-semibold mb-4">Agenda Kegiatan</h2>
    {agenda.length === 0 ? (
      <p className="text-gray-500">Belum ada agenda.</p>
    ) : (
      agenda.map((item) => (
        <div key={item.id} className="mb-4 border-b pb-2">
          <h3 className="font-bold text-lg">{item.judul}</h3>
          <p className="text-sm text-gray-600">
            {new Date(item.tanggal).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
          {item.deskripsi && <p className="text-gray-800">{item.deskripsi}</p>}
        </div>
      ))
    )}
  </div>
);

export default AgendaList;

