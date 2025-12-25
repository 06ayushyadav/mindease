import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { counselorRegisterSchema } from "../../../../../shared/schemas/counselor.schema";
import type { CounselorRegisterInput } from "../../../../../shared/schemas/counselor.schema";
import api from "@/apis/axios";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi";

const CounselorRegister: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CounselorRegisterInput>({
    resolver: zodResolver(counselorRegisterSchema as unknown as any),
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      age: 0,
      gender: "male",
      country: "",
      password: "",
      confirmPassword: "",
      isAccepted: false,
    },
  });

  const onSubmit = async (data: CounselorRegisterInput) => {
    try {
      const response = await api.post(`/api/counselor/register`, data, {
        headers: { "Content-Type": "application/json" },
      });
      console.log(response.data);
      toast.success("Account Created Successfully!");
      navigate(`/counselor-login`);
    } catch (error: any) {
      console.log("Counselor register error:", error);
      toast.error(error.response?.data?.message || "Registration failed!");
    } finally {
      reset();
    }
  };

  return (
    <div className="flex flex-col rounded-2xl bg-cyan-50 md:flex-row min-h-screen py-5 px-30">
      <div className="md:w-1/2 w-full flex rounded-2xl flex-col justify-center items-center p-10 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-md text-left space-y-6">
          <h1 className="text-4xl font-extrabold leading-snug">
            Join <span className="text-yellow-300">MindEase</span>
          </h1>
          <p className="text-lg opacity-90">
            Be part of a compassionate counselor community. Empower individuals
            through empathy, expertise, and care.
          </p>
          <ul className="space-y-2 text-sm text-left w-fit">
            <li>✔ Help people find peace and confidence</li>
            <li>✔ Work with verified clients confidentially</li>
            <li>✔ Grow your practice on a trusted platform</li>
          </ul>
        </div>
      </div>

      <div className="md:w-1/2 w-full flex justify-center items-center bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-10 border border-gray-100">
          <div className="flex justify-end mb-3">
            <Link to="/">
              <Button className="px-6 py-2 text-lg rounded-full shadow-md bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-105 transition">
                Go Home
              </Button>
            </Link>
          </div>

          <h2 className="text-3xl font-bold text-center text-blue-700 mb-8">
            Counselor Registration
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: "First Name", name: "firstName" },
                { label: "Middle Name", name: "middleName" },
                { label: "Last Name", name: "lastName" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                  </label>
                  <input
                    type="text"
                    {...register(field.name as keyof CounselorRegisterInput)}
                    className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
                  />
                  {errors[field.name] && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors[field.name]?.message}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Email
                </label>
                <input
                  type="email"
                  {...register("email")}
                  placeholder="Enter your email"
                  className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Age
                </label>
                <input
                  type="number"
                  {...register("age", { valueAsNumber: true })}
                  className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
                />
                {errors.age && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.age.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                {...register("gender")}
                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.gender.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <input
                type="text"
                placeholder="India"
                {...register("country", {
                  setValueAs: (value) => value?.toLowerCase().trim(),
                })}
                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
              />
              {errors.country && (
                <p className="text-red-500 text-sm mt-1">
                  Enter your country name 
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Password */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <FiEye size={20} /> : <FiEyeOff size={20} />}
                </button>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type={showConfirm ? "text" : "password"}
                  {...register("confirmPassword")}
                  className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((prev) => !prev)}
                  className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                >
                  {showConfirm ? <FiEye size={20} /> : <FiEyeOff size={20} />}
                </button>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register("isAccepted")}
                className="w-4 h-4 accent-blue-600"
              />
              <span className="text-gray-700 text-sm">
                I accept the{" "}
                <span className="text-blue-600 hover:underline cursor-pointer">
                  Terms & Conditions
                </span>
              </span>
            </div>
            {errors.isAccepted && (
              <p className="text-red-500 text-sm">
                {errors.isAccepted.message}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            >
              {isSubmitting ? "Registering..." : "Register"}
            </button>

            <p className="text-center text-sm text-gray-700 mt-4">
              Already have an account?{" "}
              <Link
                to="/counselor-login"
                className="text-blue-600 font-medium hover:underline"
              >
                Login here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CounselorRegister;
