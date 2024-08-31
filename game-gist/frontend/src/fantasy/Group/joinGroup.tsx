import React, { useState } from "react";
import {
  Button,
  Box,
  Typography,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const JoinGroup: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [groupCode, setGroupCode] = useState<string>("");
  const [teamName, setTeamName] = useState<string>("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleJoinGroup = async () => {
    try {
      // Retrieve user ID from localStorage
      const userId = localStorage.getItem("userId");

      if (!userId) {
        toast.error("User not logged in. Please log in to join a group.");
        return;
      }

      const response = await fetch("http://localhost:4001/api/groups/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          groupCode,
          userId,
          teamName,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Joined group successfully!");
      } else {
        toast.error("Failed to join group.");
      }
    } catch (error) {
      console.error("Error joining group:", error);
      toast.error("Failed to join group.");
    }
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Join Group
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Join Group</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Group Code"
            fullWidth
            value={groupCode}
            onChange={(e) => setGroupCode(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Team Name"
            fullWidth
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleJoinGroup();
              handleClose();
            }}
            color="primary"
          >
            Join
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default JoinGroup;
