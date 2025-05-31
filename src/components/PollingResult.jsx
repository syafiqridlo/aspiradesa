import React, { useEffect, useState } from "react";
import axios from "axios";

function PollingResult({ pollingId }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);  // Set loading to true initially
  const [error, setError] = useState(null);  // To store error messages

  useEffect(() => {
    if (pollingId) {
      // Start loading when the request begins
      setLoading(true);
      setError(null); // Reset error on new request

      axios
        .get(`http://localhost:3000/api/polling/${pollingId}/hasil`)
        .then((res) => {
          // Clean up data by converting jumlah to a number
          const cleanData = res.data.map((row) => ({
            pilihan: row.pilihan,
            jumlah: Number(row.jumlah),  // Convert jumlah to number
          }));
          setResults(cleanData);  // Update state with cleaned data
        })
        .catch((err) => {
          console.error("Gagal mengambil hasil polling:", err);
          setError("Gagal mengambil hasil polling. Silakan coba lagi.");
        })
        .finally(() => {
          setLoading(false);  // Finish loading when request is completed
        });
    }
  }, [pollingId]);

  if (loading) return <p>Memuat hasil...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!results.length) return <p>Tidak ada hasil untuk polling ini.</p>;

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">Hasil Sementara</h2>
      <ul className="space-y-1 text-sm">
        {results.map((r) => (
          <li key={r.pilihan}>
            {r.pilihan}: <strong>{r.jumlah}</strong> suara
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PollingResult;
