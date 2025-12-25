import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactElement;
}

const PatientProtected: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem("patientToken");

  if (!token) {
    return <Navigate to="/patient-login" replace />;
  }

  return children;
};

export default PatientProtected;
