import { NavLink } from "react-router-dom";
import "./Nab.css";

const Navbar = () => {
  return (
    <div className="nav">
      <ul>
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
        <NavLink
          to="/news"
          className={({ isActive }) =>
            isActive ? "nav-Link active" : "nav-Link"
          }
        >
          <li>News</li>
        </NavLink>
        <NavLink
          to="/standing"
          className={({ isActive }) =>
            isActive ? "nav-Link active" : "nav-Link"
          }
        >
          Standing
        </NavLink>
        <NavLink
          to="/fantasy"
          className={({ isActive }) =>
            isActive ? "nav-Link active" : "nav-Link"
          }
        >
          Fantasy
        </NavLink>
      </ul>
    </div>
  );
};

export default Navbar;
