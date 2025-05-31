import React, { useEffect, useState } from "react";
import axios from "axios";

function SelesaiAspirasiList({ token }) {
  const [aspirasiList, setAspirasiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSelesai = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.get("http://localhost:3000/api/aspirasi/selesai", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAspirasiList(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Gagal mengambil data selesai");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSelesai();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="bg-white p-4 rounded shadow mt-6">
      <h2 className="text-xl font-semibold mb-4">Aspirasi yang Sudah Selesai</h2>

      {aspirasiList.length === 0 ? (
        <p>Belum ada aspirasi yang ditandai selesai.</p>
      ) : (
        <ul className="space-y-4">
          {aspirasiList.map((aspirasi) => (
            <li key={aspirasi.id} className="border p-3 rounded">
              <p><strong>Judul:</strong> {aspirasi.judul}</p>
              <p><strong>Isi:</strong> {aspirasi.isi}</p>
              <p><strong>Pengirim:</strong> {aspirasi.nama}</p>
              <p><strong>Dikirim pada:</strong> {new Date(aspirasi.waktu_kirim).toLocaleString()}</p>
              <p className="text-green-600 font-semibold mt-2">✅ Sudah Selesai</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SelesaiAspirasiList;
