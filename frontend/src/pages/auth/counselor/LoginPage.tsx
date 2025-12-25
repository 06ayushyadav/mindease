import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "@/apis/axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi";

const counselorLoginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type CounselorLoginInput = z.infer<typeof counselorLoginSchema>;

const CounselorLogin: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);


  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CounselorLoginInput>({
    resolver: zodResolver(counselorLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: CounselorLoginInput) => {
    try {
      const response = await api.post("/api/counselor/login", data, {
        headers: { "Content-Type": "application/json" }
      })

      const { token, counselor } = response.data

      localStorage.setItem("counselorToken", token)
      localStorage.setItem("counselorData", JSON.stringify(counselor))

      toast.success("Logedin Succesfully !")
      navigate(`/counselor/dashboard/${counselor._id}`)
      window.location.reload();

    } catch (error) {
      console.log("Login failed", error)
      toast.error("Login failed", error)
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen p-20 bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-100">
      <div className="md:w-1/2 w-full flex flex-col justify-center items-start p-12 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl md:rounded-l-2xl shadow-xl space-y-6">
        <h1 className="text-4xl font-extrabold leading-snug">
          Empower Minds with <span className="text-yellow-300">MindEase</span>
        </h1>
        <p className="text-lg opacity-90">
          Join our mission to make mental wellness accessible and stigma-free.
          Support users through empathy, expertise, and secure digital care.
        </p>
        <ul className="space-y-2 text-sm">
          <li>✔ Help individuals find mental peace</li>
          <li>✔ Offer confidential professional support</li>
          <li>✔ Be part of a compassionate counselor community</li>
        </ul>
      </div>

      <div className="md:w-1/2 w-full flex items-center justify-center">
        <div className="w-full max-w-3xl bg-white p-10 rounded-2xl shadow-2xl border border-gray-100">
          <div className="flex justify-end mb-3">
            <Link to="/">
              <button className="px-6 py-2 text-lg rounded-2xl shadow-md bg-blue-600 hover:bg-blue-700 text-white transition transform hover:scale-105">
                Go Home
              </button>
            </Link>
          </div>

          <h2 className="text-3xl font-bold text-center text-blue-700 mb-8">
            Counselor Login
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                {...register("email")}
                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div className="relative">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...register("password")}
                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <FiEye size={20} /> : <FiEyeOff size={20} />}
              </button>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </form>
          <p className="text-sm text-center mt-3 text-gray-700">
            Don't have an account?{" "}
            <Link to="/counselor/register" className="text-blue-600 hover:underline">
              Register here
            </Link>
          </p>
          <p className="text-center text-sm mt-2">
            <Link to="/forgate-password" className="text-blue-600 hover:underline">
              Forgot password?
            </Link>
          </p>
        </div>
      </div>
    </div>
    
  );
};

export default CounselorLogin;