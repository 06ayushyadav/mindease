
import { useEffect, useState } from "react";
import api from "@/apis/axios";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";

const COLORS = ["#4F46E5", "#F59E0B"];

const Analysis = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalysis = async () => {
    try {
      const response = await api.get("/api/admin/analysis");
      console.log("Analysis Data:", response.data.data);
      setStats(response.data.data);
    } catch (error) {
      console.error("Error fetching analysis:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis();
  }, []);

  if (loading || !stats) {
    return <p className="text-center mt-6 text-gray-600">Loading analysis...</p>;
  }

  const monthlyData =
    stats?.monthlyUsers?.map((u: any, i: number) => ({
      month: u.month || `Month ${i + 1}`,
      users: u.users || 0,
      sessions: stats?.monthlySessions?.[i]?.sessions || 0,
    })) || [];

  const counselorPieData = [
    { name: "Approved", value: stats?.counselorStatus?.approved || 0 },
    { name: "Pending", value: stats?.counselorStatus?.pending || 0 },
    { name: "Cancelled", value: stats?.counselorStatus?.pending || 0 },
  ];

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">MindEase Analytics Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h3 className="text-gray-500 text-sm">Total Users</h3>
          <p className="text-3xl font-bold text-blue-700">{stats.totalUsers || 0}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h3 className="text-gray-500 text-sm">Total Counselors</h3>
          <p className="text-3xl font-bold text-blue-700">{stats.totalCounselors || 0}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h3 className="text-gray-500 text-sm">Total Sessions</h3>
          <p className="text-3xl font-bold text-blue-700">{stats.totalSessions || 0}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Monthly Growth (Users & Sessions)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="users" fill="#4F46E5" />
            <Bar dataKey="sessions" fill="#22C55E" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Counselor Approval Status</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              dataKey="value"
              data={counselorPieData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {COLORS.map((color, index) => (
                <Cell key={`cell-${index}`} fill={color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div> */}
    </div>
  );
};

export default Analysis;
