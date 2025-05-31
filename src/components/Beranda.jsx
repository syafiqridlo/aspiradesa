//src/components/beranda.jsx
import React from "react";
import AspirasiList from "./AspirasiList";
import PollingList from "./PollingList";
import PropTypes from "prop-types";

function Beranda({
  user = null,
  totalAspirasi = 0,
  totalPengguna = 0,
  pollingAktif = false,
  onAspirasiClick = () => {},
  onPollingClick = () => {},
  data = [],
  pollingList = [],
}) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-bold text-blue-700 mb-2">
        Selamat datang di Aspira Desa!
      </h1>
      <p className="text-gray-700 mb-4">
        {user ? `Halo, ${user.nama}!` : "Silakan login untuk berpartisipasi."}
        Ini adalah platform partisipatif untuk menyampaikan aspirasi, mengikuti polling, dan berinteraksi demi kemajuan desa kita.
      </p>

      {/* Statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center my-6">
        <div className="bg-blue-50 p-4 rounded">
          <h2 className="text-xl font-bold text-blue-600">{totalAspirasi}</h2>
          <p className="text-sm text-gray-600">Aspirasi</p>
        </div>
        <div className="bg-blue-50 p-4 rounded">
          <h2 className="text-xl font-bold text-blue-600">{totalPengguna}</h2>
          <p className="text-sm text-gray-600">Pengguna Aktif</p>
        </div>
        <div className="bg-blue-50 p-4 rounded">
          <h2 className="text-xl font-bold text-blue-600">
            {pollingList.filter((p) => p.status === "aktif").length}
          </h2>
          <p className="text-sm text-gray-600">Polling Aktif</p>
        </div>
      </div>

     

      {/* Aspirasi Terbaru */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-blue-700 mb-4">
          Aspirasi Terbaru
        </h3>
        {Array.isArray(data) && data.length > 0 ? (
          <AspirasiList data={data.slice(0, 3)} showReportButton={false} />
        ) : (
          <p className="text-gray-600">Belum ada aspirasi yang masuk.</p>
        )}
      </div>

      {/* Polling Terbaru */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-green-700 mb-4">
          Polling Terbaru
        </h3>
        {Array.isArray(pollingList) && pollingList.length > 0 ? (
          <PollingList pollingList={pollingList} limitToThree={true} />
        ) : (
          <p className="text-gray-600">Belum ada polling aktif.</p>
        )}
      </div>
    </div>
  );
}

Beranda.propTypes = {
  user: PropTypes.object,
  totalAspirasi: PropTypes.number,
  totalPengguna: PropTypes.number,
  pollingAktif: PropTypes.bool,
  onAspirasiClick: PropTypes.func,
  onPollingClick: PropTypes.func,
  data: PropTypes.array,
  pollingList: PropTypes.array,
};

export default Beranda;
