import React, { useState } from "react";
import axios from "axios";

const AspirasiForm = ({ onAdd }) => {
  const [formData, setFormData] = useState({ judul: "", isi: "" });
  const [loading, setLoading] = useState(false);
  const [isAnonim, setIsAnonim] = useState(false);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Nilai isAnonim yang akan dikirim:", isAnonim, typeof isAnonim);


    try {
      const token = localStorage.getItem("token");
      console.log("Token yang dikirim:", token);
      if (!token) {
        alert("Kamu harus login terlebih dahulu.");
        return;
      }

      const response = await axios.post(
        "http://localhost:3000/api/aspirasi",
        {
          judul: formData.judul,
          isi: formData.isi,
          isAnonim: isAnonim,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (onAdd) onAdd(response.data);
      setFormData({ judul: "", isi: "" });
    } catch (error) {
      console.error("Gagal mengirim aspirasi:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-3 border">
      <h2 className="text-lg font-semibold">Kirim Aspirasi</h2>
      <label className="inline-flex items-center space-x-2">
  <input
    type="checkbox"
    checked={isAnonim}
    onChange={(e) => setIsAnonim(e.target.checked)}
  />
  <span>Kirim sebagai anonim</span>
</label>

      <input
        type="text"
        name="judul"
        placeholder="Judul"
        value={formData.judul}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />
      <textarea
        name="isi"
        placeholder="Isi aspirasi"
        value={formData.isi}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Mengirim..." : "Kirim"}
      </button>
    </form>
  );
};

export default AspirasiForm;
