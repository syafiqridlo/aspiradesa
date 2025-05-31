//src/components/perangkatdashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import AgendaList from "./AgendaList"; 
import PengumumanForm from "./PengumumanForm";
import AspirasiList from "./AspirasiList"; 
import PollingList from "./PollingList"; 
import PollingForm from "./PollingForm"; 
import ForumList from "./ForumList";
import ForumForm from "./ForumForm";
import Footer from "./Footer";







const PerangkatDashboard = () => {
  const [aspirasiList, setAspirasiList] = useState([]);
  const [pollingList, setPollingList] = useState([]);
  const [agendaList, setAgendaList] = useState([]);
  const [pengumumanList, setPengumumanList] = useState([]);

  const [judulAgenda, setJudulAgenda] = useState("");
  const [tanggalAgenda, setTanggalAgenda] = useState("");
  const [isiPengumuman, setIsiPengumuman] = useState("");

  const [tanggapan, setTanggapan] = useState("");
  const [selectedAspirasi, setSelectedAspirasi] = useState(null);

  // Untuk toggle tampilan konten
  const [showAgenda, setShowAgenda] = useState(false);
  const [showPengumuman, setShowPengumuman] = useState(false);
  const [deskripsiAgenda, setDeskripsiAgenda] = useState("");


  // Dummy user, sesuaikan dengan data user asli kamu
  const user = { nama: "Perangkat 1" };

  const token = localStorage.getItem("token");

  const [editPengumuman, setEditPengumuman] = useState(null);
  const [editJudul, setEditJudul] = useState("");
  const [editIsi, setEditIsi] = useState("");

  //polling
  const [showFormPolling, setShowFormPolling] = useState(false);
  const [showPolling, setShowPolling] = useState(false); // 

  // State untuk forum
const [forumThreads, setForumThreads] = useState([]);
const [selectedThread, setSelectedThread] = useState(null);
const [newComment, setNewComment] = useState("");
const [newThreadTitle, setNewThreadTitle] = useState("");
const [newThreadContent, setNewThreadContent] = useState("");
const [showForum, setShowForum] = useState(false);




  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
  if (showForum) getForumData();
}, [showForum]);


  const getData = async () => {
    try {
      const [aspirasiRes, pollingRes, agendaRes, pengumumanRes] = await Promise.all([
        axios.get("http://localhost:3000/api/aspirasi"),
        axios.get("http://localhost:3000/api/polling/aktif"),
        axios.get("http://localhost:3000/api/agenda"),
        axios.get("http://localhost:3000/api/pengumuman"),
      ]);

      setAspirasiList(aspirasiRes.data);
      setPollingList(Array.isArray(pollingRes.data) ? pollingRes.data : []);
      setAgendaList(agendaRes.data);
      setPengumumanList(pengumumanRes.data);
    } catch (err) {
      console.error("Gagal memuat data", err);
    }
  };


  const handleTanggapi = async () => {
    if (!selectedAspirasi) return;
    if (!tanggapan.trim()) {
      alert("Tanggapan tidak boleh kosong");
      return;
    }
    try {
      await axios.post(
        `http://localhost:3000/api/aspirasi/tanggapi/${selectedAspirasi.id}`,
        { isiTanggapan: tanggapan },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Tanggapan berhasil dikirim");
      setTanggapan("");
      setSelectedAspirasi(null);
      getData();
    } catch (err) {
      alert("Gagal mengirim tanggapan");
    }
  };

  const handleTambahAgenda = async () => {
  if (!judulAgenda.trim() || !tanggalAgenda) {
    alert("Judul dan tanggal agenda harus diisi");
    return;
  }
  try {
    await axios.post(
      "http://localhost:3000/api/agenda",
      {
        judul: judulAgenda,
        deskripsi: deskripsiAgenda,
        tanggal: tanggalAgenda,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert("Agenda ditambahkan");
    setJudulAgenda("");
    setDeskripsiAgenda("");
    setTanggalAgenda("");
    getData();
  } catch (err) {
    alert("Gagal menambah agenda");
    console.error(err);
  }
};


  const handleTambahPengumuman = async () => {
    if (!isiPengumuman.trim()) {
      alert("Isi pengumuman tidak boleh kosong");
      return;
    }
    try {
      await axios.post(
        "http://localhost:3000/api/pengumuman",
        { isi: isiPengumuman },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Pengumuman dikirim");
      setIsiPengumuman("");
      getData();
    } catch (err) {
      alert("Gagal menambah pengumuman");
    }
  };
  const handleEditClick = (pengumuman) => {
  setEditPengumuman(pengumuman);
  setEditJudul(pengumuman.judul);
  setEditIsi(pengumuman.isi);
};

const handleEditSubmit = async () => {
  try {
    await axios.put(`http://localhost:3000/api/pengumuman/${editPengumuman.id}`, {
      judul: editJudul,
      isi: editIsi,
      tanggal: new Date(), // update tanggal juga jika perlu
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });

    alert("Pengumuman berhasil diperbarui");
    setEditPengumuman(null);
    getData();
  } catch (err) {
    console.error("Gagal edit pengumuman:", err);
    alert("Gagal memperbarui pengumuman");
  }
};

const handleDelete = async (id) => {
  if (!window.confirm("Yakin ingin menghapus pengumuman ini?")) return;
  try {
    await axios.delete(`http://localhost:3000/api/pengumuman/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    alert("Pengumuman berhasil dihapus");
    getData();
  } catch (err) {
    console.error("Gagal menghapus pengumuman:", err);
    alert("Gagal menghapus");
  }
};

const handleTogglePollingStatus = async (id, newStatus) => {
  try {
    await axios.put(
      `http://localhost:3000/api/polling/${id}`,
      { status: newStatus },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert("Status polling diperbarui");
    getData();
  } catch (err) {
    console.error("Gagal memperbarui status polling:", err);
    alert("Gagal memperbarui status polling");
  }
};

const handleDeletePolling = async (id) => {
  if (!window.confirm("Yakin ingin menghapus polling ini?")) return;
  try {
    await axios.delete(`http://localhost:3000/api/polling/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    alert("Polling dihapus");
    getData();
  } catch (err) {
    console.error("Gagal menghapus polling:", err);
    alert("Gagal menghapus polling");
  }
};

const getForumData = async () => {
  try {
    const res = await axios.get("http://localhost:3000/api/forum", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setForumThreads(res.data);
  } catch (err) {
    console.error("Gagal memuat data forum:", err);
    // fallback kalau mau tetap pakai dummy data:
    setForumThreads([
      {
        id: 1,
        title: "Pembangunan Jalan",
        created_at: "2025-05-29T12:00:00Z",
        comments: [
          { id: 1, isi: "Harus segera diperbaiki", author: "Budi" },
          { id: 2, isi: "Setuju, saya juga sering lewat sana", author: "Sari" },
        ],
      },
    ]);
  }
};





  return (
  <div className="space-y-8 p-4 max-w-4xl mx-auto">
    {/* HEADER */}
    <header className="flex justify-between items-center mb-6">
      <div className="text-lg font-semibold">Halo, {user.nama}</div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            setShowAgenda(false);
            setShowPengumuman(false);
            setShowPolling(false);
            setSelectedAspirasi(null);
            setSelectedThread(null);
            setShowForum(false);
          }}
          className={`px-3 py-1 rounded hover:bg-gray-700 text-white ${
            !showAgenda && !showPengumuman && !showPolling ? "bg-gray-700" : "bg-gray-600"
          }`}
        >
          Aspirasi
        </button>

        <button
          onClick={() => {
            setShowAgenda(true);
            setShowPengumuman(false);
            setShowPolling(false);
            setSelectedAspirasi(null);
            setSelectedThread(null);
            setShowForum(false);
          }}
          className={`px-3 py-1 rounded hover:bg-blue-700 text-white ${
            showAgenda ? "bg-blue-700" : "bg-blue-600"
          }`}
        >
          Agenda
        </button>

        <button
          onClick={() => {
            setShowPengumuman(true);
            setShowAgenda(false);
            setShowPolling(false);
            setSelectedAspirasi(null);
            setSelectedThread(null);
            setShowForum(false);
          }}
          className={`px-3 py-1 rounded hover:bg-purple-700 text-white ${
            showPengumuman ? "bg-purple-700" : "bg-purple-600"
          }`}
        >
          Pengumuman
        </button>

        <button
          onClick={() => {
            setShowPolling(true);
            setShowAgenda(false);
            setShowPengumuman(false);
            setSelectedAspirasi(null);
            setSelectedThread(null);
            setShowForum(false);
          }}
          className={`px-3 py-1 rounded hover:bg-indigo-700 text-white ${
            showPolling ? "bg-indigo-700" : "bg-indigo-600"
          }`}
        >
          Polling
        </button>
        <button 
        onClick={() => {
          setShowForum(true);
          setShowAgenda(false);
          setShowPengumuman(false);
          setShowPolling(false);
          setSelectedAspirasi(null);
          setSelectedThread(null);
        }}
          className={`px-3 py-1 rounded hover:bg-green-700 text-white ${
            showForum ? "bg-green-700" : "bg-green-600"
          }`}
        >
          Forum
        </button>

      </div>
    </header>

    {/* KONTEN DINAMIS */}
    {showAgenda ? (
      <section>
        <h2 className="text-xl font-semibold mb-2">Agenda Desa</h2>

        <div className="mb-3">
          <h4 className="font-semibold mb-1">Tambah Agenda Baru</h4>
          <div className="flex flex-col gap-2 mb-2">
            <input
              type="text"
              placeholder="Judul Agenda"
              value={judulAgenda}
              onChange={(e) => setJudulAgenda(e.target.value)}
              className="border p-2 rounded w-full"
            />
            <textarea
              placeholder="Deskripsi Agenda"
              value={deskripsiAgenda}
              onChange={(e) => setDeskripsiAgenda(e.target.value)}
              className="border p-2 rounded w-full"
            />
            <input
              type="date"
              value={tanggalAgenda}
              onChange={(e) => setTanggalAgenda(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>
          <button
            onClick={handleTambahAgenda}
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
          >
            Tambah Agenda
          </button>
        </div>

        <AgendaList agenda={agendaList} />
      </section>
    ) : showPengumuman ? (
      <section>
        <h2 className="text-xl font-semibold mb-2">Pengumuman</h2>
        <PengumumanForm token={token} onSuccess={getData} />
        <ul className="space-y-4 mt-4">
          {pengumumanList.map((p) => (
            <li key={p.id} className="border p-3 rounded shadow bg-white">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{p.judul}</h3>
                  <p className="text-sm text-gray-600 mb-1">
                    {new Date(p.tanggal).toLocaleDateString()}
                  </p>
                  <p>{p.isi}</p>
                </div>
                <div className="space-x-2 text-sm">
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => handleEditClick(p)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => handleDelete(p.id)}
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {editPengumuman && (
          <section className="bg-yellow-50 border p-4 rounded mt-4">
            <h3 className="font-semibold mb-2">Edit Pengumuman</h3>
            <input
              className="w-full border px-3 py-2 mb-2 rounded"
              placeholder="Judul"
              value={editJudul}
              onChange={(e) => setEditJudul(e.target.value)}
            />
            <textarea
              className="w-full border px-3 py-2 mb-2 rounded"
              placeholder="Isi"
              value={editIsi}
              onChange={(e) => setEditIsi(e.target.value)}
            />
            <div className="flex gap-2">
              <button
                className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                onClick={handleEditSubmit}
              >
                Simpan
              </button>
              <button
                className="bg-gray-400 text-white px-4 py-1 rounded hover:bg-gray-500"
                onClick={() => setEditPengumuman(null)}
              >
                Batal
              </button>
            </div>
          </section>
        )}
      </section>
    ) : showPolling ? (
      <section>
        <h2 className="text-xl font-semibold mb-2">Polling Aktif</h2>

        {showFormPolling && (
          <PollingForm
            token={token}
            onSuccess={() => {
              getData();
              setShowFormPolling(false);
            }}
            onCancel={() => setShowFormPolling(false)}
          />
        )}

        <button
          onClick={() => setShowFormPolling(true)}
          className="mb-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Tambah Polling
        </button>

        <PollingList
          pollingList={pollingList}
          limitToThree={false}
          onToggleStatus={handleTogglePollingStatus}
          onDelete={handleDeletePolling}
        />
      </section>
      ) : showForum ? (
  <section>
    <h2 className="text-xl font-semibold mb-4">Forum Diskusi Warga</h2>

    {/* Form membuat thread baru */}
    <ForumForm onSuccess={getForumData} />


     {/* Daftar thread */}
  {forumThreads.length > 0 ? (
    <ul className="space-y-3">
      {forumThreads.map((thread) => (
        <li
          key={thread.id}
          className="p-3 border rounded cursor-pointer hover:bg-gray-100"
          onClick={() => setSelectedThread(thread)}
        >
          <h4 className="font-semibold">{thread.title}</h4>
          <p className="text-sm text-gray-600">
            {new Date(thread.created_at).toLocaleDateString("id-ID", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p className="text-sm text-gray-600">
            {thread.comments.length} komentar
          </p>
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-gray-600">Belum ada diskusi.</p>
  )}

    {/* Tampilan detail thread */}
    {selectedThread && (
      <div className="mt-6 p-4 border rounded bg-gray-50">
        <h4 className="font-semibold mb-2">{selectedThread.title}</h4>
        <ul className="mb-4">
          {selectedThread.comments.map((c) => (
            <li key={c.id} className="border-b py-2">
              <strong>{c.author}:</strong> {c.isi}
            </li>
          ))}
        </ul>

        <textarea
          placeholder="Tulis komentar..."
          className="w-full border p-2 mb-2 rounded"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <div className="flex gap-2">
          <button
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
            onClick={() => {
              if (!newComment.trim()) return;
              const updated = forumThreads.map((thread) =>
                thread.id === selectedThread.id
                  ? {
                      ...thread,
                      comments: [
                        ...thread.comments,
                        {
                          id: thread.comments.length + 1,
                          isi: newComment,
                          author: user.nama,
                        },
                      ],
                    }
                  : thread
              );
              setForumThreads(updated);
              setNewComment("");
            }}
          >
            Kirim
          </button>
          <button
            className="bg-gray-400 text-white px-4 py-1 rounded hover:bg-gray-500"
            onClick={() => setSelectedThread(null)}
          >
            Kembali
          </button>
        </div>
      </div>
    )}
  </section>

    ) : (
      <>
        <section>
          <h2 className="text-xl font-semibold mb-2">Daftar Aspirasi</h2>
          <AspirasiList
            data={aspirasiList}
            showReportButton={false}
            onTanggapi={(aspirasi) => setSelectedAspirasi(aspirasi)}
            selectedId={selectedAspirasi?.id}
          />
        </section>

        {selectedAspirasi && (
          <section className="border p-4 rounded bg-yellow-50 shadow">
            <h3 className="text-lg font-semibold mb-2">Tanggapi Aspirasi</h3>
            <textarea
              className="w-full border p-2 mb-2 rounded"
              placeholder="Tulis tanggapan..."
              value={tanggapan}
              onChange={(e) => setTanggapan(e.target.value)}
            />
            <div className="flex gap-2">
              <button
                onClick={handleTanggapi}
                className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
              >
                Kirim
              </button>
              <button
                onClick={() => setSelectedAspirasi(null)}
                className="bg-gray-400 text-white px-4 py-1 rounded hover:bg-gray-500"
              >
                Batal
              </button>
            </div>
          </section>
          
        )}
      </>
      
    )}
    <Footer />
  </div>
);
};

export default PerangkatDashboard;
