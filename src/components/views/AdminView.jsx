// src/components/views/AdminView.jsx
import React from "react";
import AdminDashboard from "../AdminDashboard";
import AddUserForm from "../AddUserForm";
import PollingForm from "../PollingForm";
import ReportedAspirasiList from "../ReportedAspirasiList";

const AdminView = ({
  user,
  token,
  pollingList,
  jumlahPollingAktif,
  showAddUserForm,
  showAddPollingForm,
  setShowAddUserForm,
  setShowAddPollingForm,
  handleLogout,
  handleDeletePolling,
  handleChangeStatus,
  fetchPollingList,
  showAllUserForm,
  setShowAllUserForm,
  showAspirasiListForm,
  setShowAspirasiListForm,
}) => (
  <div className="max-w-7xl mx-auto p-4">
    <div className="bg-blue-600 text-white px-4 py-3 rounded mb-6 shadow flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <img src="/logo.png" alt="Logo" className="h-8 w-8" />
        <span className="font-bold text-lg">Aspira Desa - Admin</span>
      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setShowAllUserForm(!showAllUserForm)}
          className="bg-indigo-500 hover:bg-green-600 text-white text-sm px-3 py-1 rounded shadow"
        >
          {showAllUserForm ? "Tutup Form" : "Semua User"}
        </button>
        <button
          onClick={() => setShowAspirasiListForm(!showAspirasiListForm)}
          className="bg-indigo-500 hover:bg-green-600 text-white text-sm px-3 py-1 rounded shadow"
        >
          {showAspirasiListForm ? "Tutup Form" : "Tampilkan Aspirasi"}
        </button>
        <button
          onClick={() => setShowAddUserForm(!showAddUserForm)}
          className="bg-indigo-500 hover:bg-green-600 text-white text-sm px-3 py-1 rounded shadow"
        >
          {showAddUserForm ? "Tutup Form" : "+ Tambah User"}
        </button>
        <button
          onClick={() => setShowAddPollingForm(!showAddPollingForm)}
          className="bg-indigo-500 hover:bg-green-600 text-white text-sm px-3 py-1 rounded shadow"
        >
          {showAddPollingForm ? "Tutup Polling" : "+ Tambah Polling"}
        </button>
        <span className="text-sm">👤 Admin {user.nama}</span>
        <button
          onClick={handleLogout}
          className="text-red-200 hover:underline text-sm cursor-pointer"
        >
          Logout
        </button>
      </div>
    </div>

    <AdminDashboard
      user={user}
      token={token}
      showAllUserForm={showAllUserForm}
      showAspirasiListForm={showAspirasiListForm}
    />
    {showAspirasiListForm && <ReportedAspirasiList token={token} />}

    <div className="my-4">
      <p className="text-sm text-gray-700">
        📊 <strong>{jumlahPollingAktif}</strong> Polling sedang aktif
      </p>
    </div>

    {showAddUserForm && <AddUserForm token={token} />}

    {showAddPollingForm && (
      <PollingForm
        token={token}
        onSuccess={() => {
          setShowAddPollingForm(false);
          fetchPollingList(); // refresh list polling
        }}
        onCancel={() => setShowAddPollingForm(false)}
      />
    )}

    <div className="mt-6 bg-white shadow rounded p-4">
      <h2 className="text-lg font-semibold mb-3">Daftar Polling</h2>
      {pollingList.length === 0 ? (
        <p className="text-gray-500">Belum ada polling.</p>
      ) : (
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-left">ID</th>
              <th className="border px-4 py-2 text-left">Judul</th>
              <th className="border px-4 py-2 text-left">Status</th>
              <th className="border px-4 py-2 text-left">Setuju</th>
              <th className="border px-4 py-2 text-left">Tidak Setuju</th>
              <th className="border px-4 py-2 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {pollingList.map(({ id, judul, status, setuju, tidakSetuju }) => (
              <tr key={id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{id}</td>
                <td className="border px-4 py-2">{judul}</td>
                <td className="border px-4 py-2 capitalize">{status}</td>
                <td className="border px-4 py-2">{setuju || 0}</td>
                <td className="border px-4 py-2">{tidakSetuju || 0}</td>
                <td className="border px-4 py-2">
                  <button
                    className="text-blue-500 mr-2 cursor-pointer"
                    onClick={() =>
                      handleChangeStatus(id, status === "aktif" ? "nonaktif" : "aktif")
                    }
                  >
                    {status === "aktif" ? "Nonaktifkan" : "Aktifkan"}
                  </button>
                  <button
                    className="text-red-500 cursor-pointer"
                    onClick={() => handleDeletePolling(id)}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  </div>
);

export default AdminView;
