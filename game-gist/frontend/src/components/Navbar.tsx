import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer,
  List, ListItem, ListItemButton, ListItemText, Avatar, Chip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import useAuth from "../hooks/useAuth";

const NAV_ITEMS = [
  { label: "Dashboard", path: "/" },
  { label: "Fixtures", path: "/fixtures" },
  { label: "My Team", path: "/team" },
  { label: "Players", path: "/players" },
  { label: "Standings", path: "/standings" },
  { label: "Leaderboard", path: "/leaderboard" },
  { label: "News", path: "/news" },
  { label: "Groups", path: "/groups" },
];

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          bgcolor: "#1A1A1A",
          borderBottom: "1px solid #2A2A2A",
          boxShadow: "none",
        }}
      >
        <Toolbar sx={{ maxWidth: 1400, width: "100%", mx: "auto", px: { xs: 2, md: 3 } }}>
          <SportsSoccerIcon sx={{ color: "#fff", mr: 1, fontSize: 24 }} />
          <Typography
            variant="h6"
            sx={{ fontWeight: 800, color: "#fff", cursor: "pointer", mr: 4 }}
            onClick={() => navigate("/")}
          >
            GameGist
          </Typography>

          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 0.5, flex: 1 }}>
            {NAV_ITEMS.map((item) => (
              <Button
                key={item.path}
                onClick={() => navigate(item.path)}
                sx={{
                  color: location.pathname === item.path ? "#fff" : "#888",
                  fontWeight: location.pathname === item.path ? 700 : 400,
                  fontSize: "0.85rem",
                  borderBottom: location.pathname === item.path ? "2px solid #4A90D9" : "2px solid transparent",
                  borderRadius: 0,
                  pb: 0.5,
                  "&:hover": { color: "#fff", bgcolor: "transparent" },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            {isAuthenticated ? (
              <>
                <Chip
                  avatar={<Avatar sx={{ bgcolor: "#4A90D9", color: "#fff !important", fontWeight: 700 }}>{user?.username?.[0]?.toUpperCase()}</Avatar>}
                  label={user?.username}
                  variant="outlined"
                  sx={{ borderColor: "#333", color: "white", display: { xs: "none", sm: "flex" } }}
                />
                <Button size="small" onClick={logout} sx={{ color: "#888" }}>
                  Logout
                </Button>
              </>
            ) : (
              <Button variant="contained" size="small" onClick={() => navigate("/login")}>
                Sign In
              </Button>
            )}
            <IconButton sx={{ display: { md: "none" }, color: "#fff" }} onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { bgcolor: "#1A1A1A", width: 260 } }}
      >
        <List sx={{ pt: 2 }}>
          {NAV_ITEMS.map((item) => (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => { navigate(item.path); setDrawerOpen(false); }}
                sx={{ "&.Mui-selected": { bgcolor: "#222", color: "#fff" } }}
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Toolbar />
    </>
  );
}
