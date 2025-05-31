//src/main/jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// ✅ Tambahkan ini untuk register firebase-messaging-sw.js
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/firebase-messaging-sw.js')
      .then((registration) => {
        console.log('✅ Service Worker terdaftar:', registration);
      })
      .catch((error) => {
        console.error('❌ Gagal mendaftar Service Worker:', error);
      });
  });
}
