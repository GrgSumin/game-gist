import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./home.css";
import useAuth from "../hooks/useAuth";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { authenticated } = useAuth();

  const handlePlayClick = () => {
    if (authenticated) {
      navigate("/fantasy");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="Welcome">
      <div className="left-container">
        <div className="">
          <div className="big">
            <h1>Welcome to</h1>
          </div>
          <div className="small">
            <h1>GameGist</h1>
          </div>
        </div>
        <p>
          Game Gist emerges as a cutting-edge platform, seamlessly marrying
          fantasy football team management with real-time news delivery,
          captivating the global football community.
        </p>
        <div className="btn">
          <Link to="/news">
            <button className="news1">News</button>
          </Link>
          <button className="play" onClick={handlePlayClick}>
            Play
          </button>
        </div>
      </div>

      <div className="Image"></div>
    </div>
  );
};

export default Home;
