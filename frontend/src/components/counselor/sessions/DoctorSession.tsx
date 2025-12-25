import React, { useEffect, useState } from "react";
import api from "@/apis/axios";

interface Session {
    _id: string;
    doctorName: string;
    patientName: string;
    patientEmail: string
    date: string;
    status: string;
    problem: string;
}

const SessionFetchPage = () => {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchSessions = async () => {
        try {
            const response = await api.get("/api/appointment/my-appointments", {
                headers: { Authorization: `Bearer ${localStorage.getItem("counselorToken")}` }
            });
            setSessions(response.data.data);
        } catch (err) {
            console.error("Error fetching sessions:", err);
            setError("Failed to fetch your sessions.");
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchSessions();
        const interval = setInterval(fetchSessions, 10000); 
        return () => clearInterval(interval);
    }, []);

    if (loading)
        return <p className="text-center mt-20 min-h-screen text-blue-600">Loading your sessions...</p>;

    if (error)
        return <p className="text-center mt-20 min-h-screen text-red-500">{error}</p>;

    return (
        <div className="min-h-screen bg-gradient-to-br  flex justify-center items-center py-10">
            <div className="bg-white shadow-xl rounded-2xl p-8 max-w-4xl w-full">
                <h2 className="text-2xl font-bold text-center text-blue-800 mb-6">
                    Your Counseling Sessions
                </h2>

                {sessions.length === 0 ? (
                    <p className="text-center text-gray-600">No sessions found yet.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {sessions.map((session) => (
                            <div
                                key={session._id}
                                className="border rounded-xl p-5 shadow hover:shadow-lg bg-gradient-to-br from-white to-blue-50 transition"
                            >
                                <p className="text-gray-600 mb-1">
                                    <strong>Patient :</strong> {session.patientName}
                                </p>
                                <p className="text-gray-600 mb-1" >
                                    <strong>Email :</strong> {session.patientEmail}
                                </p>
                                <p className="text-gray-600 mb-1">
                                    <strong>Problem :</strong> {session.problem}
                                </p>
                                <p>
                                    <strong>Date & Time:</strong>{" "}
                                    {new Date(session.date).toLocaleString("en-IN", {
                                        dateStyle: "medium",
                                        timeStyle: "short",
                                    })}
                                </p>
                                <p className="text-gray-700">
                                    <strong>Status :</strong>{" "}
                                    <span
                                        className={`${session.status === "completed"
                                            ? "text-green-600"
                                            : session.status === "cancelled"
                                                ? "text-red-600"
                                                : "text-yellow-600"
                                            } font-medium`}
                                    >
                                        {session.status}
                                    </span>
                                </p>
                                <p className="text-gray-700">
                                    <strong>Payment Done ✅ </strong>
                                    
                        
                                </p>
                            </div>
                        ))}
                    </div>
                )}
                
            </div>
        </div>
    );
};

export default SessionFetchPage;
