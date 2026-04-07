import { Box, CircularProgress, Typography } from "@mui/material";

export default function LoadingScreen({ message = "Loading..." }: { message?: string }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: 2 }}>
      <CircularProgress sx={{ color: "primary.main" }} />
      <Typography variant="body2" color="text.secondary">{message}</Typography>
    </Box>
  );
}
