import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Typography, Card, CardContent, Button, Skeleton, Avatar, Chip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { getMyTeam, getFantasyScore } from "../api/endpoints";
import type { Player, Position } from "../types";
import type { TeamPlayer } from "../atoms/team";
import PitchView from "../components/PitchView";
import useAuth from "../hooks/useAuth";

interface PlayerScore {
  playerId: string;
  name: string;
  position: string;
  club: string;
  photo: string;
  points: number;
  isCaptain: boolean;
  isViceCaptain: boolean;
  stats: {
    appearances: number;
    goals: number;
    assists: number;
    cleanSheets: number;
    yellowCards: number;
    redCards: number;
    minutesPlayed: number;
  };
}

export default function MyTeam() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [teamName, setTeamName] = useState("");
  const [formation, setFormation] = useState("4-3-3");
  const [players, setPlayers] = useState<TeamPlayer[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [gameweekPoints, setGameweekPoints] = useState(0);
  const [gameweek, setGameweek] = useState(0);
  const [playerScores, setPlayerScores] = useState<PlayerScore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    Promise.allSettled([
      getMyTeam().then(({ data }) => {
        if (data.team) {
          setTeamName(data.team.name);
          setFormation(data.team.formation);
          setTotalPoints(data.team.totalPoints);
          const loaded: TeamPlayer[] = data.team.players
            .filter((s) => s.playerId && typeof s.playerId === "object")
            .map((s) => ({
              ...(s.playerId as unknown as Player),
              isCaptain: s.isCaptain,
              isViceCaptain: s.isViceCaptain,
            }));
          setPlayers(loaded);
        }
      }),
      getFantasyScore().then(({ data }) => {
        setTotalPoints(data.totalPoints);
        setGameweekPoints(data.gameweekPoints);
        setGameweek(data.gameweek);
        setPlayerScores(data.playerScores as PlayerScore[]);
      }),
    ]).finally(() => setLoading(false));
  }, [isAuthenticated]);

  // Build grouped for PitchView
  const grouped: Record<Position, (TeamPlayer | null)[]> = { GK: [], DEF: [], MID: [], FWD: [] };
  if (players.length > 0) {
    const [d, m, f] = formation.split("-").map(Number);
    const slots: Record<Position, number> = { GK: 1, DEF: d, MID: m, FWD: f };
    (["GK", "DEF", "MID", "FWD"] as Position[]).forEach((pos) => {
      const posPlayers = players.filter((p) => p.position === pos);
      grouped[pos] = [...posPlayers];
      while (grouped[pos].length < slots[pos]) grouped[pos].push(null);
    });
  }

  // Build points map for PitchView
  const pointsMap: Record<string, number> = {};
  for (const ps of playerScores) {
    pointsMap[ps.playerId] = ps.points;
  }

  if (!isAuthenticated) {
    return (
      <Box sx={{ maxWidth: 900, mx: "auto", px: { xs: 2, md: 3 }, py: 3, textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>My Team</Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>Sign in to view your fantasy team.</Typography>
        <Button variant="contained" onClick={() => navigate("/login")}>Sign In</Button>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ maxWidth: 900, mx: "auto", px: { xs: 2, md: 3 }, py: 3 }}>
        <Skeleton height={60} />
        <Skeleton height={400} />
      </Box>
    );
  }

  if (players.length === 0) {
    return (
      <Box sx={{ maxWidth: 900, mx: "auto", px: { xs: 2, md: 3 }, py: 3, textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>My Team</Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>You haven't created a team yet.</Typography>
        <Button variant="contained" onClick={() => navigate("/team")}>Build Your Team</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", px: { xs: 2, md: 3 }, py: 3 }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={800}>{teamName}</Typography>
          <Typography variant="body2" color="text.secondary">
            {formation} Formation {gameweek > 0 && `| Gameweek ${gameweek}`}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h4" fontWeight={800} color="primary.main">{totalPoints}</Typography>
            <Typography variant="caption" color="text.secondary">Total Points</Typography>
          </Box>
          {gameweek > 0 && (
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h4" fontWeight={800} color="success.main">{gameweekPoints}</Typography>
              <Typography variant="caption" color="text.secondary">GW {gameweek} Points</Typography>
            </Box>
          )}
          <Button variant="outlined" startIcon={<EditIcon />} onClick={() => navigate("/team")} size="small">
            Edit Team
          </Button>
        </Box>
      </Box>

      {/* Pitch View with Points */}
      <PitchView grouped={grouped} mode="points" playerPoints={pointsMap} />

      {/* Player Stats Table */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Player Points Breakdown</Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Player</TableCell>
                  <TableCell align="center">Pos</TableCell>
                  <TableCell align="center">Apps</TableCell>
                  <TableCell align="center">Goals</TableCell>
                  <TableCell align="center">Assists</TableCell>
                  <TableCell align="center">CS</TableCell>
                  <TableCell align="center">YC</TableCell>
                  <TableCell align="center">RC</TableCell>
                  <TableCell align="center">Pts</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(playerScores.length > 0 ? playerScores : players.map((p) => ({
                  playerId: p._id,
                  name: p.name,
                  position: p.position,
                  club: p.club,
                  photo: p.photo || p.clubLogo,
                  points: 0,
                  isCaptain: p.isCaptain,
                  isViceCaptain: p.isViceCaptain,
                  stats: p.stats || { appearances: 0, goals: 0, assists: 0, cleanSheets: 0, yellowCards: 0, redCards: 0, minutesPlayed: 0 },
                }))).map((ps) => (
                  <TableRow key={ps.playerId} sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.02)" } }}>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Avatar src={ps.photo} sx={{ width: 28, height: 28 }} />
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {ps.name}
                            {ps.isCaptain && <Chip label="C" size="small" color="primary" sx={{ ml: 0.5, height: 16, fontSize: "0.55rem" }} />}
                            {ps.isViceCaptain && <Chip label="V" size="small" sx={{ ml: 0.5, height: 16, fontSize: "0.55rem" }} />}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">{ps.club}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Chip label={ps.position} size="small" sx={{ height: 20, fontSize: "0.65rem" }} />
                    </TableCell>
                    <TableCell align="center">{ps.stats?.appearances || 0}</TableCell>
                    <TableCell align="center" sx={{ color: "success.main", fontWeight: 600 }}>{ps.stats?.goals || 0}</TableCell>
                    <TableCell align="center">{ps.stats?.assists || 0}</TableCell>
                    <TableCell align="center">{ps.stats?.cleanSheets || 0}</TableCell>
                    <TableCell align="center" sx={{ color: "warning.main" }}>{ps.stats?.yellowCards || 0}</TableCell>
                    <TableCell align="center" sx={{ color: "error.main" }}>{ps.stats?.redCards || 0}</TableCell>
                    <TableCell align="center">
                      <Typography fontWeight={800} color="primary.main">{ps.points}</Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}
