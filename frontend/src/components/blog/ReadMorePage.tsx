import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "@/apis/axios";
import { ThumbsUp, ThumbsDown } from "lucide-react";

const ReadMorePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [userReaction, setUserReaction] = useState(null); 

  const handleBack = () => navigate("/blog");

  const fetchSingleBlog = async () => {
    try {
      const res = await api.get(`/api/resource/readmore/${id}`);
      setBlog(res.data.resource);
    } catch (error) {
      console.error("Error fetching resource:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSingleBlog();
    const savedReaction = localStorage.getItem(`reaction_${id}`);
    const savedLikes = localStorage.getItem(`likes_${id}`);
    const savedDislikes = localStorage.getItem(`dislikes_${id}`);

    if (savedReaction) setUserReaction(savedReaction);
    if (savedLikes) setLikes(parseInt(savedLikes));
    if (savedDislikes) setDislikes(parseInt(savedDislikes));
  }, [id]);

  useEffect(() => {
    localStorage.setItem(`likes_${id}`, likes.toString());
    localStorage.setItem(`dislikes_${id}`, dislikes.toString());
    if (userReaction) localStorage.setItem(`reaction_${id}`, userReaction);
  }, [likes, dislikes, userReaction, id]);

  const handleLike = () => {
    if (userReaction === "like") {
      setLikes((prev) => prev -1);
      setUserReaction(null);
    } else {
      setLikes((prev) => prev + 1);
      if (userReaction === "dislike") setDislikes((prev) => prev - 1);
      setUserReaction("like");
    }
  };

  const handleDislike = () => {
    if (userReaction === "dislike") {
      setDislikes((prev) => prev - 1);
      setUserReaction(null);
    } else {
      setDislikes((prev) => prev + 1);
      if (userReaction === "like") setLikes((prev) => prev - 1);
      setUserReaction("dislike");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-500">Loading resource...</p>
      </div>
    );

  if (!blog)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-red-500">Resource not found 😕</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 flex justify-center py-10 px-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden transition-transform transform hover:scale-[1.01] duration-300">
 
        {blog.fileUrl ? (
          <img src={blog.fileUrl} alt={blog.title} className="w-full h-72 object-cover" />
        ) : (
          <div className="h-72 flex justify-center items-center bg-gray-100 text-gray-400">
            No Image Available
          </div>
        )}

        <div className="p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-3">{blog.title}</h1>

          <div className="flex flex-wrap gap-3 text-gray-600 text-sm mb-6">
            <span>✍️ <strong>{blog.uploadedBy?.firstName} {blog.uploadedBy?.lastName}</strong></span>
            <span>📅 {new Date(blog.createdAt).toLocaleDateString()}</span>
          </div>

          <p className="text-gray-800 text-lg leading-relaxed whitespace-pre-line mb-8">
            {blog.description || "No description available."}
          </p>

          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-8">
              {blog.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}


          {blog.fileUrl && (
            <div className="mb-8">
              <a
                href={blog.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline font-medium"
              >
                📄 View / Download Resource
              </a>
            </div>
          )}

          {blog.externalUrl && (
            <div className="mb-8">
              <a
                href={blog.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline font-medium"
              >
                🌐 Open External Link
              </a>
            </div>
          )}


          <div className="flex justify-center items-center gap-6 my-8">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-5 py-2 rounded-full font-semibold shadow-md transition-all duration-300 ${
                userReaction === "like"
                  ? "bg-green-500 text-white scale-110"
                  : "bg-gray-200 text-gray-700 hover:bg-green-100"
              }`}
            >
              <ThumbsUp size={22} />
              {likes}
            </button>

            <button
              onClick={handleDislike}
              className={`flex items-center gap-2 px-5 py-2 rounded-full font-semibold shadow-md transition-all duration-300 ${
                userReaction === "dislike"
                  ? "bg-red-500 text-white scale-110"
                  : "bg-gray-200 text-gray-700 hover:bg-red-100"
              }`}
            >
              <ThumbsDown size={22} />
              {dislikes}
            </button>
          </div>

          {/* Back Button */}
          <div className="text-center">
            <button
              onClick={handleBack}
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold text-lg transition-all duration-300 shadow-md"
            >
              ← Back to Blogs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadMorePage;
