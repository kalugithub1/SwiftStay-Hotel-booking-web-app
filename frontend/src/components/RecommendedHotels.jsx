import React, { useEffect, useState } from "react";
import HotelCard from "./HotelCard";
import Title from "./Title";
import { useAppContext } from "../context/AppContext";

// RecommendedHotels component displays a list of hotels filtered
// based on the user's recent searched cities.
const RecommendedHotels = () => {
  // Get the full list of rooms and recently searched cities from context
  const { rooms, searchCities } = useAppContext();

  // Local state to store filtered recommended hotels
  const [recommended, setRecommended] = useState([]);

  // Function to filter hotels based on searchCities
  const filterHotels = () => {
    const filteredHotels = rooms
      .slice()
      .filter((room) => searchCities.includes(room.hotel.city));
    setRecommended(filteredHotels);
  };

  // Run the filter function whenever the list of rooms or searchCities changes
  useEffect(() => {
    filterHotels();
  }, [rooms, searchCities]);

  // Render the recommended hotels section only if there are recommendations
  return (
    recommended.length > 0 && (
      <div className="flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 py-20">
        <Title
          title="Recommended Hotels"
          subtitle="Discover our handpicked selection of exceptional properties in Kenya, offering unparalleled luxury and unforgettable experiences."
        />

        {/* Hotel cards grid */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-20">
          {recommended.slice(0, 4).map((room, index) => (
            <HotelCard key={room._id} room={room} index={index} />
          ))}
        </div>
      </div>
    )
  );
};

export default RecommendedHotels;
