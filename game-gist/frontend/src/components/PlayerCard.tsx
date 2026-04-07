import { Card, CardContent, Typography, Box, Chip, Avatar } from "@mui/material";
import type { Player } from "../types";

const posColor: Record<string, string> = {
  GK: "#D4A843",
  DEF: "#5B9BD5",
  MID: "#6BAF6B",
  FWD: "#D9534F",
};

interface Props {
  player: Player;
  onClick?: () => void;
  selected?: boolean;
  compact?: boolean;
}

export default function PlayerCard({ player, onClick, selected, compact }: Props) {
  if (compact) {
    return (
      <Box
        onClick={onClick}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          p: 1.5,
          borderRadius: 1,
          cursor: onClick ? "pointer" : "default",
          bgcolor: selected ? "#222" : "transparent",
          border: selected ? "1px solid #4A90D9" : "1px solid transparent",
          "&:hover": onClick ? { bgcolor: "#1e1e1e" } : {},
        }}
      >
        <Avatar src={player.photo} sx={{ width: 36, height: 36 }}>{player.name[0]}</Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body2" fontWeight={600} noWrap>{player.name}</Typography>
          <Typography variant="caption" color="text.secondary">{player.club}</Typography>
        </Box>
        <Chip label={player.position} size="small" sx={{ bgcolor: posColor[player.position] + "25", color: posColor[player.position], fontWeight: 600, fontSize: "0.7rem" }} />
        <Typography variant="body2" fontWeight={600}>{player.price.toFixed(1)}</Typography>
      </Box>
    );
  }

  return (
    <Card
      onClick={onClick}
      sx={{
        cursor: onClick ? "pointer" : "default",
        border: selected ? "1px solid #4A90D9" : undefined,
      }}
    >
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
          <Avatar src={player.photo} sx={{ width: 48, height: 48 }}>{player.name[0]}</Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body1" fontWeight={700} noWrap>{player.name}</Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              {player.clubLogo && <Avatar src={player.clubLogo} sx={{ width: 16, height: 16 }} />}
              <Typography variant="caption" color="text.secondary">{player.club}</Typography>
            </Box>
          </Box>
          <Chip label={player.position} size="small" sx={{ bgcolor: posColor[player.position] + "25", color: posColor[player.position], fontWeight: 600 }} />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          {[
            { label: "Price", val: `${player.price.toFixed(1)}m` },
            { label: "Points", val: player.totalPoints },
            { label: "Goals", val: player.stats.goals },
            { label: "Assists", val: player.stats.assists },
          ].map((s) => (
            <Box key={s.label} sx={{ textAlign: "center" }}>
              <Typography variant="caption" color="text.secondary">{s.label}</Typography>
              <Typography variant="body2" fontWeight={600}>{s.val}</Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
