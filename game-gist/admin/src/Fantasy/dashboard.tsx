import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import "./Dashboard.css"; // Import CSS

const Dashboard: React.FC = () => {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <NavLink
              to="/create-player"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Create Player
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/create-team"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Create Team
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/simulate-match"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Simulate Match
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/display-teams"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Display Teams
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/display"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              LogOut
            </NavLink>
          </li>
        </ul>
      </nav>
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
