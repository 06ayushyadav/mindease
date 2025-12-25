import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

const SessionHome = () => {
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  const goToRoom = (e) => {
    e.preventDefault();
    if (roomId.trim() === "") return;
    navigate(`/session/${roomId}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="w-[90vw] max-w-md shadow-2xl border border-blue-500 bg-white/80 backdrop-blur-lg rounded-2xl">
          <CardContent className="p-8 text-center">
            <h1 className="text-3xl font-bold text-zinc-800 mb-2">Join Your Session</h1>
            <p className="text-zinc-500 mb-6 text-sm">
              Enter your unique Room ID to begin your secure counseling session
            </p>

            <form onSubmit={goToRoom} className="space-y-5">
              <Input
                type="text"
                value={roomId}
                placeholder="Enter your Room ID here..."
                onChange={(e) => setRoomId(e.target.value)}
                className="w-full h-12 rounded-xl text-center border-zinc-300 focus:ring-2 focus:ring-indigo-500"
              />
              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-medium py-2 rounded-xl transition-all duration-300"
              >
                Join Now
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SessionHome;
