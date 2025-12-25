import { useState } from "react";

const ManageContent = () => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    contentType: "video", 
    videoUrl: "",
    visibility: "public",
  });

  const [contents, setContents] = useState([]);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setContents([...contents, formData]);
    setSuccess(true);

    setFormData({
      title: "",
      category: "",
      description: "",
      contentType: "video",
      videoUrl: "",
      visibility: "public",
    });

    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-6 mt-10 border border-gray-200">
      <h2 className="text-2xl font-semibold text-center mb-6 text-blue-900">
        Manage Mental Wellness Content
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3 ">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Guided Meditation for Stress Relief"
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            required
          >
            <option value="">Select Category</option>
            <option value="meditation">Meditation</option>
            <option value="stress-relief">Stress Relief</option>
            <option value="motivation">Motivation</option>
            <option value="self-care">Self Care</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Content Type
          </label>
          <select
            name="contentType"
            value={formData.contentType}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          >
            <option value="video">Video</option>
            <option value="article">Article</option>
          </select>
        </div>

        {formData.contentType === "video" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Video URL (YouTube or any public link)
            </label>
            <input
              type="url"
              name="videoUrl"
              value={formData.videoUrl}
              onChange={handleChange}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description / Notes
          </label>
          <textarea
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            placeholder="Short note about this content..."
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Visibility
          </label>
          <select
            name="visibility"
            value={formData.visibility}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          >
            <option value="public">Public</option>
            <option value="private">Private (Counselors Only)</option>
          </select>
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition duration-200"
          >
            Add Content
          </button>
        </div>
      </form>

      {success && (
        <p className="text-green-600 text-center mt-4">
          ✅ Content added successfully!
        </p>
      )}

      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          📚 Uploaded Contents
        </h3>
        {contents.length === 0 ? (
          <p className="text-gray-500">No content added yet.</p>
        ) : (
          <div className="space-y-6">
            {contents.map((item, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 bg-gray-50 shadow-sm"
              >
                <h4 className="text-lg font-semibold text-blue-900">
                  {item.title}
                </h4>
                <p className="text-sm text-gray-600 mb-2">
                  Category: {item.category} | Type: {item.contentType}
                </p>
                <p className="text-gray-700">{item.description}</p>

                {item.contentType === "video" && (
                  <div className="mt-3">
                    <iframe
                      className="w-full h-64 rounded-lg"
                      src={item.videoUrl.replace("watch?v=", "embed/")}
                      title={item.title}
                      allowFullScreen
                    ></iframe>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageContent;
