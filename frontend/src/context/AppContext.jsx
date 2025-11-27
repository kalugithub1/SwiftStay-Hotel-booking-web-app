import axios from "axios";
import { useContext, useEffect, useState, createContext } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";

// Set base URL for axios from environment variable
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

// Create the App context
const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Currency symbol, defaults to "$" if not set
  const currency = import.meta.env.VITE_CURRENCY || "$";

  // Navigation hook from react-router
  const navigate = useNavigate();

  // Clerk hooks for user info and authentication token
  const { user } = useUser();
  const { getToken } = useAuth();

  // App state
  const [isOwner, setIsOwner] = useState(false); // Checks if user is a hotel owner
  const [showHotelReg, setShowHotelReg] = useState(false); // Toggle hotel registration modal

  const [searchCities, setSearchCities] = useState([]); // Stores recent searched cities

  const [rooms, setRooms] = useState([]); // Stores all rooms fetched from backend

  // Fetch all rooms from backend
  const fetchRooms = async () => {
    try {
      const { data } = await axios.get("/api/rooms");
      if (data.success) {
        setRooms(data.rooms);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Fetch current user info including role and recent searched cities
  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        setIsOwner(data.role === "hotelOwner");
        setSearchCities(data.recentSearchedCities);
      } else {
        // Retry to fetch User Details after 5 seconds

        setTimeout(() => {
          fetchUser();
        }, 5000);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Fetch user info on login or when user changes

  useEffect(() => {
    if (user) {
      fetchUser();
    }
  }, [user]);

  // Fetch rooms on component mount

  useEffect(() => {
    fetchRooms();
  }, []);

  // Context value containing state and utility functions
  const value = {
    currency,
    navigate,
    user,
    getToken,
    isOwner,
    setIsOwner,
    axios,
    showHotelReg,
    setShowHotelReg,
    searchCities,
    setSearchCities,
    rooms,
    setRooms,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook to use AppContext in components
export const useAppContext = () => useContext(AppContext);
