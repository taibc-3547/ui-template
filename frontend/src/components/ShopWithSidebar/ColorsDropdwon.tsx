"use client";
import React, { useState } from "react";

interface ColorsDropdownProps {
  selected: string[];
  onSelect: (color: string) => void;
}

const ColorsDropdown = ({ selected, onSelect }: ColorsDropdownProps) => {
  const [toggleDropdown, setToggleDropdown] = useState(true);
  const colors = ["red", "blue", "orange", "pink", "purple"];

  return (
    <div className="bg-white shadow-1 rounded-lg">
      {/* ... existing dropdown header ... */}
      <div className={`flex-wrap gap-2.5 p-6 ${
        toggleDropdown ? "flex" : "hidden"
      }`}>
        {colors.map((color, key) => (
          <label
            key={key}
            htmlFor={color}
            className="cursor-pointer select-none flex items-center"
          >
            <div className="relative">
              <input
                type="checkbox"
                name="color"
                id={color}
                className="sr-only"
                checked={selected.includes(color)}
                onChange={() => onSelect(color)}
              />
              <div
                className={`flex items-center justify-center w-5.5 h-5.5 rounded-full ${
                  selected.includes(color) && "border"
                }`}
                style={{ borderColor: color }}
              >
                <span
                  className="block w-3 h-3 rounded-full"
                  style={{ backgroundColor: color }}
                ></span>
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default ColorsDropdown; 