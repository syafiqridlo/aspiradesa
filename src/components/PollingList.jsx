import React from "react";

function PollingList({
  pollingList = [],
  limitToThree = false,
  onToggleStatus,
  onDelete,
}) {
  const filtered = pollingList
    .filter((p) => p.status === "aktif")
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Mengurutkan berdasarkan createdAt

  const displayList = limitToThree ? filtered.slice(0, 3) : pollingList;

  if (displayList.length === 0) {
    return <p className="text-gray-500">Tidak ada polling yang tersedia.</p>;
  }

  // Fungsi untuk memformat tanggal
  const convertToValidDate = (dateString) => {
  // Jika tanggal dalam format DD-MM-YYYY, ubah ke YYYY-MM-DD
  const parts = dateString.split("-");
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`; // Mengubah format ke YYYY-MM-DD
  }
  return dateString;
};

const formatDate = (dateString) => {
  const validDateString = convertToValidDate(dateString);
  const date = new Date(validDateString);
  if (isNaN(date.getTime())) {
    return "Tanggal Tidak Valid";
  }
  return date.toLocaleDateString("id-ID"); // Format tanggal Indonesia
};

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2 text-left">Judul</th>
            <th className="border px-4 py-2 text-left">Status</th>
            <th className="border px-4 py-2 text-left">Setuju</th>
            <th className="border px-4 py-2 text-left">Tidak Setuju</th>
            <th className="border px-4 py-2 text-left">Tanggal Dibuat</th>
            {(onToggleStatus || onDelete) && (
              <th className="border px-4 py-2 text-left">Aksi</th>
            )}
          </tr>
        </thead>
        <tbody>
          {displayList.map((poll) => (
            <tr key={poll.id} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{poll.judul}</td>
              <td className="border px-4 py-2 capitalize">{poll.status}</td>
              <td className="border px-4 py-2">{poll.setuju || 0}</td>
              <td className="border px-4 py-2">{poll.tidakSetuju || 0}</td>
              <td className="border px-4 py-2">
                {poll.createdAt ? formatDate(poll.createdAt) : "Tanggal Tidak Tersedia"}
              </td>
              {(onToggleStatus || onDelete) && (
                <td className="border px-4 py-2 space-x-2">
                  {onToggleStatus && (
                    <button
                      onClick={() =>
                        onToggleStatus(
                          poll.id,
                          poll.status === "aktif" ? "nonaktif" : "aktif"
                        )
                      }
                      className="text-blue-500 hover:underline text-sm"
                    >
                      {poll.status === "aktif" ? "Nonaktifkan" : "Aktifkan"}
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(poll.id)}
                      className="text-red-500 hover:underline text-sm"
                    >
                      Hapus
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PollingList;
