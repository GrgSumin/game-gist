import React from "react";

interface StandingProps {
  position: number;
  badge: string | null;
  team: string;
  played: number;
  won: number;
  draw: number;
  lost: number;
  ga: number;
  points: number;
}

const Standing: React.FC<StandingProps> = ({
  position,
  badge,
  team,
  played,
  won,
  draw,
  lost,
  ga,
  points,
}) => {
  const symbol = ga > 0 ? "+" : "";

  return (
    <tr>
      <td>{position}</td>
      <td className="badge-td">
        <div className="badge">
          <img src={badge || ""} alt={team} />
        </div>
      </td>
      <td className="text-left">{team}</td>
      <td>{played}</td>
      <td>{won}</td>
      <td>{draw}</td>
      <td>{lost}</td>
      <td>{`${symbol}${ga}`}</td>
      <td>{points}</td>
    </tr>
  );
};

export default Standing;
