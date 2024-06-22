import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./login-system/Login";
import Register from "./login-system/Register";
import Navbar from "./navbar/Navbar";
import { Toaster } from "react-hot-toast";
import Single from "./news-app/Single";
import Standing from "./news-app/Standing";
import Fantasy from "./fantasy/fantasy";
import News from "./news-app/News";

function App() {
  return (
    <div style={{ backgroundColor: "222831" }}>
      <Navbar />
      <Toaster />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/news" element={<News />} />
        <Route path="/single" element={<Single />} />
        <Route path="/standing" element={<Standing />} />
        <Route path="/fantasy" element={<Fantasy />} />
        {/* <Route path="/livescore" element={<LiveScoresCard />} /> */}
        {/* <Route path="/match" element={<ImportantMatches />} /> */}
      </Routes>
    </div>
  );
}

export default App;
