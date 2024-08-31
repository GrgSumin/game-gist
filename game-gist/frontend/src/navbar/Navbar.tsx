import React from "react";
import { NavLink } from "react-router-dom";
import "./Nab.css";
import useAuth from "../hooks/useAuth";

const Navbar: React.FC = () => {
  const { authenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="nav" style={{ borderBottom: "1px solid #ccc" }}>
      <ul>
        <NavLink
          to="/home"
          className={({ isActive }) =>
            isActive ? "nav-Link active" : "nav-Link"
          }
          style={({ isActive }) => ({
            color: isActive ? "#84CFDE" : "white",
            textDecoration: "none",
          })}
        >
          <li>Home</li>
        </NavLink>
        <NavLink
          to="/news"
          className={({ isActive }) =>
            isActive ? "nav-Link active" : "nav-Link"
          }
          style={({ isActive }) => ({
            color: isActive ? "#84CFDE" : "white",
            textDecoration: "none",
          })}
        >
          <li>News</li>
        </NavLink>
        {!authenticated ? (
          <>
            <NavLink
              to="/register"
              className={({ isActive }) =>
                isActive ? "nav-Link active" : "nav-Link"
              }
              style={({ isActive }) => ({
                color: isActive ? "#84CFDE" : "white",
                textDecoration: "none",
              })}
            >
              <li>Register</li>
            </NavLink>
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive ? "nav-Link active" : "nav-Link"
              }
              style={({ isActive }) => ({
                color: isActive ? "#84CFDE" : "white",
                textDecoration: "none",
              })}
            >
              <li>Login</li>
            </NavLink>
          </>
        ) : (
          <>
            <NavLink
              to="/leagues"
              className={({ isActive }) =>
                isActive ? "nav-Link active" : "nav-Link"
              }
              style={({ isActive }) => ({
                color: isActive ? "#84CFDE" : "white",
                textDecoration: "none",
              })}
            >
              <li>Leagues</li>
            </NavLink>
            <NavLink
              to="/fantasy"
              className={({ isActive }) =>
                isActive ? "nav-Link active" : "nav-Link"
              }
              style={({ isActive }) => ({
                color: isActive ? "#84CFDE" : "white",
                textDecoration: "none",
              })}
            >
              <li>Fantasy</li>
            </NavLink>
            <NavLink
              to="/login"
              onClick={handleLogout}
              className={({ isActive }) =>
                isActive ? "nav-Link active" : "nav-Link"
              }
              style={({ isActive }) => ({
                color: isActive ? "#84CFDE" : "white",
                textDecoration: "none",
              })}
            >
              <li>Logout</li>
            </NavLink>
          </>
        )}
      </ul>
    </div>
  );
};

export default Navbar;
