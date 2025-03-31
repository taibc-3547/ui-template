import React, { useState, useEffect } from "react";

const CustomSelect = ({ options, onSelect, selectedOption: controlledSelectedOption }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(
    controlledSelectedOption || options?.[0] || { label: "All" }
  );

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    onSelect?.(option);
    toggleDropdown();
  };

  useEffect(() => {
    // closing modal while clicking outside
    function handleClickOutside(event) {
      if (!event.target.closest(".dropdown-content")) {
        toggleDropdown();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (controlledSelectedOption) {
      setSelectedOption(controlledSelectedOption);
    } else {
      setSelectedOption(options?.[0] || { label: "All" });
    }
  }, [options, controlledSelectedOption]);

  return (
    <div className="dropdown-content custom-select relative" style={{ width: "200px" }} onBlur={() => setIsOpen(false)}>
      <div
        className={`select-selected whitespace-nowrap ${
          isOpen ? "select-arrow-active" : ""
        }`}
        onClick={toggleDropdown}
      >
        {selectedOption?.header}
      </div>
      <div className={`select-items ${isOpen ? "" : "select-hide"}`}>
        {options?.map((option, index) => (
          <div
            key={index}
            onClick={() => handleOptionClick(option)}
            className={`select-item ${
              selectedOption === option ? "same-as-selected" : ""
            }`}
          >
            {option.header}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomSelect;
