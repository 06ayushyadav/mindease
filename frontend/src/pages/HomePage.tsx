import { useState, useRef, useEffect } from "react";
import Body from "@/home/Body";
import { MessageCircle, X } from "lucide-react";
import api from "@/apis/axios";

const HomePage = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chat, setChat] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 Hi! I'm your MindEase AI Chatbot. How can I help you today?",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!chat.trim()) return;

    const newMessage = { sender: "user", text: chat };
    setMessages((prev) => [...prev, newMessage]);
    setChat("");
    setLoading(true);

    try {
      const { data } = await api.post("/api/ask-ai/chat", { message: chat });
      setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Sorry, I couldn't connect to the AI right now." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-r from-cyan-100 to-blue-200">
      <Body />
      <button
        onClick={() => setIsChatOpen((prev) => !prev)}
        className="fixed bottom-3 right-4 bg-blue-500 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:bg-indigo-700 transition-transform transform hover:scale-110"
      >
        {isChatOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </button>

      {isChatOpen && (
        <div className="fixed bottom-20 right-4 w-[400px] h-[60vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 animate-slide-up">
          <div className="bg-indigo-600 text-white p-2 font-semibold text-lg flex justify-between items-center">
            MindEase Chatbot
            <button onClick={() => setIsChatOpen(false)}>
              <X size={22} />
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-2">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`max-w-[80%] p-2 rounded-lg ${
                  msg.sender === "user"
                    ? "bg-indigo-100 ml-auto text-right"
                    : "bg-gray-200 text-left"
                }`}
              >
                {msg.text}
              </div>
            ))}

            {loading && (
              <div className="text-gray-400 text-sm">🤖 Thinking...</div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={submitHandler}
            className="p-3 border-t bg-white flex gap-2"
          >
            <input
              type="text"
              placeholder="Type your message..."
              value={chat}
              onChange={(e) => setChat(e.target.value)}
              className="flex-1 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default HomePage;
