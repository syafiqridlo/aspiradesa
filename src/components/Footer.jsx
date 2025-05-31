import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-center text-sm text-gray-600 dark:text-gray-400 py-4 mt-10">
      <p>Prototype Capstone Project - Kelompok D</p>
      <p>ALIF DIASTIANTO, MUHAMAD SYAFIQ RIDLO, RONNY FEBRIANTO, RUDI FAISAL PULUNGAN</p>
      <p>&copy; {new Date().getFullYear()} Aspira Desa</p>
    </footer>
  );
};

export default Footer;
