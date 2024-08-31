import React, { useState, useEffect } from "react";

interface Player {
  _id: string;
  name: string;
  club: string;
  totalpoints: number;
}

interface Team {
  _id: string;
  name: string;
  players: Player[];
}

const DisplayTeams: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch("http://localhost:4001/api/teams/teams");
        const data = await response.json();
        setTeams(data);
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };
    fetchTeams();
  }, []);

  return (
    <div>
      {teams.map((team) => (
        <div key={team._id}>
          <h3>{team.name}</h3>
          <ul>
            {team.players.map((player) => (
              <li key={player._id}>
                {player.name} ({player.club}) - Points: {player.totalpoints}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default DisplayTeams;
