import { Link, useNavigate } from "react-router-dom";
import api from "@/apis/axios";

const Sidebar = () => {
  const storeAdmin=localStorage.getItem("adminData")
  const admin=storeAdmin ? JSON.parse(storeAdmin):null;
  console.log(admin)
  const adminId=admin?._id 

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post(`/api/admin/admin-logout`)
    } catch (error) {
      console.error(error);
    } finally {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminData");
      navigate("/admin-login");
    }
  }

  return (
    <div className="w-64 bg-blue-900 text-white flex flex-col p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">MindEase Admin</h2>

      <nav className="flex flex-col gap-3">
        <Link to={`/admin/dashboard/${adminId}`} className="hover:bg-blue-800 p-2 rounded">📊 Dashboard</Link>
        <Link to="/admin/manage-counselors" className="hover:bg-blue-800 p-2 rounded">🧠 Counselors</Link>
        <Link to="/admin/manage-content" className="hover:bg-blue-800 p-2 rounded">🧾 Manage Content</Link>
        
        <Link to="/admin-login" onClick={handleLogout} className="hover:bg-blue-800 p-2 rounded mt-auto">🚪 Logout</Link>
        
      </nav>
    </div>
  );
};

export default Sidebar;
