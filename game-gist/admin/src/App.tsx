import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import {
  Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Toolbar, AppBar, Typography, IconButton, Card, CardContent, TextField, Button, Alert,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SyncIcon from "@mui/icons-material/Sync";
import PersonIcon from "@mui/icons-material/Person";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import LogoutIcon from "@mui/icons-material/Logout";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import api from "./api";

import DashboardPage from "./pages/Dashboard";
import SyncPlayers from "./pages/SyncPlayers";
import UsersPage from "./pages/Users";
import AddNews from "./pages/AddNews";

const DRAWER_WIDTH = 240;

const NAV = [
  { label: "Dashboard", path: "/", icon: <DashboardIcon /> },
  { label: "Sync Players", path: "/sync", icon: <SyncIcon /> },
  { label: "Users", path: "/users", icon: <PersonIcon /> },
  { label: "Add News", path: "/news", icon: <NewspaperIcon /> },
];

function LoginPage({ onLogin }: { onLogin: (token: string) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/api/users/login", { email, password });
      if (data.user.role !== "admin") {
        setError("Admin access required");
        setLoading(false);
        return;
      }
      localStorage.setItem("admin_token", data.token);
      onLogin(data.token);
    } catch {
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", bgcolor: "#111" }}>
      <Card sx={{ maxWidth: 400, width: "100%", mx: 2 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <SportsSoccerIcon sx={{ fontSize: 36, mb: 1 }} />
            <Typography variant="h5" fontWeight={700}>Admin Login</Typography>
          </Box>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <form onSubmit={handleSubmit}>
            <TextField fullWidth label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required sx={{ mb: 2 }} />
            <TextField fullWidth label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required sx={{ mb: 3 }} />
            <Button fullWidth variant="contained" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [token, setToken] = useState<string | null>(localStorage.getItem("admin_token"));
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (token) {
      api.get("/api/users/profile").catch(() => {
        localStorage.removeItem("admin_token");
        setToken(null);
      });
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    setToken(null);
  };

  if (!token) {
    return <LoginPage onLogin={setToken} />;
  }

  const drawer = (
    <Box>
      <Toolbar sx={{ gap: 1 }}>
        <SportsSoccerIcon sx={{ color: "#fff" }} />
        <Typography fontWeight={800}>Admin</Typography>
      </Toolbar>
      <List>
        {NAV.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => { navigate(item.path); setMobileOpen(false); }}
              sx={{ "&.Mui-selected": { bgcolor: "#222" } }}
            >
              <ListItemIcon sx={{ color: location.pathname === item.path ? "#fff" : "#888", minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon sx={{ color: "#888", minWidth: 40 }}><LogoutIcon /></ListItemIcon>
            <ListItemText primary="Logout" sx={{ color: "#888" }} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" sx={{
        width: { md: `calc(100% - ${DRAWER_WIDTH}px)` }, ml: { md: `${DRAWER_WIDTH}px` },
        bgcolor: "#1A1A1A", boxShadow: "none", borderBottom: "1px solid #2A2A2A",
      }}>
        <Toolbar>
          <IconButton color="inherit" onClick={() => setMobileOpen(!mobileOpen)} sx={{ display: { md: "none" }, mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" fontWeight={700}>GameGist Admin</Typography>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: 0 }}>
        <Drawer variant="temporary" open={mobileOpen} onClose={() => setMobileOpen(false)}
          sx={{ display: { xs: "block", md: "none" } }}
          PaperProps={{ sx: { width: DRAWER_WIDTH, bgcolor: "#111" } }}
        >
          {drawer}
        </Drawer>
        <Drawer variant="permanent"
          sx={{ display: { xs: "none", md: "block" } }}
          PaperProps={{ sx: { width: DRAWER_WIDTH, bgcolor: "#111", borderRight: "1px solid #2A2A2A" } }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { md: `calc(100% - ${DRAWER_WIDTH}px)` } }}>
        <Toolbar />
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/sync" element={<SyncPlayers />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/news" element={<AddNews />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
    </Box>
  );
}
