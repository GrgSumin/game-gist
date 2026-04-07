import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { Toaster } from "react-hot-toast";
import theme from "./theme";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Toaster position="top-center" toastOptions={{ style: { background: "#162037", color: "#fff" } }} />
      <App />
    </ThemeProvider>
  </BrowserRouter>
);
