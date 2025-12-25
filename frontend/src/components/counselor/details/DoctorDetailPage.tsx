import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "@/apis/axios";
import { Button } from "@/components/ui/button";

interface Doctor {
  _id: string;
  name: string;
  qualification: string;
  specialization: string;
  experience: string;
  bio: string;
  fees: number;
  bookingTime: string;
  image: string;
  certificate: string;
}

const DoctorDetailPage: React.FC = () => {
  const { doctorId } = useParams<{ doctorId: string }>();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);


const fetchDoctor = async () => {
  try {
    if (!doctorId) return;
    const res = await api.get(`/api/counselor-booking/my-profile/${doctorId}`);
    setDoctor(res.data.data);
  } catch (error) {
    console.error("Error fetching doctor:", error);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchDoctor();
  }, [doctorId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50">
        <p className="text-lg text-gray-600 animate-pulse">Loading doctor details...</p>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50">
        <p className="text-lg text-red-600">Doctor not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 py-7 px-6">

      <div className="text-center mb-10">
        <h3 className="text-4xl font-extrabold text-blue-900 mb-1 tracking-wide">
          Meet Your Counselor
        </h3>
        <p className="text-blue-700 text-lg md:text-xl">
          Professional guidance for your mental wellness journey
        </p>
      </div>

      <div className="bg-white shadow-2xl rounded-3xl max-w-6xl mx-auto p-8 lg:p-12 lg:flex lg:gap-12 transition-transform transform hover:scale-105 duration-300">
        
        <div className="lg:w-1/3 flex justify-center lg:justify-start">
          <div className="relative group">
            <img
              src={doctor.image}
              alt={doctor.name}
              className="w-64 h-64 object-cover rounded-3xl shadow-xl border-4 border-blue-300 group-hover:scale-105 transition-transform duration-300"
            />
            <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-400 to-cyan-400 h-2 w-16 rounded-full shadow-lg"></span>
          </div>
        </div>

        <div className="lg:w-2/3 mt-8 lg:mt-0 flex flex-col justify-between">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-2">
              {doctor.name}
            </h2>
            <p className="text-blue-700 text-lg md:text-xl font-semibold mb-4">
              {doctor.specialization} | {doctor.qualification}
            </p>
            <p className="text-gray-700 mb-6 leading-relaxed">{doctor.bio}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-5 rounded-2xl shadow-inner hover:shadow-md transition-shadow duration-300">
                <h3 className="text-blue-900 font-semibold mb-1">Experience</h3>
                <p className="text-gray-700">{doctor.experience}</p>
              </div>
              <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-5 rounded-2xl shadow-inner hover:shadow-md transition-shadow duration-300">
                <h3 className="text-blue-900 font-semibold mb-1">Fees</h3>
                <p className="text-gray-700">₹{doctor.fees} / session</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <p className="text-gray-700 font-medium">
                📅 <strong>Available:</strong> {doctor.bookingTime}
              </p>
              <p className="text-gray-700 font-medium">
                🧾 <strong>Certificate:</strong>{" "}
                <a
                  href={doctor.certificate}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-800 transition-colors duration-200"
                >
                  View Certificate
                </a>
              </p>
            </div>
          </div>

          <Link to={`/book-appointment/${doctor._id}`}>
            <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white w-full py-3 mt-4 hover:from-blue-700 hover:to-cyan-600 transition-all duration-300 text-lg font-semibold rounded-xl shadow-lg">
              Book Appointment
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetailPage;



