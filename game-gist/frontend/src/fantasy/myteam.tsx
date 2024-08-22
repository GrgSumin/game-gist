import React from "react";
import { useRecoilValue } from "recoil";
import { myTeamState } from "../atoms/myTeam";
import { FootballPlayer } from "./FootballPlayer";
import { FantasyNavbar } from "./fantasy";

const MyTeam: React.FC = () => {
  const selectedPlayers = useRecoilValue(myTeamState);

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
      <div className="my-team" style={{}}>
        {selectedPlayers.map((player: FootballPlayer) => (
          <div
            key={player.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "5px",
              padding: "10px",
              width: "500px",
              backgroundColor: "white",
              margin: "auto",
            }}
          >
            <div style={{ display: "flex", gap: "50px", margin: 20 }}>
              <div className="">
                <img
                  src={`${
                    window.location.origin
                  }/team/${player.club.toLowerCase()}.png`}
                  alt={player.name}
                  style={{
                    height: 100,
                    width: 70,
                  }}
                />
              </div>
              <div className="">
                <h3>{player.name}</h3>
                <p>Club: {player.club}</p>
                <p>Price: ${player.price}</p>
                <p>Position: {player.position}</p>
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
