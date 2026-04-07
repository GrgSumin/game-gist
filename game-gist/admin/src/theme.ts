import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#4A90D9" },
    secondary: { main: "#6C757D" },
    background: { default: "#111111", paper: "#1A1A1A" },
    text: { primary: "#FFFFFF", secondary: "#999" },
    divider: "#2A2A2A",
  },
  typography: {
    fontFamily: "'Roboto', sans-serif",
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiCard: {
      styleOverrides: {
        root: { backgroundImage: "none", border: "1px solid #2A2A2A" },
      },
    },
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          backgroundColor: "#4A90D9",
          color: "#fff",
          "&:hover": { backgroundColor: "#3A7BC8" },
        },
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
