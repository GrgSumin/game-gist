import { useEffect, useState, useCallback } from "react";
import {
  Box, Typography, Grid, TextField, Chip, Card, CardContent,
  Avatar, Skeleton, Pagination, Select, MenuItem, InputLabel, FormControl,
} from "@mui/material";
import { getPlayers } from "../api/endpoints";
import type { Player, Position } from "../types";

const posColor: Record<string, string> = {
  GK: "#D4A843",
  DEF: "#5B9BD5",
  MID: "#6BAF6B",
  FWD: "#D9534F",
};

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [position, setPosition] = useState<Position | "">("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("totalPoints");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = { page, limit: 30 };
      if (position) params.position = position;
      if (search) params.search = search;
      const { data } = await getPlayers(params as { position?: string; search?: string; page?: number });
      setPlayers(data.players);
      setTotalPages(data.pagination.pages);
    } catch {
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  }, [page, position, search]);

  useEffect(() => {
    load();
  }, [load]);

  const sorted = [...players].sort((a, b) => {
    if (sortBy === "price") return b.price - a.price;
    if (sortBy === "goals") return b.stats.goals - a.stats.goals;
    if (sortBy === "assists") return b.stats.assists - a.stats.assists;
    return b.totalPoints - a.totalPoints;
  });

  return (
    <Box sx={{ maxWidth: 1400, mx: "auto", px: { xs: 2, md: 3 }, py: 3 }}>
      <Typography variant="h4" gutterBottom>Players</Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center", p: 2, "&:last-child": { pb: 2 } }}>
          <TextField size="small" placeholder="Search players..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} sx={{ minWidth: 200, flex: 1 }} />
          <Box sx={{ display: "flex", gap: 0.5 }}>
            {(["", "GK", "DEF", "MID", "FWD"] as const).map((pos) => (
              <Chip
                key={pos || "ALL"}
                label={pos || "ALL"}
                size="small"
                onClick={() => { setPosition(pos as Position | ""); setPage(1); }}
                color={position === pos ? "primary" : "default"}
                variant={position === pos ? "filled" : "outlined"}
              />
            ))}
          </Box>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Sort by</InputLabel>
            <Select value={sortBy} label="Sort by" onChange={(e) => setSortBy(e.target.value)}>
              <MenuItem value="totalPoints">Points</MenuItem>
              <MenuItem value="price">Price</MenuItem>
              <MenuItem value="goals">Goals</MenuItem>
              <MenuItem value="assists">Assists</MenuItem>
            </Select>
          </FormControl>
        </CardContent>
      </Card>

      {loading ? (
        <Grid container spacing={2}>
          {Array.from({ length: 12 }).map((_, i) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
              <Skeleton variant="rounded" height={160} />
            </Grid>
          ))}
        </Grid>
      ) : sorted.length === 0 ? (
        <Typography color="text.secondary" textAlign="center" py={8}>No players found. Sync player data from the admin panel.</Typography>
      ) : (
        <>
          <Grid container spacing={2}>
            {sorted.map((player) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={player._id}>
                <Card>
                  <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                      <Avatar src={player.photo} sx={{ width: 52, height: 52, border: `2px solid ${posColor[player.position]}` }}>
                        {player.name[0]}
                      </Avatar>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography fontWeight={700} noWrap>{player.name}</Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          {player.clubLogo && <Avatar src={player.clubLogo} sx={{ width: 14, height: 14 }} />}
                          <Typography variant="caption" color="text.secondary">{player.club}</Typography>
                        </Box>
                      </Box>
                      <Chip label={player.position} size="small" sx={{ bgcolor: posColor[player.position] + "20", color: posColor[player.position], fontWeight: 700 }} />
                    </Box>
                    <Grid container spacing={1}>
                      {[
                        { label: "Points", val: player.totalPoints, color: "primary.main" },
                        { label: "Price", val: `${player.price.toFixed(1)}m`, color: "text.primary" },
                        { label: "Goals", val: player.stats.goals, color: "#D9534F" },
                        { label: "Assists", val: player.stats.assists, color: "#5B9BD5" },
                        { label: "Apps", val: player.stats.appearances, color: "text.secondary" },
                        { label: "Mins", val: player.stats.minutesPlayed, color: "text.secondary" },
                      ].map((s) => (
                        <Grid item xs={4} key={s.label}>
                          <Box sx={{ textAlign: "center", p: 0.5, borderRadius: 1, bgcolor: "rgba(255,255,255,0.02)" }}>
                            <Typography variant="caption" color="text.secondary" display="block">{s.label}</Typography>
                            <Typography variant="body2" fontWeight={700} sx={{ color: s.color }}>{s.val}</Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          {totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Pagination count={totalPages} page={page} onChange={(_, v) => setPage(v)} color="primary" />
            </Box>
          )}
        </>
      )}
    </Box>
  );
}
