import React, { useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { useParams } from "react-router-dom";

// Loader component with a spinning animation
// It optionally navigates to a next URL after a delay

const Loader = () => {
  const { navigate } = useAppContext(); // Global context navigation function
  const { nextUrl } = useParams(); // Optional next URL from route parameters

  // Navigate to nextUrl after 8 seconds if provided
  useEffect(() => {
    if (nextUrl) {
      setTimeout(() => {
        navigate(`/${nextUrl}`);
      }, 8000);
    }
  }, [nextUrl]);
  return (
    // Full-screen loader container
    <div className="flex justify-center items-center h-screen">
      {/* Spinning circle loader */}
      <div className="animate-spin rounded-full h-24 w-24 border-4 border-gray-300 border-t-primary"></div>
      {/* Loading message for better UX */}
      <p className="text-gray-600 text-lg font-medium">Loading...</p>
    </div>
  );
};

export default Loader;
