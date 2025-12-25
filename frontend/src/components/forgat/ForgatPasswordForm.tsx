import { useState } from "react";
import api from "@/apis/axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await api.post(
        `/api/auth/forgot-password`,
        { email }
      );
      setMessage(res.data.message || "If this email exists, reset link has been sent.");
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-indigo-700 mb-4">Forgot Password</h2>
        <p className="text-slate-600 mb-6 text-sm">
          Enter your registered email to receive a password reset link.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="w-full border border-slate-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {message && <p className="mt-4 text-sm text-slate-600 text-center">{message}</p>}
      </div>
    </div>
  );
}
