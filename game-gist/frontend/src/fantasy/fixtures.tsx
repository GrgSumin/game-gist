import React, { useEffect, useState } from "react";

// Define the TypeScript interfaces for fixture and team data
interface Fixture {
  id: number;
  event: number;
  team_a: number;
  team_h: number;
  team_a_score: number;
  team_h_score: number;
  pulse_id: number;
  kickoff_time: string;
  minutes: number;
  delay: number;
  status: string;
  code: string;
}

interface Team {
  id: number;
  name: string;
  logo: string; // Assuming you have URLs or paths to logos
}

const Fixtures: React.FC = () => {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFixtures = async () => {
      try {
        const fixtureResponse = await fetch("/api/fixtures/");
        const teamResponse = await fetch("/api/teams/"); // Fetch team data

        if (!fixtureResponse.ok || !teamResponse.ok) {
          throw new Error("Network response was not ok");
        }

        const fixtureData: Fixture[] = await fixtureResponse.json();
        const teamData: Team[] = await teamResponse.json();

        setFixtures(fixtureData);
        setTeams(teamData);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFixtures();
  }, []);

  // Function to get the team name and logo by ID
  const getTeamInfo = (teamId: number) => {
    const team = teams.find((t) => t.id === teamId);
    return team
      ? { name: team.name, logo: team.logo }
      : { name: "Unknown", logo: "" };
  };

  if (loading) {
    return (
      <p style={{ textAlign: "center", fontSize: "18px", color: "#555" }}>
        Loading fixtures...
      </p>
    );
  }

  if (error) {
    return (
      <p style={{ color: "red", textAlign: "center", fontSize: "18px" }}>
        Error: {error}
      </p>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "auto" }}>
      <h2
        style={{
          textAlign: "center",
          marginBottom: "20px",
          fontSize: "24px",
          color: "#333",
        }}
      >
        Fixtures
      </h2>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "20px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#fff",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f4f4f4", textAlign: "left" }}>
            <th
              style={{
                padding: "12px",
                border: "1px solid #ddd",
                fontWeight: "bold",
              }}
            >
              Event
            </th>
            <th
              style={{
                padding: "12px",
                border: "1px solid #ddd",
                fontWeight: "bold",
              }}
            >
              Home Team
            </th>
            <th
              style={{
                padding: "12px",
                border: "1px solid #ddd",
                fontWeight: "bold",
              }}
            >
              Score
            </th>
            <th
              style={{
                padding: "12px",
                border: "1px solid #ddd",
                fontWeight: "bold",
              }}
            >
              Away Team
            </th>
            <th
              style={{
                padding: "12px",
                border: "1px solid #ddd",
                fontWeight: "bold",
              }}
            >
              Kickoff Time
            </th>
            <th
              style={{
                padding: "12px",
                border: "1px solid #ddd",
                fontWeight: "bold",
              }}
            >
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {fixtures.map((fixture) => {
            const homeTeam = getTeamInfo(fixture.team_h);
            const awayTeam = getTeamInfo(fixture.team_a);

            return (
              <tr key={fixture.id}>
                <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                  {fixture.event}
                </td>
                <td
                  style={{
                    padding: "12px",
                    border: "1px solid #ddd",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={homeTeam.logo}
                    alt={homeTeam.name}
                    style={{ width: "30px", marginRight: "10px" }}
                  />
                  {homeTeam.name}
                </td>
                <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                  {fixture.team_h_score} - {fixture.team_a_score}
                </td>
                <td
                  style={{
                    padding: "12px",
                    border: "1px solid #ddd",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={awayTeam.logo}
                    alt={awayTeam.name}
                    style={{ width: "30px", marginRight: "10px" }}
                  />
                  {awayTeam.name}
                </td>
                <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                  {new Date(fixture.kickoff_time).toLocaleString()}
                </td>
                <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                  {fixture.status}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Fixtures;
