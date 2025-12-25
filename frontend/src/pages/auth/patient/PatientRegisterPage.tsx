import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userRegisterSchema } from "../../../../../shared/schemas/user.schema";
import type { UserRegisterInput } from "../../../../../shared/schemas/user.schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate, Link } from "react-router-dom";
import api from "@/apis/axios";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi";

const PatientRegister: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
  } = useForm<UserRegisterInput>({
    resolver: zodResolver(userRegisterSchema),
    defaultValues: {
      gender: "male",
      isAccepted: false,
    },
  });

  const onSubmit = async (data: UserRegisterInput) => {
    try {
      const response = await api.post(`/api/user/register`, data, {
        headers: { "Content-Type": "application/json" },
      });
      const { token, user } = response.data;
      localStorage.setItem("userToken", token);
      localStorage.setItem("userData", JSON.stringify(user));
      toast.success("You are Registered Successfully!");
      navigate(`/patient-dashboard/${user._id}`);
    } catch (error: any) {
      console.log("Patient register error:", error);
      toast.error(error.response?.data?.message || "Registration failed!");
    } finally {
      reset();
    }
  };

  return (
    <div className="max-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-100 to-blue-200 p-10">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl flex flex-col md:flex-row overflow-hidden">
        <div className="md:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-500 text-white flex flex-col justify-center items-start p-10 space-y-6">
          <h1 className="text-4xl font-bold leading-tight">
            Welcome to <span className="text-yellow-300">MindEase</span>
          </h1>
          <p className="text-lg opacity-90">
            Join a compassionate community that values your mental well-being.
            Take the first step towards a healthier mind and a happier life.
          </p>
          <ul className="space-y-2 text-sm text-blue-50">
            <li>✔ Confidential & Safe Platform</li>
            <li>✔ Connect with Certified Counselors</li>
            <li>✔ 24/7 AI Support for Instant Help</li>
          </ul>
        </div>

        <div className="md:w-1/2 p-8 flex justify-center items-center">
          <Card className="w-full max-w-md shadow-none border-none">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold text-blue-700">
                Create Your Account
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Username</label>
                  <Input
                    {...register("userName")}
                    placeholder="Enter your name"
                  />
                  {errors.userName && (
                    <p className="text-red-500 text-sm">
                      {errors.userName.message}
                    </p>
                  )}
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      {...register("email")}
                      type="email"
                      placeholder="Enter your email"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <div className="w-1/3">
                    <label className="text-sm font-medium">Age</label>
                    <Input
                      {...register("age", { valueAsNumber: true })}
                      type="number"
                      placeholder="Age"
                    />
                    {errors.age && (
                      <p className="text-red-500 text-sm">
                        {errors.age.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Country</label>
                    <Input
                      {...register("country",{
                        setValueAs:(value)=>value?.toLowerCase().trim()
                      })}
                      placeholder="Enter your country"
                    />
                    {errors.country && (
                      <p className="text-red-500 text-sm">
                        Enter your country name 
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium">Gender</label>
                    <Select
                      onValueChange={(val) =>
                        setValue("gender", val as "male" | "female" | "other")
                      }
                      defaultValue="male"
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.gender && (
                      <p className="text-red-500 text-sm">
                        {errors.gender.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <label className="text-sm font-medium">Password</label>
                    <Input
                      {...register("password")}
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
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
                      <p className="text-red-500 text-sm">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  <div className="relative">
                    <label className="text-sm font-medium">
                      Confirm Password
                    </label>
                    <Input
                      {...register("confirmPassword")}
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Re-enter password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? (
                        <FiEye size={20} className="text-black" />
                      ) : (
                        <FiEyeOff size={20} className="text-black" />
                      )}
                    </button>
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-sm">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 mt-3">
                  <Checkbox
                    id="isAccepted"
                    onCheckedChange={(checked) =>
                      setValue("isAccepted", checked as boolean)
                    }
                  />
                  <label htmlFor="isAccepted" className="text-sm">
                    I accept the{" "}
                    <span className="text-blue-600 hover:underline">
                      Terms & Conditions
                    </span>
                  </label>
                </div>
                {errors.isAccepted && (
                  <p className="text-red-500 text-sm">
                    {errors.isAccepted.message}
                  </p>
                )}

                <Button
                  type="submit"
                  className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Registering..." : "Register"}
                </Button>

                <p className="text-sm text-center mt-3">
                  Already have an account?{" "}
                  <Link
                    to="/patient-login"
                    className="text-blue-600 hover:underline"
                  >
                    Login here
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

export default PatientRegister;
