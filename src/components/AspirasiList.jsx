//aspira-desa-frontend/src/components/AspirasiList.jsx
import React from "react";

function formatDateTime(dateTimeStr) {
  const date = new Date(dateTimeStr);
  return date.toLocaleString("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
  });
}

function AspirasiList({ data, onReport, onTanggapi, showReportButton = true, selectedId }) {
  if (!data || data.length === 0) {
    return <p className="text-gray-600">Belum ada aspirasi yang dikirim.</p>;
  }

  return (
    <div className="space-y-4">
      {data.map((item) => (
        <div
          key={item.id}
          className={`bg-white shadow rounded-lg p-4 border border-gray-100 hover:shadow-md transition ${
            selectedId === item.id ? "border-blue-500" : ""
          }`}
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="text-lg font-semibold text-blue-700">
                {item.judul}
              </h4>
              <p className="text-sm text-gray-500 italic">
                oleh {item.nama_user || "Anonim"} — {formatDateTime(item.waktu_kirim)}
              </p>
            </div>

            <div className="flex space-x-2">
              {showReportButton && (
                <button
                  onClick={() => onReport(item.id)}
                  className="bg-red-500 text-white px-3 py-1 text-xs rounded hover:bg-red-600"
                >
                  Laporkan
                </button>
              )}

              {!item.isi_tanggapan && onTanggapi && (
                <button
                  onClick={() => onTanggapi(item)}
                  className="bg-green-600 text-white px-3 py-1 text-xs rounded hover:bg-green-700"
                >
                  Tanggapi
                </button>
              )}
            </div>
          </div>
          <p className="text-gray-700">{item.isi}</p>

          {item.isi_tanggapan && (
  <div className="mt-2 text-sm text-gray-800">
    <p>
      <strong>Tanggapan:</strong> {item.isi_tanggapan}
    </p>
    <p className="text-gray-500 italic">Oleh: {item.nama_penanggap}</p>
  </div>
)}
        </div>
      ))}
    </div>
  );
}


export default AspirasiList;
