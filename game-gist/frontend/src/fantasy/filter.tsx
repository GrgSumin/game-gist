import React from "react";

interface FilterProps {
  setSelectedPosition: (position: string | null) => void;
}

function Filter({ setSelectedPosition }: FilterProps) {
  const handleFilterClick = (position: string) => {
    setSelectedPosition(position === "All" ? null : position);
  };
  return (
    <div className="filter">
      <div
        className="filter-container"
        onClick={() => handleFilterClick("FWD")}
      >
        <h4 className="filter-text">FW</h4>
      </div>
      <div
        className="filter-container"
        onClick={() => handleFilterClick("MID")}
      >
        <h4 className="filter-text">MF</h4>
      </div>
      <div
        className="filter-container"
        onClick={() => handleFilterClick("DEF")}
      >
        <h4 className="filter-text">DF</h4>
      </div>
      <div className="filter-container" onClick={() => handleFilterClick("GK")}>
        <h4 className="filter-text">GK</h4>
      </div>
      <div className="filter-container">
        <h4 className="filter-button" onClick={() => handleFilterClick("All")}>
          All
        </h4>
      </div>
    </div>
  );
}

export default Filter;
