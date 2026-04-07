import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#4A90D9" },
    secondary: { main: "#6C757D" },
    background: { default: "#111111", paper: "#1A1A1A" },
    text: { primary: "#FFFFFF", secondary: "#999999" },
    error: { main: "#DC3545" },
    warning: { main: "#FFC107" },
    success: { main: "#28A745" },
    divider: "rgba(255,255,255,0.08)",
  },
  typography: {
    fontFamily: "'Roboto', sans-serif",
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 400, color: "#999" },
    button: { fontWeight: 600, textTransform: "none" },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          border: "1px solid #2A2A2A",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 6, padding: "8px 20px" },
        containedPrimary: {
          backgroundColor: "#4A90D9",
          color: "#fff",
          "&:hover": { backgroundColor: "#3A7BC8" },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600, borderRadius: 4 },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { borderColor: "#2A2A2A" },
        head: { fontWeight: 700, color: "#999", textTransform: "uppercase", fontSize: "0.75rem" },
      },
    },
  },
});

export default theme;
