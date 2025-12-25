import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-blue-900 text-white py-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">

        <div>
          <h2 className="text-2xl font-bold mb-3 text-indigo-300">MindEase</h2>
          <p className="text-gray-300 text-sm">
            A compassionate mental wellness platform connecting you with
            certified counselors and AI-powered self-care tools.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3 text-indigo-200">Quick Links</h3>
          <ul className="space-y-2 text-gray-300">
            <li>
              <Link to="/" className="hover:text-indigo-400 transition">Home</Link>
            </li>
            <li>
              <Link to="/services" className="hover:text-indigo-400 transition">Services</Link>
            </li>
            <li>
              <Link to="/doctors" className="hover:text-indigo-400 transition">Counselors</Link>
            </li>
            <li>
              <Link to="/blog" className="hover:text-indigo-400 transition">Blog</Link>
            </li>
            <li>
              <Link to="/counselor/login" className="hover:text-indigo-400 transition">Counselor Login</Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3 text-indigo-200">Contact</h3>
          <p className="text-gray-300 text-sm mb-4">
            📍 R J College, Mumbai<br />
            📧 support@mindease.in<br />
            📞 +91 98765 43210
          </p>

          <div className="flex space-x-4">
            <a href="#" className="hover:text-indigo-400 transition"><Facebook size={20} /></a>
            <a href="#" className="hover:text-indigo-400 transition"><Instagram size={20} /></a>
            <a href="#" className="hover:text-indigo-400 transition"><Twitter size={20} /></a>
            <a href="#" className="hover:text-indigo-400 transition"><Linkedin size={20} /></a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-400 mt-8 pt-4 text-center text-sm text-gray-300">
        © 2025 MindEase Platform. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
