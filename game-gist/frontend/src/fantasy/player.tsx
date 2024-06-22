import React from "react";
import { PiTShirtFill } from "react-icons/pi";

interface PlayerProps {
  position: string;
}

function Player({ position }: PlayerProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <PiTShirtFill size={40} color="gray" />
      <p
        style={{
          color: "white",
          backgroundColor: "gray",
          padding: 2,
          fontSize: 12,
          width: 30,
          display: "flex",
          justifyContent: "center",
          border: "1px solid",
        }}
      >
        {position}
      </p>
    </div>
  );
}

export default Player;
