import { useState, useEffect } from "react";
import {
  Box, Typography, Card, CardContent, Button, Alert, CircularProgress, Chip,
} from "@mui/material";
import SyncIcon from "@mui/icons-material/Sync";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import toast from "react-hot-toast";
import api from "../api";

const LEAGUES = [
  { id: 39, name: "Premier League", emoji: "EN" },
  { id: 2, name: "Champions League", emoji: "EU" },
  { id: 78, name: "Bundesliga", emoji: "DE" },
];

interface GameweekInfo {
  number: number;
  label: string;
  isCurrent: boolean;
  createdAt: string;
}

export default function SyncPlayers() {
  const [syncing, setSyncing] = useState<number | null>(null);
  const [advancing, setAdvancing] = useState(false);
  const [results, setResults] = useState<Record<number, string>>({});
  const [gameweeks, setGameweeks] = useState<GameweekInfo[]>([]);

  useEffect(() => {
    api.get("/api/football/gameweeks").then((r) => setGameweeks(r.data.gameweeks)).catch(() => {});
  }, []);

  const currentGw = gameweeks.find((g) => g.isCurrent);

  const handleSync = async (leagueId: number) => {
    setSyncing(leagueId);
    try {
      const { data } = await api.post(`/api/football/sync-players?league=${leagueId}`);
      const msg = `Synced ${data.totalSynced} players, ${data.pointsUpdated} scored (GW${data.gameweek})`;
      setResults((prev) => ({ ...prev, [leagueId]: msg }));
      toast.success(msg);
      api.get("/api/football/gameweeks").then((r) => setGameweeks(r.data.gameweeks)).catch(() => {});
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || "Sync failed";
      setResults((prev) => ({ ...prev, [leagueId]: `Error: ${msg}` }));
      toast.error(msg);
    } finally {
      setSyncing(null);
    }
  };

  const handleAdvance = async () => {
    setAdvancing(true);
    try {
      const { data } = await api.post("/api/football/advance-gameweek");
      toast.success(`Advanced to Gameweek ${data.gameweek.number}`);
      api.get("/api/football/gameweeks").then((r) => setGameweeks(r.data.gameweeks)).catch(() => {});
    } catch {
      toast.error("Failed to advance gameweek");
    } finally {
      setAdvancing(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight={800}>Sync Players</Typography>

      {/* Gameweek info */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
            <Box>
              <Typography variant="h6" fontWeight={700}>
                {currentGw ? currentGw.label : "No gameweek started"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {currentGw
                  ? `Started: ${new Date(currentGw.createdAt).toLocaleDateString()}`
                  : "First sync will create Gameweek 1"}
              </Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={advancing ? <CircularProgress size={16} /> : <SkipNextIcon />}
              onClick={handleAdvance}
              disabled={advancing || !currentGw}
            >
              {advancing ? "Advancing..." : "Advance Gameweek"}
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Alert severity="info" sx={{ mb: 3 }}>
        <strong>How weekly scoring works:</strong> Each sync compares new stats with previous stats.
        The difference (new goals, assists, etc.) becomes that gameweek's points.
        After a matchday, sync to update points, then click "Advance Gameweek" to start fresh.
      </Alert>

      {LEAGUES.map((league) => (
        <Card key={league.id} sx={{ mb: 2 }}>
          <CardContent sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Chip label={league.emoji} size="small" />
              <Box>
                <Typography fontWeight={700}>{league.name}</Typography>
                <Typography variant="caption" color="text.secondary">League ID: {league.id}</Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {results[league.id] && (
                <Typography variant="body2" color={results[league.id].startsWith("Error") ? "error.main" : "success.main"}>
                  {results[league.id]}
                </Typography>
              )}
              <Button
                variant="contained"
                startIcon={syncing === league.id ? <CircularProgress size={18} color="inherit" /> : <SyncIcon />}
                onClick={() => handleSync(league.id)}
                disabled={syncing !== null}
              >
                {syncing === league.id ? "Syncing..." : "Sync"}
              </Button>
            </Box>
          </CardContent>
        </Card>
      ))}

      {/* Gameweek history */}
      {gameweeks.length > 0 && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Gameweek History</Typography>
            {gameweeks.map((gw) => (
              <Box key={gw.number} sx={{ display: "flex", justifyContent: "space-between", py: 1, borderBottom: "1px solid #2A2A2A" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography fontWeight={600}>{gw.label}</Typography>
                  {gw.isCurrent && <Chip label="Current" size="small" color="primary" />}
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {new Date(gw.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
            ))}
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
