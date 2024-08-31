import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import {
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  FormGroup,
  Box,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./CreateTeam.css"; // Import CSS

interface Player {
  _id: string;
  name: string;
  club: string;
  position: string; // Add position field
}

const CreateTeam: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]); // State for filtered players
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [teamName, setTeamName] = useState<string>("");
  const [clubFilter, setClubFilter] = useState<string>(""); // Club filter
  const [positionFilter, setPositionFilter] = useState<string>(""); // Position filter

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await fetch(
          "http://localhost:4001/api/footballplayers/players"
        );
        const data = await response.json();
        setPlayers(data);
        setFilteredPlayers(data); // Initially show all players
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    };
    fetchPlayers();
  }, []);

  // Filter players based on club and position
  useEffect(() => {
    const filtered = players.filter((player) => {
      return (
        (clubFilter === "" || player.club.includes(clubFilter)) &&
        (positionFilter === "" || player.position.includes(positionFilter))
      );
    });
    setFilteredPlayers(filtered);
  }, [clubFilter, positionFilter, players]);

  const handlePlayerSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSelectedPlayers((prev) =>
      prev.includes(value)
        ? prev.filter((id) => id !== value)
        : [...prev, value]
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:4001/api/teams/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: teamName, players: selectedPlayers }),
      });
      const data = await response.json();
      toast.success("Team created successfully!");
      console.log(data);
    } catch (error) {
      toast.error("Error creating team.");
      console.error("Error creating team:", error);
    }
  };

  return (
    <div className="form-container-team">
      <form onSubmit={handleSubmit}>
        <TextField
          className="input-field"
          fullWidth
          value={teamName}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setTeamName(e.target.value)
          }
          placeholder="Team Name"
          required
        />
        <Box display="flex" gap={2} className="filters">
          <TextField
            className="input-field"
            label="Filter by Club"
            value={clubFilter}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setClubFilter(e.target.value)
            }
            fullWidth
          />
          <TextField
            className="input-field"
            label="Filter by Position"
            value={positionFilter}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPositionFilter(e.target.value)
            }
            fullWidth
          />
        </Box>
        <FormGroup>
          {filteredPlayers.map((player) => (
            <FormControlLabel
              key={player._id}
              control={
                <Checkbox
                  value={player._id}
                  onChange={handlePlayerSelect}
                  checked={selectedPlayers.includes(player._id)}
                />
              }
              label={`${player.name} (${player.club}) - ${player.position}`}
            />
          ))}
        </FormGroup>
        <Button type="submit" variant="contained">
          Create Team
        </Button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default CreateTeam;
