import React from "react";
import { assets } from "../assets/assets";

// StarRating component displays a 5-star rating based on the `rating` prop
// Default rating is 4 if no prop is provided
const StarRating = ({ rating = 4 }) => {
  return (
    <>
      {Array(5)
        .fill("")
        .map((_, index) => (
          <img
            key={index}
            src={
              rating > index ? assets.starIconFilled : assets.starIconOutlined
            }
            alt="Star-icon"
            className="w-4.5 h-4.5"
          />
        ))}
    </>
  );
};

export default StarRating;
