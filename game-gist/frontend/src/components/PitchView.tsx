import { Box, Typography, Avatar } from "@mui/material";
import type { Position } from "../types";
import type { TeamPlayer } from "../atoms/team";

interface Props {
  grouped: Record<Position, (TeamPlayer | null)[]>;
  onSlotClick?: (position: Position, index: number) => void;
  mode?: "edit" | "points";
  playerPoints?: Record<string, number>;
}

function PlayerSlot({
  player,
  position,
  onClick,
  mode = "edit",
  points,
}: {
  player: TeamPlayer | null;
  position: Position;
  onClick?: () => void;
  mode?: "edit" | "points";
  points?: number;
}) {
  return (
    <Box
      onClick={onClick}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        cursor: onClick ? "pointer" : "default",
        "&:hover": onClick ? { opacity: 0.8 } : {},
      }}
    >
      {/* Captain / VC badge */}
      {player && (player.isCaptain || player.isViceCaptain) && (
        <Box
          sx={{
            bgcolor: player.isCaptain ? "#4A90D9" : "#888",
            color: "#fff",
            width: 18,
            height: 18,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.55rem",
            fontWeight: 800,
            mb: -0.5,
            zIndex: 1,
          }}
        >
          {player.isCaptain ? "C" : "V"}
        </Box>
      )}
      <Avatar
        src={player?.clubLogo || player?.photo}
        sx={{
          width: { xs: 42, md: 52 },
          height: { xs: 42, md: 52 },
          bgcolor: player ? "#333" : "transparent",
          border: player ? "2px solid #fff" : "2px dashed #555",
          color: "#fff",
          fontSize: "1rem",
          fontWeight: 700,
          mb: 0.5,
        }}
      >
        {player ? player.name.split(" ").pop()?.[0] : "+"}
      </Avatar>
      {/* Name label */}
      <Box
        sx={{
          bgcolor: player ? "rgba(55,0,60,0.9)" : "transparent",
          borderRadius: 0.5,
          px: 0.8,
          py: 0.2,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontWeight: 600,
            fontSize: { xs: "0.6rem", md: "0.7rem" },
            color: player ? "#fff" : "#888",
            textAlign: "center",
            maxWidth: 80,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            display: "block",
          }}
        >
          {player ? player.name.split(" ").pop() : position}
        </Typography>
      </Box>
      {/* Points or Price */}
      {player && (
        <Box
          sx={{
            bgcolor: mode === "points" ? "#37003C" : "transparent",
            borderRadius: 0.5,
            px: 1,
            py: 0.1,
            mt: 0.3,
            minWidth: 28,
            textAlign: "center",
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: "#fff",
              fontSize: "0.65rem",
              fontWeight: 700,
              textShadow: mode === "edit" ? "0 1px 3px rgba(0,0,0,0.8)" : "none",
            }}
          >
            {mode === "points" ? (points ?? 0) : `${player.price.toFixed(1)}m`}
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default function PitchView({ grouped, onSlotClick, mode = "edit", playerPoints = {} }: Props) {
  const rows: Position[] = ["FWD", "MID", "DEF", "GK"];

  return (
    <Box
      sx={{
        background: "linear-gradient(180deg, #2D6B2D 0%, #347A34 25%, #2D6B2D 50%, #347A34 75%, #2D6B2D 100%)",
        borderRadius: 2,
        p: { xs: 2, md: 3 },
        minHeight: 400,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        overflow: "hidden",
        border: "2px solid #444",
      }}
    >
      {/* Center circle */}
      <Box sx={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
        width: 100, height: 100, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.15)",
      }} />
      <Box sx={{
        position: "absolute", top: "50%", left: 0, right: 0,
        borderTop: "2px solid rgba(255,255,255,0.12)",
      }} />

      {rows.map((pos) => (
        <Box key={pos} sx={{ display: "flex", justifyContent: "center", gap: { xs: 2, md: 4 }, py: 1.5 }}>
          {grouped[pos].map((player, idx) => (
            <PlayerSlot
              key={`${pos}-${idx}`}
              player={player}
              position={pos}
              onClick={onSlotClick ? () => onSlotClick(pos, idx) : undefined}
              mode={mode}
              points={player?._id ? playerPoints[player._id] : undefined}
            />
          ))}
        </Box>
      ))}
    </Box>
  );
}
