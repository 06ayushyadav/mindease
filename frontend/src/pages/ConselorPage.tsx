import api from "@/apis/axios";
import CounselorResourceForm from "@/components/content/CounselorResourceForm";
import CounselorProfileForm from "@/components/counselor/profile/CounselorProfileForm";
import SessionFetchPage from "@/components/counselor/sessions/DoctorSession";
import { Mail } from "lucide-react";
import React, { useEffect,  useState } from "react";
import { GrResources } from "react-icons/gr";
import { FaCalendarAlt, FaUserMd, FaCheckCircle, FaSignOutAlt } from "react-icons/fa";
import { MdMarkEmailRead } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import MyResources from "@/components/counselor/MyResources";

type SessionStatus = "pending" | "accepted" | "rejected" | "completed" | "approved" | "cancelled";

type Session = {
  _id?: string
  id: string
  patientEmail: string
  patientName: string
  date: string
  problem?: string
  roomId: string
  status: SessionStatus
}


async function fetchDashboardStats(): Promise<{ totalSessions: number; pendingRequests: number; upcoming: number; earnings: number }> {
  return new Promise((res) => setTimeout(() => res({ totalSessions: 124, pendingRequests: 3, upcoming: 2, earnings: 5400 }), 400));
}

export function useSessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await api.get("/api/appointment/my-appointments", {
          headers: { Authorization: `Bearer ${localStorage.getItem("counselorToken")}` },
        });
        setSessions(res.data.data);
      } catch (err) {
        console.error("Error fetching sessions:", err);
        setError("Failed to fetch sessions.");
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  return { sessions, loading, error };
}
async function updateSessionStatus(sessionId: string, status: SessionStatus) {
  console.log("updateSessionStatus", sessionId, status);
  return new Promise((res) => setTimeout(() => res({ success: true }), 300));
}

const IconButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, ...props }) => (
  <button className="px-3 py-1 rounded-md hover:bg-gray-100" {...props}>
    {children}
  </button>
);


function Sidebar({ active, onNavigate }: { active: string; onNavigate: (s: string) => void }) {
  const navigate = useNavigate();
  const counselorData = JSON.parse(localStorage.getItem("counselorData") || "{}");
  const counselorId = counselorData?._id;

  const handleLogout = async () => {
    try {
      await api.post(`/api/counselor/logout`);
    } catch (error) {
      console.error(error);
    } finally {
      localStorage.removeItem("counselorToken");
      localStorage.removeItem("counselorData");
      window.location.reload()
      navigate(`/counselor-login`);
    }
  };


  return (
    <aside className="w-64 bg-white border-r min-h-screen p-6 sticky top-0">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-indigo-600 text-white rounded-full w-10 h-10 flex items-center justify-center">ME</div>
        <div>
          <div className="text-lg font-semibold">MindEase</div>
          <div className="text-xs text-gray-500">Counselor</div>
        </div>
      </div>

      <nav className="flex flex-col gap-2">
        <button
          onClick={() => onNavigate("overview")}
          className={`flex items-center gap-3 p-2 rounded-md ${active === "overview" ? "bg-indigo-50" : "hover:bg-gray-50"
            }`}
        >
          <FaCalendarAlt /> Dashboard
        </button>

        <button
          onClick={() => onNavigate("sessions")} // ✅ FIXED — should be onClick not onNavigate
          className={`flex items-center gap-3 p-2 rounded-md ${active === "sessions" ? "bg-indigo-50" : "hover:bg-gray-50"
            }`}
        >
          <FaUserMd /> Sessions
        </button>

        <button
          onClick={() => onNavigate("availability")}
          className={`flex items-center gap-3 p-2 rounded-md ${active === "availability" ? "bg-indigo-50" : "hover:bg-gray-50"
            }`}
        >
          <FaCalendarAlt /> My Resources
        </button>

        <button
          onClick={() => onNavigate("e-mail")}
          className={`flex items-center gap-3 p-2 rounded-md  ${active === "e-mail" ? "bg-indigo-50" : "hover:bg-gray-50"
            } `}
        >
          <MdMarkEmailRead className="text-xl" /> E-Mail
        </button>


        <button
          onClick={() => onNavigate("resource")}
          className={`flex items-center gap-3 p-2 rounded-md  ${active === "resource" ? "bg-indigo-50" : "hover:bg-gray-50"
            } `}
        >
          <GrResources className="text-xl" /> Resource
        </button>

        <button
          onClick={() => onNavigate("profile")}
          className={`flex items-center gap-3 p-2 rounded-md ${active === "profile" ? "bg-indigo-50" : "hover:bg-gray-50"
            }`}
        >
          <FaCheckCircle /> Profile
        </button>

        <button
          onClick={handleLogout}
          className="mt-6 flex items-center gap-3 p-2 rounded-md text-red-500 hover:bg-red-50"
        >
          <FaSignOutAlt /> Logout
        </button>
      </nav>
    </aside>
  );
}

