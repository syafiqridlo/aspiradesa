//src/components/views/perangkatdesa.jsx
import React from "react";
import PerangkatDashboard from "../PerangkatDashboard"; // ✅ path sudah benar

const PerangkatDesaView = ({ user, token, handleLogout }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-green-600 text-white p-4 flex justify-between items-center shadow">
        <div className="flex items-center space-x-3">
          <img src="/logo.png" alt="Logo" className="h-8 w-8" />
          <h1 className="font-bold text-lg">Aspira Desa - Perangkat Desa</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span>👤 {user.nama}</span>
          <button
            onClick={handleLogout}
            className="text-red-200 hover:underline text-sm"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Body */}
      <main className="p-4 max-w-5xl mx-auto">
        <PerangkatDashboard token={token} />
      </main>
    </div>
  );
};

export default PerangkatDesaView;
