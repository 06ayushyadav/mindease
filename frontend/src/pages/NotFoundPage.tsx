import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotFound: React.FC = () => {
    const navigate=useNavigate();
    const onClickHome=()=>{
        navigate("/")
    }
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-indigo-100 to-white text-center px-4">
      <AlertTriangle className="text-indigo-600 w-16 h-16 mb-6 animate-bounce" />
      <h1 className="text-6xl font-bold text-gray-800 mb-2">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
      <p className="text-gray-500 max-w-md mb-8">
        The page you’re looking for doesn’t exist or has been moved.  
        Please check the URL or go back to the home page.
      </p>
      <Link to="/">
        <Button onClick={onClickHome} className="px-6 py-2 text-lg rounded-2xl shadow-md hover:scale-105 transition">
          Go Home
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
