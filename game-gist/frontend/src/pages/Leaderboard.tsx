import { useEffect, useState } from "react";
import {
  Box, Typography, Card, CardContent, Avatar,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Skeleton, Chip,
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { getLeaderboard } from "../api/endpoints";
import type { LeaderboardEntry } from "../types";

const medalColors = ["#FFD700", "#C0C0C0", "#CD7F32"];

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLeaderboard()
      .then((r) => setEntries(r.data.leaderboard))
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", px: { xs: 2, md: 3 }, py: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
        <EmojiEventsIcon sx={{ color: "warning.main", fontSize: 32 }} />
        <Typography variant="h4">Leaderboard</Typography>
      </Box>

      {/* Top 3 podium */}
      {entries.length >= 3 && (
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 4, flexWrap: "wrap" }}>
          {[1, 0, 2].map((idx) => {
            const e = entries[idx];
            const isFirst = idx === 0;
            return (
              <Card key={e.rank} sx={{
                textAlign: "center", p: 3, minWidth: 160,
                border: isFirst ? "2px solid #FFD700" : undefined,
                transform: isFirst ? "scale(1.05)" : undefined,
              }}>
                <Avatar sx={{
                  width: isFirst ? 64 : 52, height: isFirst ? 64 : 52,
                  mx: "auto", mb: 1,
                  bgcolor: medalColors[e.rank - 1], color: "#111",
                  fontWeight: 800, fontSize: isFirst ? "1.5rem" : "1.2rem",
                }}>
                  {e.username[0]?.toUpperCase()}
                </Avatar>
                <Typography fontWeight={700}>{e.username}</Typography>
                <Typography variant="caption" color="text.secondary">{e.teamName}</Typography>
                <Typography variant="h5" fontWeight={800} color="primary.main" sx={{ mt: 1 }}>{e.totalPoints}</Typography>
                <Typography variant="caption" color="text.secondary">points</Typography>
              </Card>
            );
          })}
        </Box>
      )}

      <Card>
        <CardContent>
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} height={48} sx={{ mb: 0.5 }} />)
          ) : entries.length === 0 ? (
            <Typography color="text.secondary" textAlign="center" py={4}>
              No managers yet. Create your team to join the leaderboard!
            </Typography>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Rank</TableCell>
                    <TableCell>Manager</TableCell>
                    <TableCell>Team</TableCell>
                    <TableCell align="center">GW Pts</TableCell>
                    <TableCell align="center">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {entries.map((e) => (
                    <TableRow key={e.rank} sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.02)" } }}>
                      <TableCell>
                        {e.rank <= 3 ? (
                          <Chip label={e.rank} size="small" sx={{ bgcolor: medalColors[e.rank - 1] + "30", color: medalColors[e.rank - 1], fontWeight: 800 }} />
                        ) : (
                          <Typography variant="body2" fontWeight={600}>{e.rank}</Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main", color: "#111", fontWeight: 700, fontSize: "0.8rem" }}>
                            {e.username[0]?.toUpperCase()}
                          </Avatar>
                          <Typography variant="body2" fontWeight={600}>{e.username}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">{e.teamName}</Typography>
                      </TableCell>
                      <TableCell align="center">{e.gameweekPoints}</TableCell>
                      <TableCell align="center">
                        <Typography fontWeight={800} color="primary.main">{e.totalPoints}</Typography>
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
