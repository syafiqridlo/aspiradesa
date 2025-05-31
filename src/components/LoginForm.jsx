import React, { useState } from "react";
import axios from "axios";
import Footer from "./Footer";


const LoginForm = ({ onLogin }) => {
  const [form, setForm] = useState({ nik: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");
  try {
    const res = await axios.post("http://localhost:3000/api/auth/login", form);
    console.log("Response login:", res.data); // Log the response to check its structure
    const { user, token } = res.data;

    if (!user || !user.role) {
      console.error("User or role is missing in the response data");
      setError("Login failed: User or role is missing");
      return;
    }

    localStorage.setItem("token", token);
    onLogin(user, token);

  } catch (err) {
    console.error("❌ Login error:", err.response?.data || err.message);
    setError(err.response?.data?.error || "Login gagal. Periksa NIK dan password.");
  } finally {
    setLoading(false);
  }
};


  return (
    <>
    <form onSubmit={handleSubmit} className="max-w-md mx-auto py-10 space-y-4">
      <h2 className="text-xl font-bold mb-2">Login</h2>
      <p>Masukkan NIK</p>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <input
        name="nik"
        type="text"
        placeholder="NIK"
        className="w-full p-2 border border-gray-300 rounded"
        value={form.nik}
        onChange={handleChange}
        required
      />
      <p>Masukkan Password</p>
      <input
        name="password"
        type="password"
        placeholder="Password"
        className="w-full p-2 border border-gray-300 rounded"
        value={form.password}
        onChange={handleChange}
        required
      />
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Memproses..." : "Login"}
      </button>
    </form>
    <Footer /></>
  );
  
};

export default LoginForm;
