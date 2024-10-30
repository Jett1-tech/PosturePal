import React, { useState } from "react";
import { Tag } from "antd";
import "./ColorTags.css"; // Import CSS file

const ColorTags = ({ onChange }) => {
  const [selectedColors, setSelectedColors] = useState([]);

  const colors = [
    "magenta",
    "red",
    "volcano",
    "orange",
    "gold",
    "lime",
    "green",
    "cyan",
    "blue",
    "geekblue",
    "purple",
    "#f50",
    "#2db7f5",
    "#87d068",
    "#108ee9",
  ];

  const handleTagClick = (color) => {
    const isSelected = selectedColors.includes(color);
    const newSelectedColors = isSelected
      ? selectedColors.filter((c) => c !== color)
      : [...selectedColors, color];

    setSelectedColors(newSelectedColors);
     onChange(newSelectedColors);
     console.log("Selected color", newSelectedColors);
     
  };

  return (
    <>

      <div className="color-tags-container">
        {colors.map((color) => (
          <Tag
            key={color}
            color={color}
            onClick={() => handleTagClick(color)}
            className={`color-tag ${
              selectedColors.includes(color) ? "selected" : ""
            }`}
          >
            {color}
          </Tag>
        ))}
      </div>
    </>
  );
};

export default ColorTags;
