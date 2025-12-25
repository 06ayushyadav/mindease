
import { useEffect, useState } from "react";
import api from "@/apis/axios";
import AdminLayout from "../../components/admin/AdminLayout";
import Analysis from "@/components/admin/monitor/Analysis";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCounselors: 0,
    totalSessions: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const response = await api.get("/api/admin/stats");
      setStats(response.data.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <p className="text-center text-gray-600 mt-8">Loading dashboard...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      
        <Analysis/>
      
    </AdminLayout>
  );
};

export default AdminDashboard;
