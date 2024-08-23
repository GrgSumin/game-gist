import { useRecoilState, useRecoilValue } from "recoil";
import "./fantasy.css";
import { myFormationState, myTeamState } from "../atoms/myTeam";
import { FootballPlayer } from "./FootballPlayer";

interface PlayerProps {
  player: FootballPlayer;
}

function Players({ player }: PlayerProps) {
  const [myTeam, setMyTeam] = useRecoilState(myTeamState);
  const myFormation = useRecoilValue(myFormationState);

  const numberofPlayers = myTeam.filter(
    (p) => p.position === player.position
  ).length;

  const isSelected = myTeam.some((p: FootballPlayer) => p.id === player.id);

  const onClick = () => {
    if (isSelected) {
      setMyTeam((currentPlayers) =>
        currentPlayers.filter((p: FootballPlayer) => p.id !== player.id)
      );
    } else {
      if (numberofPlayers < myFormation[player.position]) {
        setMyTeam((currentPlayers) => [...currentPlayers, player]);
      }
    }
  };

  const imageURL = `https://media.api-sports.io/football/players/${player.id}.png`;

  return (
    <div
      onClick={onClick}
      className="Lists"
      style={{
        backgroundColor: isSelected ? "yellow" : "#fff",
        cursor: "pointer",
      }}
    >
      <div>
        <img
          className="image"
          src={`http://localhost:4001/uploads/${player.image}`}
          alt={player.name}
        />
      </div>
      <div>
        <h4 className="name" style={{ margin: 0 }}>
          {player.name}
        </h4>
        <h5 style={{ margin: 0 }}>{player.club}</h5>
      </div>
      <div className="price">
        <h4 className="name">{player.price}m</h4>
        <h5>{player.position}</h5>
      </div>
      <h2 className="points">{player.totalpoints}</h2>
    </div>
  );
}

export default Players;
