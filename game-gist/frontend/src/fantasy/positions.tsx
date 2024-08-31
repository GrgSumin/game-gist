import React, { useState, useEffect } from "react";
import { PiTShirtFill } from "react-icons/pi";
import { FootballPlayer as PlayerType } from "./FootballPlayer";

interface PlayerProps {
  player: PlayerType | null;
  position: string;
  onSelect: () => void;
}

function Player({ position, player, onSelect }: PlayerProps) {
  return (
    <div
      onClick={onSelect}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
      }}
    >
      {player ? (
        <img
          src={`http://localhost:4001/uploads/${player.image}`}
          alt={player?.name || position}
          style={{
            height: 40,
            width: 40,
            borderRadius: "50%",
          }}
        />
      ) : (
        <PiTShirtFill size={40} color="gray" />
      )}
      <p
        style={{
          color: "black",
          padding: 2,
          fontSize: 10,
          width: 80,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontWeight: "bolder",
        }}
      >
        {player ? player.name : position}
      </p>
    </div>
  );
}

export default Player;
