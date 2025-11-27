import React from "react";

// Title component renders a section heading with a title and optional subtitle.
const Title = ({ title, subtitle, align, font }) => {
  return (
    <div
      className={`flex flex-col justify-center items-center text-center ${
        align === "left" && "md:items-start md:text-left"
      }`}
    >
      {/* Main heading */}
      <h1 className={`text-4xl md:text-[40px] ${font || "font-playfair"}`}>
        {title}
      </h1>

      {/* Subtitle */}
      <p className="text-sm md:text-base text-gray-500/90 mt-2 max-w-174">
        {subtitle}
      </p>
    </div>
  );
};

export default Title;
