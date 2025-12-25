import { useEffect, useState } from "react";
import {
  Card, CardHeader, CardTitle, CardDescription,
  CardContent, CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate, Link } from "react-router-dom";
import api from "@/apis/axios";

interface Doctor {
  _id: string;
  name: string;
  qualification: string;
  specialization: string;
  experience: string;
  fees: number;
  bio: string;
  bookingTime: string;
  image: string;
}

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleDetailsClick = (doctorId: string) => {
    navigate(`/doctors/doctor-booking/${doctorId}`);
  };

  const getAllDoctor = async () => {
    try {
      const response = await api.get(`/api/counselor-booking/profile`);
      setDoctors(response.data.data);
    } catch (error) {
      console.log("All doctor error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllDoctor();
  }, []);

  const filteredDoctors = doctors.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50">
        <p className="text-lg text-gray-500 animate-pulse">Loading doctors...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 py-8 px-6">
      <div className="text-center mb-5">
        <h1 className="text-4xl font-extrabold text-blue-900 mb-1 tracking-wide">
          Find Your Counselor
        </h1>
        <p className="text-blue-700 text-lg md:text-xl">
          Browse, explore, and book sessions with certified mental health professionals
        </p>
      </div>

      <div className="max-w-4xl mx-auto mb-8 flex flex-col sm:flex-row items-center gap-4">
        <Input
          type="text"
          placeholder="Search by name or specialization..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 p-3 rounded-xl shadow-lg border border-cyan-500 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
        />
      </div>

      <div className="max-w-6xl mx-auto">
        {filteredDoctors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDoctors.map((doctor) => (
              <Card
                key={doctor._id}
                className="overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl border border-gray-100 rounded-3xl bg-cyan-50 "
              >
                <div className="relative w-full  ">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-full h-56 object-fill rounded-t-3xl"
                  />
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full shadow-md"></span>
                </div>

                <CardHeader>
                  <CardTitle className="text-xl font-semibold flex justify-between  items-center">
                    Dr . {doctor.name}
                    <p
                      className="text-sm text-blue-500 hover:underline cursor-pointer"
                      onClick={() => handleDetailsClick(doctor._id)}
                    >
                      Details
                    </p>
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-500">
                   Specialization : {doctor.specialization} | {doctor.qualification}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 text-sm">{doctor.experience}+ Year Experience </p>
                  <p className="text-gray-800 font-medium mt-2">
                    ₹{doctor.fees} / session
                  </p>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Link to={`/book-appointment/${doctor._id}`}>
                    <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white w-full py-3 hover:from-blue-700 hover:to-cyan-600 transition-all duration-300 font-semibold rounded-xl shadow-lg">
                      Book Appointment
                    </Button>
                  </Link>
                </CardFooter>
              </Card>

            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 text-lg mt-10 min-h-screen">
            No doctors found 😕
          </p>
        )}
      </div>
    </div>
  );
}

