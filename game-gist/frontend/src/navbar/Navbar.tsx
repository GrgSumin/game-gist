import { NavLink } from "react-router-dom";
import "./Nab.css";
import useAuth from "../hooks/useAuth";

const Navbar: React.FC = () => {
  const { authenticated, logout } = useAuth();

  const handleLogout = () => {
    logout(); // Clear only userId and authentication state
  };

  return (
    <div className="nav">
      <ul>
        <NavLink
          to="/home"
          className={({ isActive }) =>
            isActive ? "nav-Link active" : "nav-Link"
          }
        >
          <li>Home</li>
        </NavLink>
        <NavLink
          to="/news"
          className={({ isActive }) =>
            isActive ? "nav-Link active" : "nav-Link"
          }
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
            >
              <li>Register</li>
            </NavLink>
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive ? "nav-Link active" : "nav-Link"
              }
            >
              <li>Login</li>
            </NavLink>
          </>
        ) : (
          <>
            <NavLink
              to="/standing"
              className={({ isActive }) =>
                isActive ? "nav-Link active" : "nav-Link"
              }
            >
              <li>Standing</li>
            </NavLink>
            <NavLink
              to="/fantasy"
              className={({ isActive }) =>
                isActive ? "nav-Link active" : "nav-Link"
              }
            >
              <li>Fantasy</li>
            </NavLink>
            <NavLink
              to="/login"
              onClick={handleLogout}
              className={({ isActive }) =>
                isActive ? "nav-Link active" : "nav-Link"
              }
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
