import api from "@/apis/axios";
import { useEffect, useState } from "react";

const BookingRequest = () => {

  const [counselors, setCounselors] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    doctor: "",
    date: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Booking Request Submitted:", formData);
    alert("Your booking request has been sent successfully!");
    
  };

  const allCounselor = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/counselor/all-counselors`);
      console.log(response);
      setCounselors(response.data.data || []);
    } catch (error) {
      console.log("counselor not found", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    allCounselor();
  }, []);

  return (
    <div className=" max-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-300 flex flex-col lg:flex-row items-center justify-center p-5 gap-10">
      
      <div className="max-w-md text-center lg:text-left">
        <h1 className="text-4xl font-bold text-blue-900 mb-4">
          Book Your Doctor Appointment
        </h1>
        <p className="text-gray-700 text-lg leading-relaxed mb-6">
          Schedule a session with trusted mental health professionals in just a few easy steps. 
          Choose your doctor, select a date, and submit your booking request to get started.
        </p>
        <div className="flex justify-center lg:justify-start">
          <img
            src="https://cdn-icons-png.flaticon.com/512/387/387561.png"
            alt="Doctor illustration"
            className="w-40 h-40 animate-pulse"
          />
        </div>
      </div>

      <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-lg transition-transform transform hover:scale-105 duration-300">
        <h3 className="text-2xl font-bold text-center text-blue-900 mb-6">
          Doctor Booking Form
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm ">
          {/* Name */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your full name"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>

          {/* Doctor */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Select Doctor</label>
            <select
              name="doctor"
              value={formData.doctor}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Choose Doctor --</option>
              {
                counselors.map((c)=>(
                  <option> {c.firstName +" "+ c.lastName} </option>
                ))
              }
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Preferred Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Additional Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="3"
              placeholder="Describe your concern or request"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-1 hover:cursor-pointer rounded-lg text-lg font-semibold transition-all duration-300"
          >
            Submit Booking
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingRequest;
