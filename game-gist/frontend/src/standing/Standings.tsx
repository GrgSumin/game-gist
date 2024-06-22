import React, { useState } from "react";
import Standing from "./Standing";

interface League {
  id: number;
  name: string;
}

interface TeamStanding {
  position: number;
  playedGames: number;
  won: number;
  draw: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  team: string;
  badge: string | null;
}

const Standings: React.FC = () => {
  const [leagues] = useState<League[]>([
    { id: 2002, name: "Bundesliga" },
    { id: 2014, name: "Primera Division" },
    { id: 2015, name: "Ligue 1" },
    { id: 2019, name: "Serie A" },
    { id: 2021, name: "Premier League" },
  ]);
  const [standings, setStandings] = useState<TeamStanding[]>([]);
  const [selectedLeague, setSelectedLeague] = useState<string>("");

  const handleSelection = (id: number, name: string) => {
    fetchData(id, name);
  };

  const fetchData = (id: number, name: string) => {
    const Token = "bcfa8e34d26c48679e2c0a43fd8cf604";
    const URL = `https://api.football-data.org/v2/competitions/${id}/standings`;

    fetch(URL, {
      headers: { "X-Auth-Token": Token, "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((response) => {
        const rows: TeamStanding[] = response.standings[0].table.map(
          (item: any) => ({
            position: item.position,
            playedGames: item.playedGames,
            won: item.won,
            draw: item.draw,
            lost: item.lost,
            goalsFor: item.goalsFor,
            goalsAgainst: item.goalsAgainst,
            goalDifference: item.goalDifference,
            points: item.points,
            team: item.team.name,
            badge: item.team.crestUrl,
          })
        );
        setStandings(rows);
        setSelectedLeague(name);
      });
  };
  console.log(standings);

  return (
    <div className="App">
      <div className="container">
        <div className="row">
          <div className="col-lg-12 text-center mt-2">
            {leagues.map((league) => (
              <button
                className="btn btn-primary mr-2 mt-2"
                key={league.id}
                onClick={() => handleSelection(league.id, league.name)}
              >
                {league.name}
              </button>
            ))}
          </div>
        </div>

        <div className="table-responsive mt-5">
          <table className="table">
            {standings.length > 0 && (
              <thead>
                <tr>
                  <td colSpan={9}>
                    <h3>{selectedLeague}</h3>
                  </td>
                </tr>
                <tr>
                  <th className="position">#</th>
                  <th className="team" colSpan={2}>
                    Team
                  </th>
                  <th className="played">Played</th>
                  <th className="won">Won</th>
                  <th className="draw">Draw</th>
                  <th className="lost">Lost</th>
                  <th className="ga">GA</th>
                  <th className="points">Points</th>
                </tr>
              </thead>
            )}
            <tbody>
              {standings.map((standing) => (
                <Standing
                  key={standing.position}
                  position={standing.position}
                  badge={standing.badge}
                  team={standing.team}
                  played={standing.playedGames}
                  won={standing.won}
                  draw={standing.draw}
                  lost={standing.lost}
                  ga={standing.goalDifference}
                  points={standing.points}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Standings;
