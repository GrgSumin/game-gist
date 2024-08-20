import React, { useEffect } from "react";
import "./fantasy.css";
import Player from "./positions";
import Filter from "./filter";
import PlayerList from "./playerLists";
import { useRecoilValue, useRecoilState } from "recoil";
import { myPlayersByPosition, myTeamState } from "../atoms/myTeam";
import { FootballPlayer } from "./FootballPlayer";
import useAuth from "../hooks/useAuth";

type Players = {
  FWD: (string | null)[];
  MID: (string | null)[];
  DEF: (string | null)[];
  GK: (string | null)[];
};

function Field() {
  const players = useRecoilValue(myPlayersByPosition);
  const [selectedPlayers, setSelectedPlayers] = useRecoilState(myTeamState);
  const { userId } = useAuth();

  useEffect(() => {
    if (userId) {
      const savedPlayers = localStorage.getItem(`selectedPlayers-${userId}`);
      if (savedPlayers) {
        setSelectedPlayers(JSON.parse(savedPlayers));
      } else {
        setSelectedPlayers([]); // Initialize with an empty array if no saved data
      }
    }
  }, [userId, setSelectedPlayers]);

  const handlePlayerSelect = (player: FootballPlayer) => {
    setSelectedPlayers((prev) => {
      const playerIds = new Set(prev.map((p) => p.id));
      if (!playerIds.has(player.id)) {
        return [...prev, player];
      }
      return prev;
    });
  };

  const handleConfirm = () => {
    if (selectedPlayers.length < 11) {
      alert("You must select 11 players.");
      return;
    }

    if (window.confirm("Are you sure you want to save these players?")) {
      if (userId) {
        localStorage.setItem(
          `selectedPlayers-${userId}`,
          JSON.stringify(selectedPlayers)
        );
      }
    }
  };

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
                {players[position as keyof Players]?.map((player, index) => (
                  <Player
                    key={index}
                    position={position}
                    player={player}
                    onSelect={() => handlePlayerSelect(player)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="details">
          <Filter />
          <PlayerList />
        </div>
        <button onClick={handleConfirm}>Confirm Selection</button>
      </div>
    </div>
  );
}

export default Field;
