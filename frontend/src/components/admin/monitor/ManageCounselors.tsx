
import { useEffect, useState } from "react";
import api from "@/apis/axios"; 
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

type Status = "Approved" | "Pending" | "Cancelled";

const ManageCounselors = () => {
  const [counselors, setCounselors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCounselors = async () => {
    try {
      const response = await api.get("/api/counselor-booking/profile");
      console.log("All Counselors:", response.data);
      setCounselors(response.data.data);
    } catch (error) {
      console.error("Error fetching counselors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCounselors();
  }, []);

  const handleStatusChange = async (id: string, currentStatus: Status) => {
    let newStatus: Status;

    if (currentStatus === "Approved") newStatus = "Pending";
    else if (currentStatus === "Pending") newStatus = "Approved";
    else return; 

    try {
      
      await api.patch(`/api/counselor-booking/update-status/${id}`, { status: newStatus });

      setCounselors((prev) =>
        prev.map((c) => (c._id === id ? { ...c, status: newStatus } : c))
      );

      alert(`Counselor status changed to ${newStatus}`);
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Something went wrong while updating status.");
    }
  };

  const handleCancel = async (id: string) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this counselor?");
    if (!confirmCancel) return;

    try {

      await api.patch(`/api/counselor-booking/update-status/${id}`, { status: "Cancelled" });


      setCounselors((prev) => prev.filter((c) => c._id !== id));

      alert("Counselor has been cancelled and removed");
    } catch (error) {
      console.error("Failed to cancel counselor:", error);
      alert("Something went wrong while cancelling.");
    }
  };

  if (loading) return <p className="text-center mt-4">Loading counselors...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Counselors</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {counselors.length > 0 ? (
          counselors.map((counselor) => (
            <div
              key={counselor._id}
              className="bg-white rounded-lg shadow-md p-4 border"
            >
              <div className="flex justify-between">
                <h2 className="text-lg font-semibold text-gray-800">{counselor.name}</h2>
                <Link to={`/doctors/doctor-booking/${counselor._id}`}>
                  <span className="text-sm text-blue-500 hover:underline">Details</span>
                </Link>
              </div>
              <p className="text-gray-600 text-sm">{counselor.specialization}</p>
              <p className="text-gray-500 text-sm mt-1">Experience: {counselor.experience} years</p>
              <p className="text-gray-500 text-sm">Fees: ₹{counselor.fees}</p>

              <div className="flex gap-2 mt-2">

                {counselor.status !== "Cancelled" && (
                  <Button
                    onClick={() => handleStatusChange(counselor._id, counselor.status)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      counselor.status === "Approved"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {counselor.status}
                  </Button>
                )}
                {counselor.status !== "Cancelled" && (
                  <Button
                    onClick={() => handleCancel(counselor._id)}
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No counselors found.</p>
        )}
      </div>
    </div>
  );
};

export default ManageCounselors;
