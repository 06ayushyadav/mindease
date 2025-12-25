
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Home, User, BookOpen, Briefcase, Shield,  Heart } from "lucide-react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [isCounselorLoggedIn, setIsCounselorLoggedIn] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const [userData, setUserData] = useState<any>(null);
  const [counselorData, setCounselorData] = useState<any>(null);
  const [adminData, setAdminData] = useState<any>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const getSafe = (key: string) => {
      try {
        const val = localStorage.getItem(key);
        return val && val !== "undefined" ? JSON.parse(val) : null;
      } catch {
        return null;
      }
    };
    setUserData(getSafe("patientData"));
    setCounselorData(getSafe("counselorData"));
    setAdminData(getSafe("adminData"));

    setIsUserLoggedIn(!!localStorage.getItem("patientToken"));
    setIsCounselorLoggedIn(!!localStorage.getItem("counselorToken"));
    setIsAdminLoggedIn(!!localStorage.getItem("adminToken"));
  }, []);

  const handleLogout = (type: "patient" | "counselor" | "admin") => {
    localStorage.removeItem(`${type}Token`);
    navigate(`/${type}-login`);
    window.location.reload();
  };

  return (
    <nav className="bg-gradient-to-r from-cyan-50 to-blue-100 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div
          onClick={() => navigate("/")}
          className="font-extrabold text-3xl text-cyan-700 cursor-pointer select-none"
        >
          <span className="text-blue-600">Mind</span>Ease
        </div>

        <button
          className="md:hidden text-cyan-700 hover:text-blue-600 transition"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        <ul className="hidden md:flex gap-8 text-lg font-semibold text-gray-800">
          <Link to="/"><li className="hover:text-blue-600 transition">Home</li></Link>
          <Link to="/services"><li className="hover:text-blue-600 transition">Services</li></Link>
          <Link to="/doctors"><li className="hover:text-blue-600 transition">Doctors</li></Link>
          <Link to="/blog"><li className="hover:text-blue-600 transition">Blog</li></Link>
        </ul>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/session/enter-roomid">
            <Button className="bg-zinc-800 hover:bg-white hover:text-zinc-800 text-white rounded-full px-5">
              Join Session
            </Button>
          </Link>

          {!isUserLoggedIn ? (
            <div className="relative group">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-5">User</Button>
              <div className="absolute hidden group-hover:flex flex-col bg-white shadow-lg rounded-xl right-0 w-32 border border-blue-100">
                <Link to="/patient-login" className="px-4 py-2 hover:bg-blue-50 text-sm">Login</Link>
                <Link to="/patient-register" className="px-4 py-2 hover:bg-blue-50 text-sm">Register</Link>
              </div>
            </div>
          ) : (
            <>
              <Link to={`/patient-dashboard/${userData?._id}`}>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-5">Dashboard</Button>
              </Link>
              <Button onClick={() => handleLogout("patient")} className="bg-red-500 hover:bg-red-600 text-white rounded-full px-5">Logout</Button>
            </>
          )}

          {!isCounselorLoggedIn ? (
            <div className="relative group">
              <Button className="bg-green-600 hover:bg-green-700 text-white rounded-full px-5">Counselor</Button>
              <div className="absolute hidden group-hover:flex flex-col bg-white shadow-lg rounded-xl  right-0 w-32 border border-green-100">
                <Link to="/counselor-login" className="px-4 py-2 hover:bg-green-50 text-sm">Login</Link>
                <Link to="/counselor-register" className="px-4 py-2 hover:bg-green-50 text-sm">Register</Link>
              </div>
            </div>
          ) : (
            <>
              <Link to={`/counselor/dashboard/${counselorData?._id}`}>
                <Button className="bg-green-600 hover:bg-green-700 text-white rounded-full px-5">Dashboard</Button>
              </Link>
              <Button onClick={() => handleLogout("counselor")} className="bg-red-500 hover:bg-red-600 text-white rounded-full px-5">Logout</Button>
            </>
          )}

          {!isAdminLoggedIn ? (
            <div className="relative group">
              <Button className="bg-red-600 hover:bg-red-700 text-white rounded-full px-5">Admin</Button>
              <div className="absolute hidden group-hover:flex flex-col bg-white shadow-lg rounded-xl right-0 w-32 border border-red-100">
                <Link to="/admin-login" className="px-4 py-2 hover:bg-red-50 text-sm">Login</Link>
                <Link to="/admin-register" className="px-4 py-2 hover:bg-red-50 text-sm">Register</Link>
              </div>
            </div>
          ) : (
            <>
              <Link to={`/admin/dashboard/${adminData?._id}`}>
                <Button className="bg-red-600 hover:bg-red-700 text-white rounded-full px-5">Dashboard</Button>
              </Link>
              <Button onClick={() => handleLogout("admin")} className="bg-red-500 hover:bg-red-600 text-white rounded-full px-5">Logout</Button>
            </>
          )}
        </div>
      </div>

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-cyan-50 to-blue-100 shadow-2xl transform ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-500 ease-in-out md:hidden z-50 rounded-r-3xl`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-200">
          <div className="font-extrabold text-2xl text-cyan-700">
            <span className="text-blue-600">Mind</span>Ease
          </div>
          <X size={26} className="text-cyan-700 cursor-pointer" onClick={() => setMenuOpen(false)} />
        </div>

        {/* Links */}
        <ul className="flex flex-col gap-6 text-lg font-semibold text-gray-700 mt-8 px-6">
          <Link to="/" onClick={() => setMenuOpen(false)}><li className="flex items-center gap-3 hover:text-blue-600"><Home size={20}/> Home</li></Link>
          <Link to="/services" onClick={() => setMenuOpen(false)}><li className="flex items-center gap-3 hover:text-blue-600"><Heart size={20}/> Services</li></Link>
          <Link to="/doctors" onClick={() => setMenuOpen(false)}><li className="flex items-center gap-3 hover:text-blue-600"><User size={20}/> Doctors</li></Link>
          <Link to="/blog" onClick={() => setMenuOpen(false)}><li className="flex items-center gap-3 hover:text-blue-600"><BookOpen size={20}/> Blog</li></Link>
        </ul>

        <div className="mb-10 mt-2 px-3 flex flex-col gap-3">
          <div className="bg-white p-3 rounded-xl shadow-md border border-blue-100">
            <h4 className="text-blue-600 font-semibold mb-2 flex items-center gap-2"><User size={18}/> User</h4>
            <Link to="/patient-login" onClick={() => setMenuOpen(false)}>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full mb-2">Login</Button>
            </Link>
            <Link to="/patient-register" onClick={() => setMenuOpen(false)}>
              <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white rounded-full">Register</Button>
            </Link>
          </div>

          {/* Counselor */}
          <div className="bg-white p-2 rounded-xl shadow-md border border-green-100">
            <h4 className="text-green-600 font-semibold mb-2 flex items-center gap-2"><Briefcase size={18}/> Counselor</h4>
            <Link to="/counselor-login" onClick={() => setMenuOpen(false)}>
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white rounded-full mb-2">Login</Button>
            </Link>
            <Link to="/counselor-register" onClick={() => setMenuOpen(false)}>
              <Button className="w-full bg-green-500 hover:bg-green-600 text-white rounded-full">Register</Button>
            </Link>
          </div>

          {/* Admin */}
          <div className="bg-white p-3 rounded-xl shadow-md border border-red-100">
            <h4 className="text-red-600 font-semibold mb-2 flex items-center gap-2"><Shield size={18}/> Admin</h4>
            <Link to="/admin-login" onClick={() => setMenuOpen(false)}>
              <Button className="w-full bg-red-600 hover:bg-red-700 text-white rounded-full mb-2">Login</Button>
            </Link>
            <Link to="/admin-register" onClick={() => setMenuOpen(false)}>
              <Button className="w-full bg-red-500 hover:bg-red-600 text-white rounded-full">Register</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