function StatCard({ title, value, icon }: { title: string; value: string | number; icon?: React.ReactNode }) {
  return (
    <div className="bg-white p-4 rounded-md shadow-sm flex items-center justify-between">
      <div>
        <div className="text-sm text-gray-500">{title}</div>
        <div className="text-2xl font-semibold">{value}</div>
      </div>
      <div className="text-3xl text-indigo-600">{icon}</div>
    </div>
  );
}

function SessionsTable() {
  const [sessions, setSessions] = useState<Session[]>([]);

  const fetchScheduled = async () => {
    try {
      const response = await api.get("/api/appointment/my-appointments");
      const data = response.data.data.map((s: any) => ({
        ...s,
        _id: s._id || s.id,
      }));
      setSessions(data);
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
    }
  };

  useEffect(() => {
    fetchScheduled();
  }, []);

 


  const handleSessionAction = async (id: string, action: "accept" | "reject") => {
  try {
    await api.patch(`/api/appointment/update/${id}`, {
      status: action === "accept" ? "approved" : "rejected",
    });

    setSessions((prev) =>
      action === "accept"
        ? prev.map((s) =>
            s._id === id ? { ...s, status: "approved" } : s
          )
        : prev.filter((s) => s._id !== id) // reject = remove
    );

    alert(`Session ${action === "accept" ? "approved" : "rejected"} successfully`);
  } catch (error) {
    console.error("Failed to update session:", error);
    alert("Something went wrong while updating the session.");
  }
};

  return (
    <div className="bg-white rounded-md shadow-sm p-4">
      <div className="text-lg font-semibold mb-4">Session Requests</div>
      <div className="overflow-x-auto">
        <table className="w-full text-left table-auto">
          <thead className="text-sm text-gray-500 border-2">
            <tr>
              <th className="p-4 text-center">Client Name</th>
              <th className="p-4 text-center">Scheduled</th>
              <th className="p-4 text-center">Type</th>
              <th className="p-4 text-center">RoomId</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s) => (
              <tr className="capitalize border border-blue-500" key={s._id}>
                <td className="p-2 text-center border border-zinc-500">{s.patientName}</td>
                <td className="p-2 text-center border border-zinc-500">
                  {new Date(s.date).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </td>
                <td className="capitalize p-2 text-center border border-zinc-500">
                  Video Counseling
                </td>
                <td className="p-2 text-center border border-zinc-500">{s.roomId}</td>
                <td className="capitalize p-2 text-center border border-zinc-500">{s.status}</td>
                <td className="p-2 text-center border border-zinc-500">
                  {s.status === "pending" ? (
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleSessionAction(s._id, "accept")}
                        className="px-3 py-1 bg-green-50 text-green-700 rounded-md"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleSessionAction(s._id, "reject")}
                        className="px-3 py-1 bg-red-50 text-red-700 rounded-md"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">—</div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Email() {
  const [formData, setFormData] = useState({
    to: "",
    subject: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await api.post("/api/v1/send-email/send", {
        patientEmail: formData.to, // backend field name ke hisaab se
        subject: formData.subject,
        message: formData.message,
      }, {
        headers: { "Content-Type": "application/json" }
      })

      if (response) {
        console.log(response.data)
        alert("Email sent successfully");
        setFormData({ to: "", subject: "", message: "" });
      } else {
        alert("Failed to send email");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong while sending the email!");
    }
  };

  return (
    <div className="flex items-center justify-center  ">
      <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-lg">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-blue-600 text-white p-3 rounded-full">
            <Mail className="w-6 h-6" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center text-blue-800 mb-2">
          Send Email to Patient
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Counselors can use this form to communicate with their patients directly.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Recipient Email
            </label>
            <input
              type="email"
              name="to"
              value={formData.to}
              onChange={handleChange}
              required
              placeholder="patient@example.com"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Subject
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              placeholder="Session Follow-up"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={6}
              placeholder="Write your message here..."
              className="w-full px-4 py-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all"
          >
            Send Email
          </button>
        </form>
      </div>
    </div>
  );
}


export default function CounselorDashboardPage() {
  const [active, setActive] = useState<string>("overview");
  const [stats, setStats] = useState<{
    totalSessions: 0;
    pendingRequests: number;
    upcoming: number;
    earnings: number;
  } | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [counselorData, setCounselorData] = useState(null);

  const totalSessions = async () => {
    try {
      const response = await api.get(`/api/appointment/my-appointments`)
      console.log("total session ", response.data)

      const allAppointment = response.data.data || [];

      const total = response.data.total || 0;
      setStats({
        totalSessions: total
      });

    } catch (error: any) {
      console.log("Something went wrong", error)
      alert(error.message)
    }
  }

  useEffect(() => {
    totalSessions();
  }, [])

  useEffect(() => {
    const storedCounselor = localStorage.getItem("counselorData");
    if (storedCounselor) {
      setCounselorData(JSON.parse(storedCounselor));
    }
  }, []);

  if (!counselorData) return <div>Loading...</div>;
  
  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar active={active} onNavigate={setActive} />

      <main className="flex-1 p-8">
        {active === "overview" && (
          <section>
            <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-2">
  {/* Title */}
  <h1 className="text-2xl font-semibold text-gray-800">
    Dashboard
  </h1>

  {/* Welcome Message */}
  <p className="text-sm text-gray-600 md:text-right">
    Welcome back, <span className="font-medium text-lg text-green-500">
      {counselorData.firstName} {counselorData.lastName}
    </span>. Manage your sessions and availability here.
  </p>
</div>

            <div className="grid grid-cols-4 gap-4 mb-6">
              <StatCard
                title="Total Sessions"
                value={stats ? stats.totalSessions : "—"}
                icon={<FaUserMd />}
              />
            
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 ">
              <div className="col-span-2">
                <SessionsTable/>
              </div>



              <div className="col-span-1 space-y-4">


                <div className="bg-white p-2 rounded-md shadow-sm  ">
                  <div className="text-lg font-semibold mb-2">Profile Summary</div>
                  <div className="text-sm text-gray-600">
                    Certified counselor with experience in student mental health. Upload
                    certificates and update availability to accept bookings.
                  </div>
                  <div className="mt-4">
                    <button onClick={() => setActive("profile")} className="px-4 py-2 bg-indigo-600 text-white rounded">
                      Edit Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {active === "sessions" && (
          <section>
            <SessionFetchPage />
          </section>
        )}

        {active === "profile" && (
          <section>
            <CounselorProfileForm />
          </section>
        )}

        {active === "e-mail" && (
          <section>
            <Email />
          </section>
        )}



        {active === "resource" && (
          <section>
            <CounselorResourceForm />
          </section>
        )}

        {active === "availability" && (
          <section>
            <MyResources />
          </section>
        )}


      </main>
    </div>
  );
}
