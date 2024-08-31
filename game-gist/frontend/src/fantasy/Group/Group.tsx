import React from "react";
import { Container, Box, Button } from "@mui/material";
import { Link, Outlet } from "react-router-dom";

const Group: React.FC = () => {
  return (
    <Container>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
        <Button
          component={Link}
          to="/create-group"
          variant="contained"
          color="primary"
        >
          Create Group
        </Button>
        <Button
          component={Link}
          to="/join-group"
          variant="contained"
          color="primary"
        >
          Join Group
        </Button>
        <Button
          component={Link}
          to="/group-list"
          variant="contained"
          color="primary"
        >
          Group List
        </Button>
      </Box>
      <Outlet /> {/* This will render the matched child route component */}
    </Container>
  );
};

export default Group;
