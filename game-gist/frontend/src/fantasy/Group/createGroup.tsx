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

const CreateGroup: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [groupName, setGroupName] = useState<string>(""); // Added state for group name
  const [teamName, setTeamName] = useState<string>("");
  const [groupCode, setGroupCode] = useState<string>("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCreateGroup = async () => {
    try {
      const creatorId = localStorage.getItem("userId");

      if (!creatorId) {
        toast.error("User not logged in. Please log in to create a group.");
        return;
      }

      const response = await fetch("http://localhost:4001/api/groups/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          groupName, // Include groupName in the request body
          teamName,
          creatorId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setGroupCode(data.data.groupCode);
        toast.success("Group created successfully!");
      } else {
        toast.error("Failed to create group.");
      }
    } catch (error) {
      console.error("Error creating group:", error);
      toast.error("Failed to create group.");
    }
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Create Group
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create New Group</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Group Name" // New field for group name
            fullWidth
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Team Name"
            fullWidth
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />
          <Typography variant="body1" mt={2}>
            Note: Please make sure to provide the correct group name and team
            name.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleCreateGroup();
              handleClose();
            }}
            color="primary"
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
      {groupCode && (
        <Box
          mt={2}
          style={{
            cursor: "pointer",
            listStyle: "none",
            backgroundColor: "aliceblue",
            padding: "12px",
            borderRadius: "4px",
          }}
        >
          <Typography variant="h6">Group Code: {groupCode}</Typography>
        </Box>
      )}
    </div>
  );
};

export default CreateGroup;
