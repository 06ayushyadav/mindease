import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import api from "@/apis/axios";

const adminRegisterSchema = z.object({
  name: z.string().min(3, "Full name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  role: z.enum(["admin"], { required_error: "Role is required" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type AdminRegisterInput = z.infer<typeof adminRegisterSchema>;

const AdminRegister: React.FC = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminRegisterInput>({
    resolver: zodResolver(adminRegisterSchema),
    defaultValues: { role: "admin" }, // default role
  });

  const onSubmit = async (data: AdminRegisterInput) => {
    try {
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role, // send role to backend
      };

      const response = await api.post("/api/admin/admin-register", payload, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("Admin registered:", response.data);

      navigate("/admin-login");
    } catch (error: any) {
      console.log("Admin register error:", error);
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-100 p-6">
  <div className="md:w-1/2 w-full flex flex-col justify-center p-12  bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl md:rounded-l-2xl shadow-xl space-y-6">
    <h1 className="text-4xl font-extrabold leading-snug">
      Manage Efficiently with <span className="text-yellow-300">MindEase Admin</span>
    </h1>
    <p className="text-lg opacity-90">
      Admins can monitor counselors, manage users, and maintain the platform efficiently.
      Ensure data security, review registrations, and control platform content seamlessly.
    </p>
    <ul className="space-y-2 text-sm">
      <li>✔ Secure and centralized platform management</li>
      <li>✔ Approve counselors and monitor sessions</li>
      <li>✔ View analytics and user engagement</li>
      <li>✔ Maintain confidentiality and data privacy</li>
    </ul>
  </div>

  <div className="md:w-1/2 w-full flex items-center justify-center h-[600px] ">
    <div className="w-full max-w-3xl bg-white p-10 rounded-2xl shadow-2xl border border-gray-100">
      <h2 className="text-3xl font-bold text-center text-blue-700 mb-8">
        Admin Registration
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="text-sm font-medium text-gray-700">Full Name</label>
          <Input {...register("name")} placeholder="Enter your full name" className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Email</label>
          <Input {...register("email")} type="email" placeholder="Enter email" className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Password</label>
          <Input {...register("password")} type="password" placeholder="Enter password" className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Confirm Password</label>
          <Input {...register("confirmPassword")} type="password" placeholder="Confirm password" className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
          {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
        </div>

        <input type="hidden" {...register("role")} value="admin" />

        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition duration-200"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Registering..." : "Register"}
        </Button>

        <p className="text-sm text-center mt-3 text-gray-700">
          Already have an account?{" "}
          <Link to="/admin-login" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </p>
      </form>
    </div>
  </div>
</div>

  );
};

export default AdminRegister;
