import "./fantasy.css";
import Player from "./player";
import Playerlist from "./player-list";
import { footballplayers } from "./FootballPlayer";
import Filter from "./filter";
import { useState } from "react";

type Players = {
  FWD: (string | null)[];
  Mid: (string | null)[];
  DEF: (string | null)[];
  GK: (string | null)[];
};

const players: Players = {
  FWD: [null, null, null],
  Mid: [null, null, null],
  DEF: [null, null, null, null],
  GK: [null],
};

function Field() {
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);

  const filteredPlayers = selectedPosition
    ? footballplayers.filter(
        (player: Player) => player.position === selectedPosition
      )
    : footballplayers;
  return (
    <div style={{ color: "white" }}>
      <div className="field">
        <div className="player">
          {Object.keys(players).map((position, index) => (
            <div
              key={position}
              className={`position-${index}`}
              style={{
                position: "absolute",
                top: `${16 + index * 20}%`,
                color: "black",
                fontWeight: "bold",
                width: "500px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: "400px",
                  justifyContent: "space-around",
                }}
              >
                {players[position as keyof Players].map((player, index) => (
                  <Player position={position} />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="details">
          <Filter setSelectedPosition={setSelectedPosition} />
          {footballplayers.map((player: any) => (
            <Playerlist player={player} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Field;
