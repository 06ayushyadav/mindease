import api from "@/apis/axios";
import MoodTrackerForm from "@/components/user/moodtracker/MoodTrackerForm";
import { useEffect, useRef, useState } from "react";
import { FaCalendarCheck,  FaHeartbeat, FaComments, FaSignOutAlt, FaCheckCircle } from "react-icons/fa";
import { SiPivotaltracker } from "react-icons/si";
import { useNavigate } from "react-router-dom";


async function fetchMoodData() {
  try {
    const token = localStorage.getItem("userToken");
    const user = JSON.parse(localStorage.getItem("userData") || "{}");
    const userId = user._id;

    const response = await api.get(`/api/user-mood/mood/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = response.data.data;
    console.log("Fetched Mood Data:", data);

    if (!data || data.length === 0) {
      return {
        currentMood: "No data yet 😕",
        lastUpdated: "—",
        moodHistory: [],
      };
    }

   
    const latest = data[data.length - 1];
    const moodHistory = data.map((m: any) => ({
      date: new Date(m.createdAt).toISOString().split("T")[0],
      tags: m.tags?.join(", ") || "—",
      note: m.note || "—",
      rating: m.rating || "—",
    }));

    return {
      currentMood: latest.tags?.join(", ") || "—",
      lastUpdated: new Date(latest.createdAt).toLocaleDateString("en-IN"),
      moodHistory,
    };

  
  } catch (error) {
    console.error("Error fetching mood data:", error);
    return {
      currentMood: "Error fetching mood",
      lastUpdated: "—",
      moodHistory: [],
    };
  }
}


async function fetchResources() {
  return new Promise((res) =>
    setTimeout(
      () =>
        res([
          { id: 1, title: "Mindfulness Basics", category: "Meditation", link: "#" },
          { id: 2, title: "Overcoming Stress", category: "Self-Help", link: "#" },
          { id: 3, title: "Daily Gratitude Journal", category: "Journaling", link: "#" },
        ]),
      300
    )
  );
}

async function fetchCounselors() {
  return new Promise((res) =>
    setTimeout(
      () =>
        res([
          { id: 1, name: "Dr. Sunny Yadav", specialty: "Student Wellness", rating: 4.9 },
          { id: 2, name: "Dr. Ayush Yadav", specialty: "Stress & Anxiety", rating: 4.8 },
        ]),
      300
    )
  );
}

function Sidebar({ active, onNavigate }: { active: string; onNavigate: (s: string) => void }) {

const navigate = useNavigate();
  const patientData = JSON.parse(localStorage.getItem("patientData") || "{}");
  const userId = patientData?._id;

  const handleLogout = async () => {
    try {
      await api.post(`/api/user/logout`);
    } catch (error) {
      console.error(error);
    } finally {
      localStorage.removeItem("patientToken");
      localStorage.removeItem("patientData");
      window.location.reload()
      navigate(`/patient-login`);
    }
  };


  return (
    <aside className="w-64 bg-white border-r min-h-screen p-6 sticky top-0">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-indigo-600 text-white rounded-full w-10 h-10 flex items-center justify-center">ME</div>
        <div>
          <div className="text-lg font-semibold">MindEase</div>
          <div className="text-xs text-gray-500">Patient</div>
        </div>
      </div>

      <nav className="flex flex-col gap-2">
        <button onClick={() => onNavigate("overview")} className={`flex items-center gap-3 p-2 rounded-md ${active === "overview" ? "bg-indigo-50" : "hover:bg-gray-50"}`}>
          <FaHeartbeat /> Dashboard
        </button>

        <button onClick={() => onNavigate("moodtracker")} className={`flex items-center gap-3 p-2 rounded-md ${active === "moodtracker" ? "bg-indigo-50" : "hover:bg-gray-50"}`} >
          <SiPivotaltracker />
          Tracker
        </button>

      
        <button onClick={() => onNavigate("bookings")} className={`flex items-center gap-3 p-2 rounded-md ${active === "bookings" ? "bg-indigo-50" : "hover:bg-gray-50"}`}>
          <FaCalendarCheck /> Book Counselor
        </button>
        <button onClick={() => onNavigate("chat")} className={`flex items-center gap-3 p-2 rounded-md ${active === "chat" ? "bg-indigo-50" : "hover:bg-gray-50"}`}>
          <FaComments /> AI Chat
        </button>

        <button onClick={() => onNavigate("profile")} className={`flex items-center gap-3 p-2 rounded-md ${active === "profile" ? "bg-indigo-50" : "hover:bg-gray-50"}`}>
          <FaCheckCircle /> Profile
        </button>

        <button onClick={handleLogout} className="mt-6 flex items-center gap-3 p-2 rounded-md text-red-500 hover:bg-red-50">
          <FaSignOutAlt /> Logout
        </button>
      </nav>
    </aside>
  );
}

function MoodTracker({ data }: { data: any }) {

  if (!data) {
    return (
      <div className="bg-white p-4 rounded-md shadow-sm">
        <div className="text-gray-500 text-sm">Loading mind status data...</div>
      </div>
    )
  }

  return (
  <div className="bg-white p-4 rounded-md shadow-sm">
    <div className="text-lg font-semibold mb-2">Mind Health Tracker</div>

    <div className="text-sm text-gray-600 mb-2">
      Current Mind Status: {data.currentMood}

    </div>
    <div className="text-xs text-gray-400 mb-4">
      Last Updated: {data.lastUpdated}
    </div>

    {data.moodHistory.length > 0 ? (
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border border-gray-200 rounded-md">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="py-2 px-3 text-left border-b">Date</th>
              <th className="py-2 px-3 text-left border-b">Mind Health</th>
              <th className="py-2 px-3 text-left border-b">Rating</th>
              <th className="py-2 px-3 text-left border-b">Note</th>
            </tr>
          </thead>

          <tbody>
            {data.moodHistory.map((m: any, i: number) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="py-2 px-3">{m.date}</td>
                <td className="py-2 px-3">{m.tags}</td>
                <td className="py-2 px-3">{m.rating}</td>
                <td className="py-2 px-3">{m.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <p className="text-sm text-gray-500">No mind status history found.</p>
    )}
  </div>
);
}

function ResourcesPanel({ resources }: { resources: any[] }) {
  return (
    <div className="bg-white p-4 rounded-md shadow-sm">
      <div className="text-lg font-semibold mb-4">Self-Help Resources</div>
      <ul className="space-y-3">
        {resources.map((r) => (
          <li key={r.id} className="border p-3 rounded-md hover:bg-gray-50">
            <div className="font-medium">{r.title}</div>
            <div className="text-xs text-gray-500">Category: {r.category}</div>
            <a href={r.link} className="text-indigo-600 text-sm mt-1 inline-block">Read More</a>
          </li>
        ))}
      </ul>
    </div>
  );
}



function CounselorBooking() {
  const [counselors, setCounselors] = useState<any[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const allCounselor = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/counselor-booking/profile`);
      setCounselors(response.data.data || []);
    } catch (error) {
      console.log("counselor not found", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    allCounselor();
  }, [])


  const bookSession = () => {
    if (!selected) return;
    navigate(`/book-appointment/${selected}`)
  }

  return (
    <div className="bg-white p-4 rounded-md shadow-sm">
      <div className="text-lg font-semibold mb-4">Available Counselors</div>

      {loading ? (
        <div className="text-gray-500 text-sm">Loading counselors...</div>
      ) : counselors.length === 0 ? (
        <div className="text-gray-500 text-sm">No counselors available</div>
      ) : (
        <ul className="space-y-3">
          {counselors.map((c) => (
            <li
              key={c._id}
              className={`border p-3 rounded-md cursor-pointer ${selected === c._id ? "bg-indigo-50" : "hover:bg-gray-50"
                }`}
              onClick={() => setSelected(c._id)}
            >
              <div className="flex justify-between items-center">
                <div className="font-medium">
                  {c.name}
                </div>
                <div className="font-medium">
                  Fee : {c.fees}$/Session
                </div>
              </div>
              <div className="text-sm text-gray-800">
                Specialization : {c.specialization}
              </div>

              <div className="text-sm text-gray-800">
                Experience : {c.experience} Years
              </div>

              <div className="text-sm text-gray-800">
                Availability : {c.bookingTime}
              </div>
              
            </li>
          ))}
        </ul>
      )}

      {selected && (
        <div className="mt-4">
          <button onClick={bookSession} className="px-4 py-2 bg-indigo-600 text-white rounded">
            Book Session
          </button>
        </div>
      )}
    </div>
  );
}


