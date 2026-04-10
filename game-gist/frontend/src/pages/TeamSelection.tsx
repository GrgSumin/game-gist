import { useEffect, useState, useCallback } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  Box, Typography, Card, CardContent, Grid, Button, TextField,
  Chip, Dialog, DialogTitle, DialogContent, Snackbar,
  FormControl, InputLabel, Select, MenuItem,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { myTeamState, teamByPosition, teamCount, remainingBudget, formationState, teamNameState, type TeamPlayer } from "../atoms/team";
import { getPlayers, saveFantasyTeam, getMyTeam } from "../api/endpoints";
import type { Player, Position } from "../types";
import PitchView from "../components/PitchView";
import PlayerCard from "../components/PlayerCard";
import useAuth from "../hooks/useAuth";

const FORMATIONS = ["4-3-3", "4-4-2", "3-5-2", "3-4-3", "5-3-2", "5-4-1"];

export default function TeamSelection() {
  const { isAuthenticated } = useAuth();
  const [team, setTeam] = useRecoilState(myTeamState);
  const [teamName, setTeamName] = useRecoilState(teamNameState);
  const [formation, setFormation] = useRecoilState(formationState);
  const grouped = useRecoilValue(teamByPosition);
  const count = useRecoilValue(teamCount);
  const budget = useRecoilValue(remainingBudget);

  const [players, setPlayers] = useState<Player[]>([]);
  const [posFilter, setPosFilter] = useState<Position | null>(null);
  const [search, setSearch] = useState("");
  const [clubFilter, setClubFilter] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogSearch, setDialogSearch] = useState("");
  const [dialogClubFilter, setDialogClubFilter] = useState("");
  const [saving, setSaving] = useState(false);
  const [snack, setSnack] = useState("");
  const [replacingPlayerId, setReplacingPlayerId] = useState<string | null>(null);

  const loadPlayers = useCallback(async () => {
    try {
      const { data } = await getPlayers({ limit: 0 });
      setPlayers(data.players);
    } catch {
      setPlayers([]);
    }
  }, []);

  useEffect(() => {
    loadPlayers();
  }, [loadPlayers]);

  // Unique sorted club list, computed once from all loaded players
  const allClubs = [...new Set(players.map((p) => p.club))].sort();

  // Sidebar: filter by search + position + club
  const sidebarPlayers = players.filter((p) => {
    if (posFilter && p.position !== posFilter) return false;
    if (clubFilter && p.club !== clubFilter) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  // Dialog: filter by clicked position (posFilter) + its own search + club filter
  const dialogPlayers = players.filter((p) => {
    if (posFilter && p.position !== posFilter) return false;
    if (dialogClubFilter && p.club !== dialogClubFilter) return false;
    if (dialogSearch && !p.name.toLowerCase().includes(dialogSearch.toLowerCase())) return false;
    return true;
  });

  // Load saved team on mount
  useEffect(() => {
    if (!isAuthenticated) return;
    getMyTeam()
      .then(({ data }) => {
        if (data.team && data.team.players.length > 0) {
          const loaded: TeamPlayer[] = data.team.players
            .filter((s) => s.playerId && typeof s.playerId === "object")
            .map((s) => ({
              ...(s.playerId as unknown as Player),
              isCaptain: s.isCaptain,
              isViceCaptain: s.isViceCaptain,
            }));
          if (loaded.length > 0) {
            setTeam(loaded);
            setTeamName(data.team.name);
            setFormation(data.team.formation);
          }
        }
      })
      .catch(() => {});
  }, [isAuthenticated, setTeam, setTeamName, setFormation]);

  const addPlayer = (player: Player) => {
    if (count >= 11) return setSnack("Team full — click a player on the pitch to replace");
    if (team.some((p) => p._id === player._id)) return setSnack("Player already in team");
    if (budget < player.price) return setSnack("Not enough budget");

    // Max 3 players per club (FPL rule)
    const clubCount = team.filter((p) => p.club === player.club).length;
    if (clubCount >= 3) return setSnack(`Max 3 players per club (${player.club})`);

    const [d, m, f] = formation.split("-").map(Number);
    const slots: Record<Position, number> = { GK: 1, DEF: d, MID: m, FWD: f };
    const posCount = team.filter((p) => p.position === player.position).length;
    if (posCount >= slots[player.position]) return setSnack(`Max ${player.position} slots filled`);

    const teamPlayer: TeamPlayer = { ...player, isCaptain: count === 0, isViceCaptain: false };
    setTeam([...team, teamPlayer]);
  };

  const removePlayer = (id: string) => {
    setTeam(team.filter((p) => p._id !== id));
  };

  const replacePlayer = (oldId: string, newPlayer: Player) => {
    const old = team.find((p) => p._id === oldId);
    if (!old) return addPlayer(newPlayer);

    if (team.some((p) => p._id === newPlayer._id)) return setSnack("Player already in team");

    const newBudget = budget + old.price - newPlayer.price;
    if (newBudget < 0) return setSnack("Not enough budget for swap");

    const clubCount = team.filter((p) => p._id !== oldId && p.club === newPlayer.club).length;
    if (clubCount >= 3) return setSnack(`Max 3 players per club (${newPlayer.club})`);

    const replacement: TeamPlayer = {
      ...newPlayer,
      isCaptain: old.isCaptain,
      isViceCaptain: old.isViceCaptain,
    };
    setTeam(team.map((p) => (p._id === oldId ? replacement : p)));
  };

  const toggleCaptain = (id: string) => {
    setTeam(team.map((p) => ({ ...p, isCaptain: p._id === id })));
  };

  const handleSlotClick = (position: Position, index: number) => {
    const existing = grouped[position][index];
    setReplacingPlayerId(existing ? existing._id : null);
    setPosFilter(position);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (count !== 11) return setSnack("Select exactly 11 players");
    if (!isAuthenticated) return setSnack("Please sign in to save your team");
    setSaving(true);
    try {
      await saveFantasyTeam({
        name: teamName,
        formation,
        players: team.map((p) => ({
          playerId: p._id,
          position: p.position,
          isCaptain: p.isCaptain,
          isViceCaptain: p.isViceCaptain,
        })),
      });
      setSnack("Team saved!");
    } catch {
      setSnack("Failed to save team");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1400, mx: "auto", px: { xs: 2, md: 3 }, py: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography variant="h4">Team Selection</Typography>
          <Typography variant="subtitle1">Pick your best XI</Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Chip label={`${count}/11 Players`} color={count === 11 ? "success" : "default"} />
          <Chip label={`${budget.toFixed(1)}m remaining`} color={budget < 0 ? "error" : "default"} />
          <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave} disabled={saving || count !== 11}>
            {saving ? "Saving..." : "Save Team"}
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          {/* Team name & formation */}
          <Card sx={{ mb: 2 }}>
            <CardContent sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap", p: 2, "&:last-child": { pb: 2 } }}>
              <TextField
                size="small"
                label="Team Name"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                sx={{ flex: 1, minWidth: 160 }}
              />
              <Box sx={{ display: "flex", gap: 0.5 }}>
                {FORMATIONS.map((f) => (
                  <Chip
                    key={f}
                    label={f}
                    size="small"
                    onClick={() => setFormation(f)}
                    color={formation === f ? "primary" : "default"}
                    variant={formation === f ? "filled" : "outlined"}
                  />
                ))}
              </Box>
            </CardContent>
          </Card>

          {/* Pitch */}
          <PitchView grouped={grouped} onSlotClick={handleSlotClick} />

          {/* Selected players list */}
          {team.length > 0 && (
            <Card sx={{ mt: 2 }}>
              <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>Selected Players</Typography>
                {team.map((p) => (
                  <Box key={p._id} sx={{ display: "flex", alignItems: "center", gap: 1, py: 0.5 }}>
                    <PlayerCard player={p} compact />
                    <Chip
                      label={p.isCaptain ? "C" : "VC"}
                      size="small"
                      color={p.isCaptain ? "primary" : "default"}
                      onClick={() => toggleCaptain(p._id)}
                      sx={{ cursor: "pointer", minWidth: 32 }}
                    />
                    <Chip label="X" size="small" color="error" variant="outlined" onClick={() => removePlayer(p._id)} sx={{ cursor: "pointer" }} />
                  </Box>
                ))}
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Player picker sidebar */}
        <Grid item xs={12} md={5}>
          <Card sx={{ position: { md: "sticky" }, top: { md: 80 } }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Player Market</Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="Search players..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ mb: 1.5 }}
              />
              <Box sx={{ display: "flex", gap: 0.5, mb: 1.5, flexWrap: "wrap" }}>
                {(["ALL", "GK", "DEF", "MID", "FWD"] as const).map((pos) => (
                  <Chip
                    key={pos}
                    label={pos}
                    size="small"
                    onClick={() => setPosFilter(pos === "ALL" ? null : pos as Position)}
                    color={posFilter === pos || (pos === "ALL" && !posFilter) ? "primary" : "default"}
                    variant={posFilter === pos || (pos === "ALL" && !posFilter) ? "filled" : "outlined"}
                  />
                ))}
              </Box>
              <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <InputLabel>Club</InputLabel>
                <Select
                  value={clubFilter}
                  label="Club"
                  onChange={(e) => setClubFilter(e.target.value)}
                >
                  <MenuItem value="">All Clubs</MenuItem>
                  {allClubs.map((c) => (
                    <MenuItem key={c} value={c}>{c}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box sx={{ maxHeight: 500, overflow: "auto" }}>
                {players.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" textAlign="center" py={3}>
                    No players found. Sync players from the admin panel.
                  </Typography>
                ) : sidebarPlayers.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" textAlign="center" py={3}>
                    No players match your filters.
                  </Typography>
                ) : (
                  sidebarPlayers.map((p) => (
                    <PlayerCard
                      key={p._id}
                      player={p}
                      compact
                      selected={team.some((t) => t._id === p._id)}
                      onClick={() => team.some((t) => t._id === p._id) ? removePlayer(p._id) : addPlayer(p)}
                    />
                  ))
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Position filter dialog from pitch click */}
      <Dialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setReplacingPlayerId(null);
          setDialogSearch("");
          setDialogClubFilter("");
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { bgcolor: "background.paper" } }}
      >
        <DialogTitle>
          {replacingPlayerId
            ? `Replace ${team.find((p) => p._id === replacingPlayerId)?.name ?? "player"}`
            : `Select ${posFilter} Player`}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", gap: 1.5, mb: 2, mt: 1, flexWrap: "wrap" }}>
            <TextField
              size="small"
              placeholder="Search players..."
              value={dialogSearch}
              onChange={(e) => setDialogSearch(e.target.value)}
              sx={{ flex: 1, minWidth: 180 }}
            />
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>Club</InputLabel>
              <Select
                value={dialogClubFilter}
                label="Club"
                onChange={(e) => setDialogClubFilter(e.target.value)}
              >
                <MenuItem value="">All Clubs</MenuItem>
                {allClubs.map((c) => (
                  <MenuItem key={c} value={c}>{c}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ maxHeight: 400, overflow: "auto" }}>
            {dialogPlayers.length === 0 ? (
              <Typography variant="body2" color="text.secondary" textAlign="center" py={3}>
                No players match your filters.
              </Typography>
            ) : (
              dialogPlayers.map((p) => (
                <PlayerCard
                  key={p._id}
                  player={p}
                  compact
                  selected={team.some((t) => t._id === p._id)}
                  onClick={() => {
                    if (replacingPlayerId) {
                      replacePlayer(replacingPlayerId, p);
                    } else {
                      addPlayer(p);
                    }
                    setDialogOpen(false);
                    setReplacingPlayerId(null);
                    setDialogSearch("");
                    setDialogClubFilter("");
                  }}
                />
              ))
            )}
          </Box>
        </DialogContent>
      </Dialog>

      <Snackbar open={!!snack} autoHideDuration={3000} onClose={() => setSnack("")} message={snack} />
    </Box>
  );
}
