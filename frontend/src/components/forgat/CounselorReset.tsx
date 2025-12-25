import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import api from "@/apis/axios";


export default function CounselorReset() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const token = new URLSearchParams(location.search).get("token");
      console.log(token)

      const res = await api.post("/api/auth/counselor-reset", {
        token,
        newPassword,
        confirmPassword
      });

      setMessage(res.data.message || "Password reset successful!");
      setTimeout(() => navigate("/counselor-login"), 2000);
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        setMessage(error.response?.data?.message || error.message);
      } else if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage(String(error));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-indigo-700 mb-4">Reset Password</h2>
        <p className="text-slate-600 mb-6 text-sm">
          Enter your new password to reset your account.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New Password"
            className="w-full border border-slate-300 rounded-lg p-2 mb-3 focus:ring-2 focus:ring-indigo-500"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full border border-slate-300 rounded-lg p-2 mb-4 focus:ring-2 focus:ring-indigo-500"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-sm text-center text-slate-600">{message}</p>
        )}
      </div>
    </div>
  );
}