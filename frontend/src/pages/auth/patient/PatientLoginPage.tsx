import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useNavigate, Link } from "react-router-dom";
import api from "@/apis/axios";
import { FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast";

const patientLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type PatientLoginInput = z.infer<typeof patientLoginSchema>;

const PatientLogin: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PatientLoginInput>({
    resolver: zodResolver(patientLoginSchema),
  });

  const onSubmit = async (data: PatientLoginInput) => {
    try {
      const response = await api.post("/api/user/login", data, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      const { token, user } = response.data;
      if (!user || !user._id) throw new Error("Invalid user data received");

      localStorage.setItem("patientToken", token);
      localStorage.setItem("patientData", JSON.stringify(user));

      navigate(`/patient-dashboard/${user._id}`)
      window.location.reload()
      toast.success("Logged in successfully!");
      
      
    } catch (error: any) {
      console.error("Login failed:", error);
      toast.error(error.response?.data?.message || "Login failed!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-100 to-blue-200 p-8">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl flex flex-col md:flex-row overflow-hidden">
        
        <div className="md:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-500 text-white flex flex-col justify-center items-start p-10 space-y-6">
          <h1 className="text-4xl font-bold leading-tight">
            Welcome Back to <span className="text-yellow-300">MindEase</span>
          </h1>
          <p className="text-lg opacity-90">
            Your mental wellness journey continues here.  
            Log in to reconnect with your counselor, explore mindfulness tools, and track your emotional growth.
          </p>
          <ul className="space-y-2 text-sm text-blue-50">
            <li>✔ Confidential & Secure Access</li>
            <li>✔ 24/7 Emotional Support</li>
            <li>✔ Guided Self-Care Tools</li>
          </ul>
        </div>

        <div className="md:w-1/2 p-8 flex justify-center items-center">
          <Card className="w-full max-w-md shadow-none border-none">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold text-blue-700">
                Patient Login
              </CardTitle>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    {...register("email")}
                    type="email"
                    placeholder="Enter your email"
                    className="focus:ring-2 focus:ring-blue-400"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email.message}</p>
                  )}
                </div>

                <div className="relative">
                  <label className="text-sm font-medium">Password</label>
                  <Input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="focus:ring-2 focus:ring-blue-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <FiEye size={20} className="text-black" />
                    ) : (
                      <FiEyeOff size={20} className="text-black" />
                    )}
                  </button>
                  {errors.password && (
                    <p className="text-red-500 text-sm">{errors.password.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Logging in..." : "Login"}
                </Button>

                <p className="text-sm text-center mt-3">
                  Don’t have an account?{" "}
                  <Link to="/patient-register" className="text-blue-600 hover:underline">
                    Register here
                  </Link>
                </p>

                <p className="text-center text-sm mt-2">
                  <Link to="/counselor-forgotpassword" className="text-blue-600 hover:underline">
                    Forgot password ?
                  </Link>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PatientLogin;
