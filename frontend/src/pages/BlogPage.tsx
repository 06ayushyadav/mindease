
import { useEffect, useState } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import api from "@/apis/axios";

export default function BlogPage() {
    const [blogs, setBlogs] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const readMore = (blogId: string) => {
        navigate(`/blog/read-more/${blogId}`);
    };

    const fetchResource = async () => {
        try {
            const response = await api.get(`/api/resource/get`);
            setBlogs(response.data.resources);
            setLoading(false);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchResource();
    }, []);

    const filteredBlogs = blogs.filter(
        (blog) =>
            blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            blog.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gradient-to-r from-cyan-50 via-white to-blue-100">
                <p className="text-lg text-gray-500 animate-pulse">Loading blogs...</p>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-cyan-50 to-blue-100">
        <div className="max-w-6xl mx-auto p-6 min-h-screen ">
            <div className="text-center mb-4">
                <h1 className="text-4xl font-bold text-blue-900 mb-1">
                    Mental Wellness Articles
                </h1>
                <p className="text-blue-700 text-lg">
                    Learn, read, and empower yourself with expert mental health guidance
                </p>
            </div>

            <div className="mb-8 flex  justify-center">
                <Input
                    type="text"
                    placeholder="Search blogs by title or topic..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-1/2 border border-cyan-500 rounded-xl shadow-sm p-3 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                />
            </div>

            {filteredBlogs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredBlogs.map((blog) => (
                        <Card
                            key={blog._id}
                            className="overflow-hidden bg-cyan-50 transform transition hover:scale-105 hover:shadow-2xl hover:shadow-gray-500 rounded-2xl shadow-md border border-gray-100"
                        >
                            {blog.fileUrl ? (
                                <img
                                    src={blog.fileUrl}
                                    alt={blog.title}
                                    className="h-52 w-full object-fill rounded-t-2xl"
                                />
                            ) : (
                                <div className="h-40 bg-gray-200 flex justify-center items-center text-gray-500 rounded-t-2xl">
                                    No Image
                                </div>
                            )}

                            <CardHeader className="px-4 pt-4 ">
                                <CardTitle className="text-lg font-semibold text-blue-900">
                                    {blog.title}
                                </CardTitle>
                                <CardDescription className="text-sm text-gray-500 mt-1">
                                    {blog.uploadedBy?.firstName
                                        ? `${blog.uploadedBy.firstName} ${blog.uploadedBy.lastName || ""}`
                                        : "Unknown Author"}{" "}
                                    • {new Date(blog.createdAt).toLocaleDateString()}
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="px-4">
                                <p className="text-gray-700 text-sm line-clamp-3">
                                    {blog.description || "No description available."}
                                </p>
                            </CardContent>

                            <CardFooter className="px-4 pb-4 flex justify-between items-center">
                                <span className="text-sm text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-full">
                                    {blog.tags?.[0] ? `#${blog.tags[0]}` : "#General"}
                                </span>
                                <Button
                                    className="bg-blue-600 text-white py-2 px-3 hover:bg-blue-700 transition-colors duration-200 font-semibold rounded-lg text-sm"
                                    onClick={() => readMore(blog._id)}
                                >
                                    Read More
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500 mt-10 text-lg">
                    No resources found 😕
                </p>
            )}
        </div>
        </div>
    );
}
