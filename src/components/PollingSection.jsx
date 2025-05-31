import React, { useEffect, useState } from "react";
import axios from "axios";

function PollingSection({ user }) {
  const [polling, setPolling] = useState(null);
  const [voted, setVoted] = useState(false);
  const [voteStatus, setVoteStatus] = useState(null);

  // Mengambil polling aktif saat komponen pertama kali dimuat
  useEffect(() => {
  axios
    .get("http://localhost:3000/api/polling/aktif")
    .then((res) => {
      console.log("Polling Data Diterima:", res.data);
      
      // Pastikan kita mengambil polling pertama dari array jika ada lebih dari satu polling
      if (res.data && res.data.length > 0) {
        setPolling(res.data[0]); // Ambil polling pertama
      } else {
        console.error("Tidak ada polling aktif");
      }
    })
    .catch((err) => {
      console.error("Gagal mengambil polling:", err);
    });
}, []);



  // Fungsi untuk menangani voting
  const handleVote = async (pilihan) => {
    if (!polling || !polling.id) {
      console.error("Polling ID tidak valid atau belum tersedia");
      return;
    }

    try {
      // Mengirim vote ke server
      const response = await axios.post(
        `http://localhost:3000/api/polling/${polling.id}/vote`,
        {
          userId: user.id,
          pilihan,
        }
      );

      // Menandakan bahwa user sudah memilih
      setVoted(true);
      setVoteStatus(pilihan);
      console.log(response.data.message);
    } catch (err) {
      if (err.response?.status === 409) {
        // Jika user sudah pernah memilih sebelumnya
        alert("Kamu sudah memilih di polling ini");
        setVoted(true);
      } else {
        // Penanganan kesalahan lainnya
        console.error("Vote gagal:", err);
      }
    }
  };

  if (!polling) return <p>Memuat polling aktif...</p>; // Memberikan feedback jika polling belum tersedia

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-2">Polling: {polling.judul}</h2>
      {voted ? (
        // Jika sudah voting, tampilkan status pilihan yang dipilih
        <p className="mt-4 text-green-600">
          Terima kasih atas partisipasinya! Kamu memilih: {voteStatus}
        </p>
      ) : (
        // Jika belum voting, tampilkan tombol vote
        <div className="space-x-4">
          <button
            onClick={() => handleVote("Setuju")}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            disabled={voted}
          >
            Setuju
          </button>
          <button
            onClick={() => handleVote("Tidak Setuju")}
            className="bg-red-500 text-white px-4 py-2 rounded-lg"
            disabled={voted}
          >
            Tidak Setuju
          </button>
        </div>
      )}
    </div>
  );
}

export default PollingSection;
