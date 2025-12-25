import React, { useState } from "react";
import api from "@/apis/axios"; 

const MoodTrackerForm = () => {
  const [rating, setRating] = useState<number>(5);
  const [tags, setTags] = useState<string[]>([]);
  const [note, setNote] = useState<string>("");
  const [sleepHours, setSleepHours] = useState<number | string>("");
  const [exerciseMinutes, setExerciseMinutes] = useState<number|string>("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const moodTags = ["Happy 😃", "Sad 😔", "Stressed 😯 ", "Calm 😑", "Motivated 🙂", "Tired 🥱"];

  const toggleTag = (tag: string) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const payload = {
        rating,
        tags,
        note,
        context: { sleepHours, exerciseMinutes },
      };

      const response = await api.post("/api/user-mood/create-mood", payload, {
        headers: {
          "Content-Type": "application/json",
        }
      });

      if (response.data.success) {
        setMessage("Mood saved successfully!");
        setRating(5);
        setTags([]);
        setNote("");
        setSleepHours("")
        setExerciseMinutes("")
      } else {
        setMessage("Failed to save mood.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Error while saving mood.");
    } finally {
      setLoading(false);

    }
  };

  return (
    <div className="bg-white shadow-md p-6 rounded-lg max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-indigo-600">Track Your Mind Status</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating */}
        <div>
          <label className="block text-gray-700 mb-2">Rating: {rating}</label>
          <input
            type="range"
            min="1"
            max="10"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Select Tags:</label>
          <div className="flex flex-wrap gap-2">
            {moodTags.map((tag) => (
              <button
                type="button"
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full border ${tags.includes(tag)
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700"
                  }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Note:</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className="w-full border rounded-md p-2"
            placeholder="Write your thoughts..."
          ></textarea>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-2">Sleep (hours):</label>
            <input
              type="number"
              placeholder="8"
              value={sleepHours}
              onChange={(e) => setSleepHours(Number(e.target.value))}
              className="w-full border rounded-md p-2"
              min={0}
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Exercise (minutes):</label>
            <input
              type="number"
              placeholder="30"
              value={exerciseMinutes}
              onChange={(e) => setExerciseMinutes(Number(e.target.value))}
              className="w-full border rounded-md p-2"
              min={0}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
        >
          {loading ? "Saving..." : "Save Mood"}
        </button>

        {message && (
          <p className="text-center mt-2 text-sm text-green-600">{message}</p>
        )}
      </form>
    </div>
  );
};

export default MoodTrackerForm;