//src/components/reportedaspirasi.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

function ReportedAspirasiList({ token }) {
  const [aspirasiList, setAspirasiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);

  // Ambil daftar aspirasi yang dilaporkan
  const fetchReported = async () => {
    setLoading(true);
    setError(null);
    setActionMessage(null);

    try {
      const res = await axios.get("http://localhost:3000/api/aspirasi/reported", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAspirasiList(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Gagal mengambil data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReported();
  }, []);

  // Hapus aspirasi
  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus aspirasi ini?")) return;

    try {
      await axios.delete(`http://localhost:3000/api/aspirasi/hapus/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setActionMessage("Aspirasi berhasil dihapus");
      fetchReported();
    } catch (err) {
      setError(err.response?.data?.error || "Gagal menghapus aspirasi");
    }
  };

  // Setujui aspirasi (hapus flag is_reported)
  const handleApprove = async (id) => {
    try {
      await axios.patch(
        `http://localhost:3000/api/aspirasi/approve/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setActionMessage("Aspirasi disetujui kembali");
      fetchReported();
    } catch (err) {
      setError(err.response?.data?.error || "Gagal menyetujui aspirasi");
    }
  };

  // Tandai aspirasi selesai
  const handleMarkDone = async (id) => {
    if (!window.confirm("Tandai aspirasi ini sebagai selesai?")) return;

    try {
      await axios.patch(`http://localhost:3000/api/aspirasi/selesai/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setActionMessage("Aspirasi ditandai selesai");
      fetchReported();
    } catch (err) {
      setError(err.response?.data?.error || "Gagal menandai selesai");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="bg-white p-4 rounded shadow mt-6">
      <h2 className="text-xl font-semibold mb-4">Aspirasi yang Dilaporkan</h2>

      {actionMessage && <p className="text-green-600 mb-2">{actionMessage}</p>}

      {aspirasiList.length === 0 ? (
        <p>Tidak ada aspirasi yang dilaporkan.</p>
      ) : (
        <ul className="space-y-4">
          {aspirasiList.map((aspirasi) => (
            <li key={aspirasi.id} className="border p-3 rounded">
              <p><strong>Judul:</strong> {aspirasi.judul}</p>
              <p><strong>Isi:</strong> {aspirasi.isi}</p>
              <p><strong>Pengirim:</strong> {aspirasi.nama}</p>
              <p><strong>Dikirim pada:</strong> {new Date(aspirasi.waktu_kirim).toLocaleString()}</p>

              {aspirasi.is_selesai && (
                <p className="text-green-600 font-semibold">✅ Sudah Selesai</p>
              )}

              <div className="mt-2 space-x-2">
                {!aspirasi.is_selesai && (
                  <button
                    onClick={() => handleMarkDone(aspirasi.id)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Selesai
                  </button>
                )}
                <button
                  onClick={() => handleApprove(aspirasi.id)}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  Setujui
                </button>
                <button
                  onClick={() => handleDelete(aspirasi.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Hapus
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ReportedAspirasiList;
