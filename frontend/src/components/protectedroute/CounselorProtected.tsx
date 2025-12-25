import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactElement;
}

const CounselorProtected: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem("counselorToken");

  if (!token) {
    return <Navigate to="/counselor-login" replace />;
  }

  return children;
};

export default CounselorProtected