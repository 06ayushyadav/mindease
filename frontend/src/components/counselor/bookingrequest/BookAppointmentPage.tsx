import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "@/apis/axios";
import toast from "react-hot-toast";

interface Doctor {
    _id: string;
    name: string;
    specialization: string;
    experience: string;
    fees: number;
    bookingTime: string;
    image: string;
}

const BookAppointmentPage = () => {
    const { doctorId } = useParams<{ doctorId: string }>();
    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSubmit, setIsSubmit] = useState(false);
    const [patientName, setPatientName] = useState("");
    const [patientEmail, setPatientEmail] = useState("");
    const [date, setDate] = useState("");
    const [problem, setProblem] = useState("");
    const [openPaymentModal, setOpenPaymentModal] = useState(false);

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

    const confirmBooking = async () => {
        setIsSubmit(true);
        try {
            await api.post("/api/appointment/book",
                { doctorId, patientName, patientEmail, date, problem },
                { headers: { "Content-Type": "application/json" } }
            );

            toast.success("Appointment booked successfully!");
            setPatientName("");
            setPatientEmail("");
            setDate("");
            setProblem("");
        } catch (error) {
            toast.error("Something went wrong!");
        } finally {
            setIsSubmit(false);
            setOpenPaymentModal(false);
        }
    };

    const handleDummyPayment = () => {
        toast.success("Payment Successful!");
        confirmBooking();
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setOpenPaymentModal(true);  
    };


    if (loading) return <p className="text-center mt-20">Loading doctor details...</p>;
    if (!doctor) return <p className="text-center mt-20 text-red-500">Doctor not found.</p>;


    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 flex justify-center items-center py-10">
            <div className="bg-white shadow-xl rounded-2xl p-8 max-w-3xl w-full">

                <div className="flex flex-col items-center mb-6">
                    <img src={doctor.image} alt={doctor.name}
                        className="w-40 h-40 object-cover rounded-full border-4 border-blue-300 shadow-lg" />
                    <h2 className="text-2xl font-bold mt-4 text-blue-800">{doctor.name}</h2>
                    <p className="text-blue-600"><span className="text-red-500">Specialization: </span> {doctor.specialization}</p>
                    <p className="text-gray-600">{doctor.experience} years Experience</p>
                    <p className="text-gray-800 font-semibold">₹{doctor.fees} / session</p>
                    <p className="text-gray-500">Available: {doctor.bookingTime}</p>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800 mb-3 text-center">
                        Book Appointment with {doctor.name}
                    </h3>

                    <input
                        type="text"
                        placeholder="Your Full Name"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        required
                        className="w-full p-3 border rounded-md"
                    />

                    <input
                        type="email"
                        placeholder="Your Email"
                        value={patientEmail}
                        onChange={(e) => setPatientEmail(e.target.value)}
                        required
                        className="w-full p-3 border rounded-md"
                    />

                    <input
                        type="datetime-local"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                        className="w-full p-3 border rounded-md"
                    />

                    <textarea
                        placeholder="Describe your issue..."
                        value={problem}
                        onChange={(e) => setProblem(e.target.value)}
                        required
                        rows={4}
                        className="w-full p-3 border rounded-md"
                    />

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition"
                    >
                        Proceed to Pay ₹{doctor.fees}
                    </button>
                </form>

                {openPaymentModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
                        <div className="bg-white p-6 rounded-xl shadow-xl w-96">
                            <h2 className="text-xl font-bold mb-4 text-center">Dummy Payment</h2>

                            <p className="text-gray-600 mb-2">UPI ID / Card Number (Dummy)</p>
                            <input type="text" placeholder="example@upi" className="w-full p-3 border rounded-md" />

                            <button
                                onClick={handleDummyPayment}
                                className="w-full bg-green-600 text-white py-3 rounded-md mt-4 font-semibold"
                                disabled={isSubmit}
                            >
                                {isSubmit ? "Processing..." : `Pay ₹${doctor.fees}`}
                            </button>

                            <button
                                onClick={() => setOpenPaymentModal(false)}
                                className="w-full bg-gray-300 text-black py-2 rounded-md mt-3"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default BookAppointmentPage;

