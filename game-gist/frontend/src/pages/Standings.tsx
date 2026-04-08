import { useEffect, useState } from "react";
import {
  Box, Typography, Card, CardContent, Avatar, Chip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Skeleton,
} from "@mui/material";
import { getStandings } from "../api/endpoints";
import type { StandingRow } from "../types";

const LEAGUES = [
  { id: 39, name: "Premier League" },
  { id: 140, name: "La Liga" },
  { id: 135, name: "Serie A" },
  { id: 78, name: "Bundesliga" },
  { id: 61, name: "Ligue 1" },
  { id: 2, name: "Champions League" },
];

export default function StandingsPage() {
  const [standings, setStandings] = useState<StandingRow[]>([]);
  const [league, setLeague] = useState(39);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getStandings(league)
      .then((r) => {
        const rows = r.data.standings;
        if (rows && rows.length > 0) setStandings(rows[0]);
        else setStandings([]);
      })
      .catch(() => setStandings([]))
      .finally(() => setLoading(false));
  }, [league]);

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", px: { xs: 2, md: 3 }, py: 3 }}>
      <Typography variant="h4" gutterBottom>Standings</Typography>

      <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
        {LEAGUES.map((l) => (
          <Chip
            key={l.id}
            label={l.name}
            onClick={() => setLeague(l.id)}
            color={league === l.id ? "primary" : "default"}
            variant={league === l.id ? "filled" : "outlined"}
          />
        ))}
      </Box>

      <Card>
        <CardContent>
          {loading ? (
            Array.from({ length: 10 }).map((_, i) => <Skeleton key={i} height={48} sx={{ mb: 0.5 }} />)
          ) : standings.length === 0 ? (
            <Typography color="text.secondary" textAlign="center" py={4}>
              Standings unavailable. Connect your API-Football key to see live data.
            </Typography>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Team</TableCell>
                    <TableCell align="center">P</TableCell>
                    <TableCell align="center">W</TableCell>
                    <TableCell align="center">D</TableCell>
                    <TableCell align="center">L</TableCell>
                    <TableCell align="center">GF</TableCell>
                    <TableCell align="center">GA</TableCell>
                    <TableCell align="center">GD</TableCell>
                    <TableCell align="center">Pts</TableCell>
                    <TableCell align="center">Form</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {standings.map((row) => (
                    <TableRow key={row.rank} sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.02)" } }}>
                      <TableCell>
                        <Typography variant="body2" fontWeight={700}
                          sx={{
                            color: row.rank <= 4 ? "primary.main" : row.rank >= standings.length - 2 ? "error.main" : "text.primary",
                          }}
                        >
                          {row.rank}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <Avatar src={row.team.logo} sx={{ width: 28, height: 28 }} />
                          <Typography variant="body2" fontWeight={600}>{row.team.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">{row.all.played}</TableCell>
                      <TableCell align="center" sx={{ color: "success.main" }}>{row.all.win}</TableCell>
                      <TableCell align="center">{row.all.draw}</TableCell>
                      <TableCell align="center" sx={{ color: "error.main" }}>{row.all.lose}</TableCell>
                      <TableCell align="center">{row.all.goals.for}</TableCell>
                      <TableCell align="center">{row.all.goals.against}</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700, color: row.goalsDiff > 0 ? "success.main" : row.goalsDiff < 0 ? "error.main" : "text.secondary" }}>
                        {row.goalsDiff > 0 ? "+" : ""}{row.goalsDiff}
                      </TableCell>
                      <TableCell align="center">
                        <Typography fontWeight={800}>{row.points}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: "flex", gap: 0.3, justifyContent: "center" }}>
                          {row.form?.split("").map((r, i) => (
                            <Box key={i} sx={{
                              width: 18, height: 18, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                              bgcolor: r === "W" ? "success.main" : r === "D" ? "warning.main" : "error.main",
                              color: "#fff", fontSize: "0.6rem", fontWeight: 700,
                            }}>
                              {r}
                            </Box>
                          ))}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
