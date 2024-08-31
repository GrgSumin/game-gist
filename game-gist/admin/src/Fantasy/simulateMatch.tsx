import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import {
  TextField,
  MenuItem,
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import "./fanatsy.css"; // Import CSS

interface Team {
  _id: string;
  name: string;
}

const SimulateMatch: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamA, setTeamA] = useState<string>("");
  const [teamB, setTeamB] = useState<string>("");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [matchResult, setMatchResult] = useState<any>(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch("http://localhost:4001/api/teams/teams");
        const data = await response.json();
        setTeams(data);
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };
    fetchTeams();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!teamA || !teamB) {
      alert("Please select both teams.");
      return;
    }
    try {
      const response = await fetch("http://localhost:4001/api/teams/simulate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ teamAId: teamA, teamBId: teamB }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMatchResult(data.result);
      setModalOpen(true);
    } catch (error) {
      console.error("Error simulating match:", error);
    }
  };

  const handleReset = async () => {
    try {
      const response = await fetch("http://localhost:4001/api/teams/reset", {
        method: "POST",
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error resetting points:", error);
    }
  };

  const handleTeamAChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTeamA(e.target.value);
  };

  const handleTeamBChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTeamB(e.target.value);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <Box className="form-container">
      <form onSubmit={handleSubmit}>
        <TextField
          className="select-field"
          select
          label="Select Team A"
          value={teamA}
          onChange={handleTeamAChange}
          fullWidth
          required
        >
          {teams.map((team) => (
            <MenuItem key={team._id} value={team._id}>
              {team.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          className="select-field"
          select
          label="Select Team B"
          value={teamB}
          onChange={handleTeamBChange}
          fullWidth
          required
        >
          {teams.map((team) => (
            <MenuItem key={team._id} value={team._id}>
              {team.name}
            </MenuItem>
          ))}
        </TextField>
        <Box className="button-group">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className="submit-button"
          >
            Simulate Match
          </Button>
          <Button
            onClick={handleReset}
            variant="contained"
            color="secondary"
            className="reset-button"
          >
            Reset All Points
          </Button>
        </Box>
      </form>

      {/* Modal for displaying match result */}
      <Dialog open={modalOpen} onClose={handleCloseModal}>
        <DialogTitle>Match Result</DialogTitle>
        <DialogContent>
          {matchResult ? (
            <>
              <Typography variant="h6">
                Scorer from Team A: {matchResult.playerA}
              </Typography>
              <Typography variant="h6">
                Random Player from Team B: {matchResult.playerB}
              </Typography>
              <Typography variant="h6">
                Assister from Team A: {matchResult.playerAssist}
              </Typography>
            </>
          ) : (
            <Typography>No result to display</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SimulateMatch;
