import React, { useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { myTeamState } from "../atoms/myTeam";
import { FootballPlayer } from "./FootballPlayer";
import { FantasyNavbar } from "./fantasy";
import useAuth from "../hooks/useAuth";
import "./fantasy.css";

const MyTeam: React.FC = () => {
  const setSelectedPlayers = useSetRecoilState(myTeamState);
  const selectedPlayers = useRecoilValue(myTeamState);
  const { userId } = useAuth();

  // Load saved players from localStorage when component mounts
  useEffect(() => {
    if (userId) {
      const savedPlayers = localStorage.getItem(`selectedPlayers-${userId}`);
      if (savedPlayers) {
        setSelectedPlayers(JSON.parse(savedPlayers));
      }
    }
  }, [userId, setSelectedPlayers]);

  // Calculate total points
  const totalPoints = selectedPlayers.reduce(
    (sum, player) => sum + player.totalpoints,
    0
  );

  return (
    <div>
      <FantasyNavbar />
      <h1>My Team</h1>
      <div
        style={{
          marginBottom: "20px",
          padding: "10px",
          backgroundColor: "#f0f0f0",
          borderRadius: "5px",
          textAlign: "center",
        }}
      >
        <h2>Total Points: {totalPoints}</h2>
      </div>
      <div className="my-team">
        {selectedPlayers.map((player: FootballPlayer) => (
          <div key={player.id} className="my-team-player">
            <div>
              <img
                src={`http://localhost:4001/uploads/${player.image}`}
                alt={player.name}
                style={{
                  height: 100,
                  width: 90,
                }}
              />
            </div>
            <div>
              <div className="points">
                <h3>{player.name}</h3>
              </div>
              {/* <p>Club: {player.club}</p> */}
              {/* <p>Price: ${player.price}</p> */}
              {/* <p>Position: {player.position}</p> */}
              <div className="points">
                <p>Total Points: {player.totalpoints}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyTeam;
