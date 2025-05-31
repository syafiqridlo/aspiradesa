// src/components/LandingPage.jsx
import React from "react";

function LandingPage({ onLoginClick }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-300 flex flex-col items-center justify-center text-center px-4">
      <img src="/logo.png" alt="Logo Aspira Desa" className="w-20 mb-4" />
      <h1 className="text-4xl font-bold text-blue-800 mb-2">
        Selamat Datang di Aspira Desa
      </h1>
      <p className="text-gray-700 max-w-xl mb-6">
        Sebuah platform digital untuk menampung aspirasi, mengadakan polling, dan membangun komunikasi terbuka antar warga desa.
      </p>
      <button
        onClick={onLoginClick}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 mb-4"
      >
        Masuk Sekarang
      </button>

      {/* Tulisan di bawah tombol */}
      <div className="text-gray-600 text-sm space-y-1">
        <p>Prototype Capstone Project - Kelompok D</p>
        <p>ALIF DIASTIANTO, MUHAMAD SYAFIQ RIDLO, RONNY FEBRIANTO, RUDI FAISAL PULUNGAN</p>
        <p>&copy; {new Date().getFullYear()} Aspira Desa</p>
      </div>
    </div>
  );
}

export default LandingPage;
