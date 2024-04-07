import { Link } from "react-router-dom";
import "./Nab.css";

const Navbar = () => {
  return (
    <div className="nav">
      <ul>
        <Link to="/register" className="nav-Link">
          <li>Register</li>
        </Link>
        <Link to="/login" className="nav-Link">
          <li>Login</li>
        </Link>
        <Link to="/news" className="nav-Link">
          <li>News</li>
        </Link>
      </ul>
    </div>
  );
};

export default Navbar;
