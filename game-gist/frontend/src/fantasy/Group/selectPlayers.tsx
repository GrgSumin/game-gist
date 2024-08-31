import React, { useEffect, useState } from "react";
import { Typography, Box, Button } from "@mui/material";
import { toast } from "react-toastify";
import "./group.css"; // Import the CSS file

interface Player {
  id: string;
  name: string;
  totalpoints: number;
  image: string;
}

interface SelectedPlayersProps {
  userId: string;
  onBack: () => void;
}

const SelectedPlayers: React.FC<SelectedPlayersProps> = ({
  userId,
  onBack,
}) => {
  const [selectedPlayerData, setSelectedPlayerData] = useState<Player[]>([]);
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:4001/api/players/${userId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch selected players");
        }
        const data = await response.json();
        setSelectedPlayerData(data); // Adjust this based on your API response

        const points = data.reduce(
          (sum: number, player: Player) => sum + player.totalpoints,
          0
        );
        setTotalPoints(points);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching selected players:", error);
        setError("Failed to fetch selected players.");
        setLoading(false);
      }
    };

    fetchPlayers();
  }, [userId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Box className="selected-players-container">
      <Button variant="outlined" onClick={onBack} className="back-button">
        Back to Group List
      </Button>
      <Typography
        variant="h6"
        className="group-details"
        style={{ textAlign: "center" }}
      >
        Total Points: {totalPoints}
      </Typography>
      <div className="my-team">
        {selectedPlayerData.map((player) => (
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
    </Box>
  );
};

export default SelectedPlayers;
