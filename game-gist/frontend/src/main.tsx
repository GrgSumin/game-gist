import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { Toaster } from "react-hot-toast";
import theme from "./theme/theme";
import AuthProvider from "./context/AuthContext";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RecoilRoot>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Toaster
            position="top-center"
            toastOptions={{
              style: { background: "#162037", color: "#fff", border: "1px solid rgba(255,255,255,0.08)" },
            }}
          />
          <App />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </RecoilRoot>
);
