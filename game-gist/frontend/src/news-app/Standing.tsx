import React, { useEffect, useState } from "react";

const Standing = () => {
  const [team, setTeam] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://api-football-standings.azharimm.site/leagues/eng.1/standings?season=2020`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          const error = await response.json();
          console.log(error);
          return;
        }

        const data = await response.json();
        setTeam(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);
  console.log(team);
  return <div>Standing</div>;
};

export default Standing;
