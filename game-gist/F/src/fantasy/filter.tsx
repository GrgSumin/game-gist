import React from 'react';

interface FilterProps {
  setSelectedPosition: (position: string | null) => void;
}

function Filter({ setSelectedPosition }: FilterProps) {
  const handleFilterClick = (position: string | null) => {
    setSelectedPosition(position);
  };

  return (
    <div className="filter">
      <button className="filter-button" onClick={() => handleFilterClick(null)}>
        All
      </button>
      <button className="filter-button" onClick={() => handleFilterClick('FWD')}>
        FW
      </button>
      <button className="filter-button" onClick={() => handleFilterClick('MID')}>
        MF
      </button>
      <button className="filter-button" onClick={() => handleFilterClick('DEF')}>
        DF
      </button>
      <button className="filter-button" onClick={() => handleFilterClick('GK')}>
        GK
      </button>
    </div>
  );
}

export default Filter;
