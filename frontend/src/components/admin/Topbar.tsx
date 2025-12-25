
import { useEffect, useState } from "react";

type Admin = {
  _id: string;
  name: string;
  email: string;
  role: string;
};

const Topbar = () => {

  
  const [admin,setAdmin]=useState<Admin| null >(null);

  useEffect(()=>{
    const storeAdmin= localStorage.getItem("adminData")
    if(storeAdmin){
      setAdmin(JSON.parse(storeAdmin))
    }
  },[])

  if(!admin) return <div>Loading...</div>

  return (
    <div className="bg-white shadow-md p-4 flex justify-between items-center">
      <h3 className="text-lg font-semibold text-gray-800">Admin Panel</h3>
      <div className="flex items-center gap-3">
        <p className="text-sm text-gray-700">Welcome, {admin.name}</p>
        <img
          src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
          alt="Admin Avatar"
          className="w-8 h-8 rounded-full border"
        />
      </div>
    </div>
  );
};

export default Topbar;
