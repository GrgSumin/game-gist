import React, { useState, useEffect } from "react";

interface Match {
  id: number;
  homeTeam: { name: string };
  awayTeam: { name: string };
}

const ImportantMatches: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://m-api.allfootballapp.com/m/data/tab/important?start=2024-4-14"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok.");
        }
        const data = await response.json();
        setMatches(data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Important Matches</h2>
      <ul>
        {matches.map((match) => (
          <li key={match.id}>
            {match.homeTeam.name} vs {match.awayTeam.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ImportantMatches;
