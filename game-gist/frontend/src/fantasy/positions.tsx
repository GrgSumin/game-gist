import { PiTShirtFill } from "react-icons/pi";
import { FootballPlayer as playerType } from "./FootballPlayer";

interface PlayerProps {
  player: playerType | null;
  position: string;
  onSelect: () => void;
}

function Player({ position, player, onSelect }: PlayerProps) {
  return (
    <div
      onClick={onSelect}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {player ? (
        <img
          src={`${
            window.location.origin
          }/team/${player.club.toLowerCase()}.png`}
          alt={player.name}
          style={{
            height: 40,
            width: 40,
          }}
        />
      ) : (
        <PiTShirtFill size={40} color="gray" />
      )}
      <p
        style={{
          color: "black",
          padding: 2,
          fontSize: 10,
          width: 80,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontWeight: "bolder",
        }}
      >
        {player ? player.name : position}
      </p>
    </div>
  );
}

export default Player;