function ChatPanel() {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);


  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim()) return;

    const newMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await api.post("/api/ask-ai/chat", { message: input });

      const aiMessage = { sender: "ai", text: response.data.reply || "No response" };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error: any) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Sorry, something went wrong." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white p-4 rounded-md shadow-sm h-[70vh] flex flex-col">
      <div className="text-lg font-semibold mb-4">AI Chat Assistant</div>
      <div className="flex-1 overflow-y-auto space-y-2 mb-3">
        {messages.map((m, i) => (
          <div key={i} className={`p-2 rounded-md ${m.sender === "user" ? "bg-indigo-100 self-start text-left"  // 👈 user message now left side
            : "bg-gray-100 self-end text-left"}`}>
            {m.text}
          </div>
        ))}

        {
          loading && (
            <div className="text-sm text-gray-500 italic"> AI is typing...</div>
          )
        }
      </div>
      <div className="flex gap-2">
        <input className="flex-1 p-2 border rounded" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your message..." />
        <button onClick={sendMessage} className="px-4 py-2 bg-indigo-600 text-white rounded">Send</button>
      </div>
    </div>
  );
}


function Profile() {
  const user = JSON.parse(localStorage.getItem("patientData") || "{}");

  if (!user || !user.userName)
    return (
      <div className="flex justify-center items-center min-h-screen text-blue-600 font-medium">
        Loading profile...
      </div>
    );

  return (
    <div className="flex justify-center items-center ">
      <div className="bg-white  shadow-2xl rounded-3xl p-8 max-w-md w-full transition-all hover:shadow-blue-300 transform hover:scale-105 ">
        
        <div className="flex flex-col items-center text-center mb-6">
          <div
            className="w-32 h-32 rounded-full overflow-hidden mb-4 ring-4 ring-blue-200 shadow-md flex justify-center items-center bg-gradient-to-br from-indigo-500 to-cyan-400"
          >
            <svg
              viewBox="0 0 100 100"
              width="90"
              height="90"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="MindEase User Logo"
            >
              <defs>
                <linearGradient id="grad" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0" stopColor="#4F46E5" />
                  <stop offset="1" stopColor="#06B6D4" />
                </linearGradient>
              </defs>
              <rect width="100" height="100" rx="50" fill="url(#grad)" />
              <text
                x="50"
                y="58"
                fontFamily="Inter, Roboto, sans-serif"
                fontWeight="700"
                fontSize="40"
                textAnchor="middle"
                fill="white"
              >
                {user.userName?.[0]?.toUpperCase()+user.userName?.[1]?.toUpperCase() || "User" }
              </text>
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-blue-800">{user.userName}</h2>
          <p className="text-gray-500 text-sm">{user.email}</p>
        </div>

        <div className="space-y-3 text-gray-700">
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Age:</span>
            <span>{user.age || "N/A"}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Gender:</span>
            <span>{user.gender || "N/A"}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Country:</span>
            <span>{user.country || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Joined:</span>
            <span>
              {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString("en-IN")
                : "N/A"}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}



export default function PatientDashboard() {
  const [active, setActive] = useState("overview");
  const [moodData, setMoodData] = useState<any>(null);
  const [resources, setResources] = useState<any[]>([]);
  const [counselors, setCounselors] = useState<any[]>([]);

  useEffect(() => {
    fetchMoodData().then(setMoodData);
    fetchResources().then(setResources);
    fetchCounselors().then(setCounselors);
  }, []);

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar active={active} onNavigate={setActive} />

      <main className="flex-1 p-8 space-y-6">
        {active === "overview" && moodData && (
          <>
            <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
            <div className="grid grid-cols-1  md:grid-cols-2 gap-6">
              <MoodTracker data={moodData} />
              <CounselorBooking counselors={counselors.slice(0, 1)} />
            </div>
          </>
        )}

        {active === "moodtracker" && <MoodTrackerForm />}


        {active === "bookings" && <CounselorBooking counselors={counselors} />}



        {active === "chat" && <ChatPanel />}

        { active==="profile" && <Profile/>} 

      </main>
    </div>
  );
}
