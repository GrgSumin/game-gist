import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CreatePlayer from "./Fantasy/addPlayer";
import CreateTeam from "./Fantasy/addTeam";
import SimulateMatch from "./Fantasy/simulateMatch";
import DisplayTeams from "./Fantasy/Teams";
import AddNews from "./News/AddNews";
import Dashboard from "./Fantasy/dashboard";

const App: React.FC = () => {
  return (
    <div className="">
      <Dashboard />
      <Routes>
        <Route path="create-player" element={<CreatePlayer />} />
        <Route path="create-team" element={<CreateTeam />} />
        <Route path="simulate-match" element={<SimulateMatch />} />
        <Route path="display-teams" element={<DisplayTeams />} />
        <Route path="add-news" element={<AddNews />} />
      </Routes>
    </div>
  );
};

export default App;
