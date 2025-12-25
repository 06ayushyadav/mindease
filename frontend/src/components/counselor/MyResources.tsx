import { useEffect, useState } from "react";
import api from "@/apis/axios";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function MyResources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyResources = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get(`/api/resource/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResources(res.data.resources);
    } catch (error) {
      console.error("Error fetching resources:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/api/resource/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setResources((prev) => prev.filter((item) => item._id !== id))

    } catch (error) {
      console.error("Error fetching resources:", error);
      return error;
    }
  }

  useEffect(() => {
    fetchMyResources();

  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Loading your resources...
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <motion.h1
        className="text-3xl font-bold text-center text-indigo-600 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        My Uploaded Resources
      </motion.h1>

      {resources.length === 0 ? (
        <p className="text-center text-gray-500">You haven’t uploaded anything yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((item) => (
            <Card
              key={item._id}
              className="hover:shadow-xl transition-transform transform hover:scale-105"
            >
              {item.type === "image" && (
                <img
                  src={item.fileUrl}
                  alt={item.title}
                  className="h-40 w-full object-cover rounded-t-md"
                />
              )}
              <CardHeader>
                <h2 className="font-semibold text-lg">{item.title}</h2>
                <p className="text-sm text-gray-500 capitalize">{item.type}</p>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-sm line-clamp-3">
                  {item.description || "No description provided"}
                </p>
                {item.tags?.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {item.tags.map((t, i) => (
                      <span
                        key={i}
                        className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <span className="text-xs text-gray-400">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
                <Button
                  onClick={() => handleDelete(item._id)}
                  variant="outline"
                  className="text-xs text-red-600 border-red-400 hover:bg-red-100"
                >
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
