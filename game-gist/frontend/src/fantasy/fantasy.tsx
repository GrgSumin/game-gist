import React from "react";
import { NavLink } from "react-router-dom";

export const FantasyNavbar: React.FC = () => {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-around",
        padding: "10px",
        border: "1px solid white", // Add a border to make it stand out
        backgroundColor: "#2B323D",
        fontSize: "20px",
      }}
    >
      <NavLink
        to="/field"
        style={({ isActive }) => ({
          color: isActive ? "#B5D7F3" : "white",
          textDecoration: "none",
        })}
      >
        Transfer
      </NavLink>
      <NavLink
        to="/fantasynews"
        style={({ isActive }) => ({
          color: isActive ? "#B5D7F3" : "white",
          textDecoration: "none",
        })}
      >
        News
      </NavLink>
      <NavLink
        to="/myteam"
        style={({ isActive }) => ({
          color: isActive ? "#B5D7F3" : "white",
          textDecoration: "none",
        })}
      >
        My Team
      </NavLink>
    </nav>
  );
};

const Fantasy: React.FC = () => {
  return (
    <div>
      <FantasyNavbar />
    </div>
  );
};

export default Fantasy;
