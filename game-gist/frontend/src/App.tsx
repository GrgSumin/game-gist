import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TeamSelection from "./pages/TeamSelection";
import Players from "./pages/Players";
import Fixtures from "./pages/Fixtures";
import Standings from "./pages/Standings";
import Leaderboard from "./pages/Leaderboard";
import News from "./pages/News";
import NewsDetail from "./pages/NewsDetail";
import Groups from "./pages/Groups";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/team" element={<TeamSelection />} />
        <Route path="/fixtures" element={<Fixtures />} />
        <Route path="/players" element={<Players />} />
        <Route path="/standings" element={<Standings />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/news" element={<News />} />
        <Route path="/news/:id" element={<NewsDetail />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
