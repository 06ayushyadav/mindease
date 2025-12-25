import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import api from "@/apis/axios";

const Content = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedPost, setSelectedPost] = useState<any | null>(null);

  const fetchPosts = async () => {
    try {
      const res = await api.get("/api/resource/get");
      setPosts(res.data.resources);
      setFilteredPosts(res.data.resources);
      
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };


  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        const token=localStorage.getItem("adminToken")
        await api.delete(`/api/resource/admin/delete/${id}`,{
          headers:{Authorization:`Bearer ${token}`}
        });
        setPosts((prev) => prev.filter((post) => post._id !== id));
        setFilteredPosts((prev) => prev.filter((post) => post._id !== id));
      } catch (error) {
        console.error("Error deleting post:", error);
        return;
      }
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    const filtered = posts.filter(
      (p) =>
        p.title?.toLowerCase().includes(value.toLowerCase()) ||
        `${p.uploadedBy?.firstName} ${p.uploadedBy?.lastName}`
          .toLowerCase()
          .includes(value.toLowerCase())
    );
    setFilteredPosts(filtered);
  };

  useEffect(() => {
    fetchPosts();
  }, []);


  if (loading)
    return <p className="text-center text-gray-500 mt-10">Loading posts...</p>;

  return (
    <div className="min-h-screen ">
      <h1 className="text-3xl font-semibold text-center p-4">
        Counselor Posts
      </h1>

      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search by title or counselor name..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full max-w-lg px-4 py-2 border border-gray-300 rounded-3xl shadow-sm focus:ring-2 focus:ring-cyan-400 outline-none"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
          <thead className="bg-cyan-600 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Counselor</th>
              <th className="py-3 px-4 text-left">Title</th>
              <th className="py-3 px-4 text-left">Snippet</th>
              <th className="py-3 px-4 text-left">Date</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <tr
                  key={post._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-4">
                    {post.uploadedBy
                      ? `${post.uploadedBy.firstName} ${post.uploadedBy.lastName}`
                      : "Unknown"}
                  </td>
                  <td className="py-3 px-4 font-medium">{post.title}</td>
                  <td className="py-3 px-4 text-gray-600 text-sm truncate max-w-xs">
                    {post.description.slice()}...
                  </td>
                  <td className="py-3 px-4 text-sm">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-center space-x-2">
                    <Button
                      className="bg-cyan-600 hover:bg-cyan-700 text-white text-sm rounded-3xl px-4"
                      onClick={() => setSelectedPost(post)}
                    >
                      View
                    </Button>
                    <Button
                      className="bg-red-500 hover:bg-red-600 text-white text-sm rounded-3xl px-4"
                      onClick={() => handleDelete(post._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-6 text-gray-500 italic"
                >
                  No posts found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedPost && (
        <div className="min-h-screen bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-lg max-w-2xl w-full p-6 relative">
            <h2 className="text-2xl font-semibold mb-3 text-gray-800">
              {selectedPost.title}
            </h2>
            <p className="text-gray-500 mb-1 text-sm">
              By:{" "}
              {selectedPost.uploadedBy
                ? `${selectedPost.uploadedBy.firstName} ${selectedPost.uploadedBy.lastName}`
                : "Unknown"}
            </p>
            <p className="text-gray-400 text-xs mb-4">
              {new Date(selectedPost.createdAt).toLocaleString()}
            </p>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {selectedPost.description}
            </p>
            <div className="mt-6 flex justify-end">
              <Button
                className="bg-gray-300 hover:bg-gray-400 text-black text-sm rounded-3xl px-5"
                onClick={() => setSelectedPost(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Content;
