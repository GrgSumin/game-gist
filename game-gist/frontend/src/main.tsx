import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import AuthProvider from "./context/Context.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RecoilRoot>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </RecoilRoot>
);
