import React, { useEffect, useState } from "react";

// API configuration
const apiKey = "";
const apiUrl = "https://api.sportmonks.com/v3/football/leagues/";

// Define TypeScript interfaces for the API response
interface League {
  id: number;
  sport_id: number;
  country_id: number;
  name: string;
  active: boolean;
  short_code: string;
  image_path: string;
  type: string;
  sub_type: string;
  last_played_at: string;
  category: number;
  has_jerseys: boolean;
}

interface ApiResponse {
  data: League[];
}

// React component
const Leagues: React.FC = () => {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Function to fetch league data
    const fetchLeagues = async () => {
      try {
        const response = await fetch("http://localhost:4001/league");
        if (!response.ok) {
          throw new Error(
            `Network response was not ok: ${response.statusText}`
          );
        }
        const { data } = await response.json();
        console.log(data);
        setLeagues(data.data); // Adjust based on the API response structure
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(`Error fetching leagues: ${error.message}`);
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLeagues();
  }, []);

  // Render component based on state
  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div>
      <h1>Football Leagues</h1>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {leagues.map((league) => (
          <li
            key={league.id}
            style={{
              marginBottom: "20px",
              border: "1px solid #ddd",
              padding: "10px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              backgroundColor: "#f9f9f9",
            }}
          >
            <img
              src={league.image_path}
              alt={league.name}
              style={{
                width: "100px",
                height: "100px",
                objectFit: "cover",
                borderRadius: "8px",
                marginRight: "20px",
              }}
            />
            <div>
              <h2 style={{ margin: 0 }}>{league.name}</h2>
              <p style={{ margin: "5px 0" }}>
                <strong>Short Code:</strong> {league.short_code}
              </p>
              <p style={{ margin: "5px 0" }}>
                <strong>Type:</strong> {league.type}
              </p>
              <p style={{ margin: "5px 0" }}>
                <strong>Last Played At:</strong> {league.last_played_at}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leagues;
