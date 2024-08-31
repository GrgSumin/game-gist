import React, { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { myTeamState } from "../atoms/myTeam";
import { FootballPlayer } from "./FootballPlayer";
import { FantasyNavbar } from "./fantasy";
import useAuth from "../hooks/useAuth";
import "./team.css";

const MyTeam: React.FC = () => {
  const setSelectedPlayers = useSetRecoilState(myTeamState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userId } = useAuth();

  useEffect(() => {
    const fetchSelectedPlayers = async () => {
      if (userId) {
        try {
          const response = await fetch(
            `http://localhost:4001/api/players/${userId}`
          );
          if (!response.ok) {
            throw new Error("FaileWd to fetch selected players");
          }
          const data = await response.json();
          setSelectedPlayers(data); // Adjust this based on your API response
          setLoading(false); // Update loading state
        } catch (error) {
          console.error("Error fetching selected players:", error);
          setError("Failed to fetch selected players.");
          setLoading(false); // Update loading state
        }
      }
    };

    fetchSelectedPlayers();
  }, [userId, setSelectedPlayers]);

  // Retrieve selected players from Recoil state
  const selectedPlayers = useRecoilValue(myTeamState);

  // Calculate total points
  const totalPoints = selectedPlayers.reduce(
    (sum, player) => sum + player.totalpoints,
    0
  );

  if (loading) return <p>Loading...</p>; // Loading state
  if (error) return <p>{error}</p>; // Error state

  return (
    <div>
      <FantasyNavbar />
      <div
        style={{
          margin: "auto",
          marginBottom: "30px",
          padding: "10px",
          backgroundColor: "#f0f0f0",
          borderRadius: "5px",
          textAlign: "center",
          marginTop: "30px",
          width: "20%",
        }}
      >
        <h1>My Team</h1>
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
