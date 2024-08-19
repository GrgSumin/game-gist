import { PiTShirtFill } from "react-icons/pi";
import { Player as playerType } from "./FootballPlayer";

interface PlayerProps {
  player: playerType | null;
  position: string;
}

function Player({ position, player }: PlayerProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <PiTShirtFill size={40} color={player ? "yellow" : "gray"} />
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
