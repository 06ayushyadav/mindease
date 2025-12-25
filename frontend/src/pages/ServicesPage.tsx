import{ useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// import mental from "../../public/mental1-ser.png"
// import career from "../../public/career.jpg"
// import relation from "../../public/relation.jpg"

interface Service {
  id: number;
  name: string;
  description: string;
  duration: string;
  experience: string;
  category: string;
  image: string;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const doctorPage = () => {
    navigate("/doctors");
  };

  useEffect(() => {
    setTimeout(() => {
      setServices([
        {
          id: 1,
          name: "Mental Health Counseling",
          description:
            "Personal sessions designed to help you overcome anxiety, stress, and emotional challenges with professional guidance.",
          duration: "45 min / session",
          experience: "5+ Years Experience",
          category: "Emotional Wellness",
          image:"../../public/mental1-ser.png",
        },
        {
          id: 2,
          name: "Career Guidance",
          description:
            "Discover your strengths, set career goals, and plan your future path with expert counseling support.",
          duration: "60 min / session",
          experience: "4+ Years Experience",
          category: "Career & Growth",
          image:"../../public/career.jpg",
        },
        {
          id: 3,
          name: "Relationship Therapy",
          description:
            "Build stronger and healthier relationships through better communication and emotional understanding.",
          duration: "50 min / session",
          experience: "5+ Years Experience",
          category: "Couple & Family",
          image:"../../public/relation.jpg",
        },
      ]);
      setLoading(false);
    }, 100);
  }, []);

  const filteredServices = services.filter(
    (service) =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-50 to-indigo-100">
        <p className="text-lg text-blue-600 font-medium animate-pulse">
          Loading services...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-cyan-50">
      <div className="max-w-7xl mx-auto py-10 px-6 min-h-screen">
      <h1 className="text-4xl font-extrabold text-center text-blue-700 mb-8 drop-shadow-md">
        Our Counseling Services
      </h1>

      {/* Search Bar */}
      <div className="mb-10 flex justify-center">
        <Input
          type="text"
          placeholder="🔍 Search services..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-1/2 p-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400 transition"
        />
      </div>

      {/* Services Grid */}
      {filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredServices.map((service) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              whileHover={{ scale: 1.04 }}
            >
              <Card className="overflow-hidden rounded-2xl shadow-xl bg-white hover:shadow-2xl transition-all duration-300 border border-gray-100">
                <img
                  src={service.image}
                  alt={service.name}
                  className="h-52 w-full object-cover rounded-t-2xl"
                />
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-blue-700">
                    {service.name}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {service.category}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 text-sm leading-relaxed mb-4">
                    {service.description}
                  </p>
                  <div className="flex flex-col gap-1 text-sm text-gray-600">
                    <p>
                      ⏱ <span className="font-medium">{service.duration}</span>
                    </p>
                    <p>
                      🧠 <span className="font-medium">{service.experience}</span>
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 shadow-md hover:shadow-xl transition-transform hover:scale-[1.02]"
                    onClick={doctorPage}
                  >
                    Book Session
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 text-lg mt-16">
          No services found 😕 Try searching something else.
        </p>
      )}
    </div>
    </div>
  );
}

