import { useEffect } from "react";
import { useRecoilValue, useRecoilState } from "recoil";
import { myPlayersByPosition, myTeamState } from "../atoms/myTeam";
import Player from "./positions";
import { FootballPlayer } from "./FootballPlayer";
import Filter from "./filter";
import PlayerList from "./playerLists";
import useAuth from "../hooks/useAuth";
import { FantasyNavbar } from "./fantasy";
import Teamstats from "./team-stats";
import "./fantasy.css";

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

  const handleConfirm = async () => {
    if (selectedPlayers.length < 11) {
      alert("You must select 11 players.");
      return;
    }

    if (window.confirm("Are you sure you want to save these players?")) {
      if (userId) {
        // Save to localStorage
        localStorage.setItem(
          `selectedPlayers-${userId}`,
          JSON.stringify(selectedPlayers)
        );

        // Save to backend
        try {
          const response = await fetch(
            "http://localhost:4001/api/players/save",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                userId,
                selectedPlayers,
              }),
            }
          );

          if (response.ok) {
            alert("Players saved successfully.");
          } else {
            const errorData = await response.json();
            alert(`Failed to save players: ${errorData.message}`);
          }
        } catch (error) {
          console.error("Error saving players:", error);
          alert("An error occurred while saving players.");
        }
      }
    }
  };

  return (
    <div>
      <FantasyNavbar />
      <div className="fieldss">
        <Teamstats />
        <div className="field">
          <div className="player">
            {Object.keys(players).map((position, index) => (
              <div
                key={position}
                className={`position-container position-${index}`}
              >
                <div className="position-inner">
                  {players[position as keyof Players]?.map((player, index) => (
                    <Player
                      key={index}
                      position={position}
                      player={player}
                      onSelect={() =>
                        handlePlayerSelect(player as FootballPlayer)
                      }
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
        </div>
        <button onClick={handleConfirm}>Confirm Selection</button>
      </div>
    </div>
  );
}

export default Field;
