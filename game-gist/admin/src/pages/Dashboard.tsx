import { useEffect, useState } from "react";
import { Box, Typography, Grid, Card, CardContent, Avatar } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import GroupIcon from "@mui/icons-material/Group";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import api from "../api";

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) {
  return (
    <Card>
      <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Avatar sx={{ bgcolor: color + "20", color, width: 52, height: 52 }}>{icon}</Avatar>
        <Box>
          <Typography variant="caption" color="text.secondary">{label}</Typography>
          <Typography variant="h4" fontWeight={800}>{value}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState({ users: 0, players: 0, news: 0 });

  useEffect(() => {
    Promise.allSettled([
      api.get("/api/users/all").then((r) => r.data.users?.length || 0),
      api.get("/api/football/players?limit=1").then((r) => r.data.pagination?.total || 0),
      api.get("/api/news?limit=1").then((r) => r.data.pagination?.total || 0),
    ]).then(([u, p, n]) => {
      setStats({
        users: u.status === "fulfilled" ? u.value : 0,
        players: p.status === "fulfilled" ? p.value : 0,
        news: n.status === "fulfilled" ? n.value : 0,
      });
    });
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight={800}>Dashboard</Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        Overview of your fantasy football platform
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard icon={<PersonIcon />} label="Users" value={stats.users} color="#4A90D9" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard icon={<SportsSoccerIcon />} label="Players in DB" value={stats.players} color="#6C757D" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard icon={<NewspaperIcon />} label="News Articles" value={stats.news} color="#FFB800" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard icon={<GroupIcon />} label="Status" value="Online" color="#4A90D9" />
        </Grid>
      </Grid>

      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Quick Start Guide</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            1. Go to <strong>Sync Players</strong> to import real player data from API-Football
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            2. Add <strong>News</strong> articles to populate the news feed
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            3. Manage <strong>Users</strong> from the users page
          </Typography>
          <Typography variant="body2" color="text.secondary">
            4. Players can build their fantasy teams once player data is synced
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
