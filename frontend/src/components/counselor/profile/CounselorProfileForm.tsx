
import api from "@/apis/axios";
import React, { useEffect, useState } from "react";

const CounselorProfileForm: React.FC = () => {
  const [name, setName] = useState("");
  const [qualification, setQualification] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [experience, setExperience] = useState("");
  const [fees, setFees] = useState<number | "">("");
  const [bookingTime, setBookingTime] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [certificate, setCertificate] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentProfile, setCurrentProfile] = useState<any>(null);

  const fetchProfile = async () => {
    try {
      const stored = localStorage.getItem("counselorData");
      if (!stored) return;
      const parsed = JSON.parse(stored);
      const id = parsed._id;

      const response = await api.get(`/api/counselor-booking/my-profile/${id}`);
      if (response.data.success) setCurrentProfile(response.data.data);
    } catch (error) {
      console.error("Error fetching counselor profile:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("qualification", qualification);
    formData.append("specialization", specialization);
    formData.append("experience", experience);
    formData.append("fees", fees.toString());
    formData.append("bookingTime", bookingTime);
    formData.append("bio", bio);
    formData.append("status", "Pending");
    if (image) formData.append("image", image);
    if (certificate) formData.append("certificate", certificate);

    try {
      setLoading(true);
      await api.post("/api/counselor-booking/create-profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Profile created successfully!");
      fetchProfile();
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Error saving profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Create / Update Profile</h2>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border rounded" />
          <input type="text" placeholder="Qualification" value={qualification} onChange={(e) => setQualification(e.target.value)} className="w-full p-2 border rounded" />
          <input type="text" placeholder="Specialization" value={specialization} onChange={(e) => setSpecialization(e.target.value)} className="w-full p-2 border rounded" />
          <input type="text" placeholder="Experience" value={experience} onChange={(e) => setExperience(e.target.value)} className="w-full p-2 border rounded" />
          <input type="number" placeholder="Fees" value={fees} onChange={(e) => setFees(Number(e.target.value))} className="w-full p-2 border rounded" />
          <input type="text" placeholder="Booking Time" value={bookingTime} onChange={(e) => setBookingTime(e.target.value)} className="w-full p-2 border rounded" />
        </div>

        <textarea placeholder="Bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={4} className="w-full p-2 border rounded resize-none" />

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block mb-1 text-sm">Profile Image</label>
            <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} className="w-full" />
          </div>
          <div className="flex-1">
            <label className="block mb-1 text-sm">Certificate</label>
            <input type="file" accept=".pdf,.jpg,.png" onChange={(e) => setCertificate(e.target.files?.[0] || null)} className="w-full" />
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded">
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </form>

      {currentProfile && (
        <div className="mt-10 bg-white shadow-2xl rounded-3xl max-w-5xl mx-auto p-8 lg:flex lg:gap-12 transition-transform transform hover:scale-105 duration-300">
          {/* Image */}
          <div className="lg:w-1/3 flex justify-center lg:justify-start">
            <div className="relative group">
              <img
                src={currentProfile.image}
                alt={currentProfile.name}
                className="w-64 h-64 object-cover rounded-3xl shadow-xl border-4 border-blue-300 group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-400 to-cyan-400 h-2 w-16 rounded-full shadow-lg"></span>
            </div>
          </div>

          <div className="lg:w-2/3 mt-8 lg:mt-0 flex flex-col justify-between">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-2">
                {currentProfile.name}
              </h2>
              <p className="text-blue-700 text-lg md:text-xl font-semibold mb-4">
                {currentProfile.specialization} | {currentProfile.qualification}
              </p>
              <p className="text-gray-700 mb-6 leading-relaxed">{currentProfile.bio}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-5 rounded-2xl shadow-inner">
                  <h3 className="text-blue-900 font-semibold mb-1">Experience</h3>
                  <p className="text-gray-700">{currentProfile.experience}</p>
                </div>
                <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-5 rounded-2xl shadow-inner">
                  <h3 className="text-blue-900 font-semibold mb-1">Fees</h3>
                  <p className="text-gray-700">₹{currentProfile.fees} / session</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                <p className="text-gray-700 font-medium">
                  📅 <strong>Available:</strong> {currentProfile.bookingTime}
                </p>
                <p className="text-gray-700 font-medium">
                  🧾 <strong>Certificate:</strong>{" "}
                  <a
                    href={currentProfile.certificate}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-800 transition-colors duration-200"
                  >
                    View Certificate
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CounselorProfileForm;

