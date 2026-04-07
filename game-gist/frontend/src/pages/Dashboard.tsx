import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Typography, Card, CardContent, Grid, Avatar, Chip, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Skeleton,
} from "@mui/material";
import { getFixtures, getStandings, getLeaderboard } from "../api/endpoints";
import type { Fixture, StandingRow, LeaderboardEntry } from "../types";
import useAuth from "../hooks/useAuth";

export default function Dashboard() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [standings, setStandings] = useState<StandingRow[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      getFixtures(39).then((r) => setFixtures(r.data.fixtures.slice(0, 6))),
      getStandings(39).then((r) => {
        const rows = r.data.standings;
        if (rows && rows.length > 0) setStandings(rows[0].slice(0, 10));
      }),
      getLeaderboard().then((r) => setLeaderboard(r.data.leaderboard.slice(0, 5))),
    ]).finally(() => setLoading(false));
  }, []);

  const liveFixtures = fixtures.filter((f) => ["LIVE", "1H", "2H", "HT"].includes(f.fixture.status.short));
  const upcomingFixtures = fixtures.filter((f) => f.fixture.status.short === "NS");
  const recentFixtures = fixtures.filter((f) => f.fixture.status.short === "FT");
  const displayFixtures = [...liveFixtures, ...upcomingFixtures, ...recentFixtures].slice(0, 6);

  return (
    <Box sx={{ maxWidth: 1400, mx: "auto", px: { xs: 2, md: 3 }, py: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>Fantasy Football</Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 600 }}>
          Build your dream team with real player stats. Compete with friends and climb the leaderboard.
        </Typography>
        {!isAuthenticated && (
          <Button variant="contained" size="small" onClick={() => navigate("/register")} sx={{ mt: 2 }}>
            Sign up to play
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        {/* Fixtures */}
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Fixtures</Typography>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} height={50} sx={{ mb: 1 }} />)
              ) : displayFixtures.length === 0 ? (
                <Typography color="text.secondary" variant="body2">No fixtures available. Connect your API key to see live data.</Typography>
              ) : (
                displayFixtures.map((f) => (
                  <Box key={f.fixture.id} sx={{ display: "flex", alignItems: "center", py: 1.5, borderBottom: "1px solid #2A2A2A", "&:last-child": { borderBottom: 0 } }}>
                    <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 1 }}>
                      <Typography variant="body2" fontWeight={600} textAlign="right">{f.teams.home.name}</Typography>
                      <Avatar src={f.teams.home.logo} sx={{ width: 24, height: 24 }} />
                    </Box>
                    <Box sx={{ px: 2, minWidth: 70, textAlign: "center" }}>
                      {f.fixture.status.short === "NS" ? (
                        <Typography variant="caption" color="text.secondary">
                          {new Date(f.fixture.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </Typography>
                      ) : (
                        <Typography variant="body2" fontWeight={700}>
                          {f.goals.home ?? 0} - {f.goals.away ?? 0}
                        </Typography>
                      )}
                      {!["NS", "FT"].includes(f.fixture.status.short) && (
                        <Chip label="LIVE" size="small" color="error" sx={{ height: 16, fontSize: "0.6rem" }} />
                      )}
                    </Box>
                    <Box sx={{ flex: 1, display: "flex", alignItems: "center", gap: 1 }}>
                      <Avatar src={f.teams.away.logo} sx={{ width: 24, height: 24 }} />
                      <Typography variant="body2" fontWeight={600}>{f.teams.away.name}</Typography>
                    </Box>
                  </Box>
                ))
              )}
            </CardContent>
          </Card>

          {/* Standings */}
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6">Premier League Table</Typography>
                <Chip label="View Full" size="small" variant="outlined" clickable onClick={() => navigate("/standings")} />
              </Box>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} height={36} sx={{ mb: 0.5 }} />)
              ) : standings.length === 0 ? (
                <Typography color="text.secondary" variant="body2">Standings unavailable. Connect your API key.</Typography>
              ) : (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell>Team</TableCell>
                        <TableCell align="center">P</TableCell>
                        <TableCell align="center">W</TableCell>
                        <TableCell align="center">D</TableCell>
                        <TableCell align="center">L</TableCell>
                        <TableCell align="center">GD</TableCell>
                        <TableCell align="center">Pts</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {standings.map((row) => (
                        <TableRow key={row.rank}>
                          <TableCell sx={{ fontWeight: 700 }}>{row.rank}</TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <Avatar src={row.team.logo} sx={{ width: 20, height: 20 }} />
                              <Typography variant="body2" fontWeight={600}>{row.team.name}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="center">{row.all.played}</TableCell>
                          <TableCell align="center">{row.all.win}</TableCell>
                          <TableCell align="center">{row.all.draw}</TableCell>
                          <TableCell align="center">{row.all.lose}</TableCell>
                          <TableCell align="center">{row.goalsDiff > 0 ? "+" : ""}{row.goalsDiff}</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 700 }}>{row.points}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Top Managers</Typography>
              {leaderboard.length === 0 ? (
                <Typography variant="body2" color="text.secondary">No managers yet. Be the first!</Typography>
              ) : (
                leaderboard.map((entry) => (
                  <Box key={entry.rank} sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1, borderBottom: "1px solid #2A2A2A" }}>
                    <Typography variant="body2" fontWeight={700} sx={{ width: 20 }}>{entry.rank}</Typography>
                    <Avatar sx={{ width: 30, height: 30, bgcolor: "#333", fontWeight: 700, fontSize: "0.75rem" }}>
                      {entry.username[0]?.toUpperCase()}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" fontWeight={600}>{entry.username}</Typography>
                      <Typography variant="caption" color="text.secondary">{entry.teamName}</Typography>
                    </Box>
                    <Typography variant="body2" fontWeight={700}>{entry.totalPoints} pts</Typography>
                  </Box>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Quick Links</Typography>
              {[
                { label: "Build Your Team", path: "/team" },
                { label: "Browse Players", path: "/players" },
                { label: "Join a League", path: "/groups" },
              ].map((action) => (
                <Box
                  key={action.path}
                  onClick={() => navigate(action.path)}
                  sx={{
                    p: 1.5, mb: 1, borderRadius: 1, cursor: "pointer",
                    border: "1px solid #2A2A2A",
                    "&:hover": { bgcolor: "#222", borderColor: "#444" },
                  }}
                >
                  <Typography variant="body2" fontWeight={600}>{action.label}</Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
