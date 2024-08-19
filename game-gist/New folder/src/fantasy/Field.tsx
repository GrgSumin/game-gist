import "./fantasy.css";
import Player from "./positions";
import Filter from "./filter";
import PlayerList from "./playerLists";
import { useRecoilValue } from "recoil";
import { myPlayersByPosition } from "../atoms/myTeam";

type Players = {
  FWD: (string | null)[];
  MID: (string | null)[];
  DEF: (string | null)[];
  GK: (string | null)[];
};

function Field() {
  const players = useRecoilValue(myPlayersByPosition);
  return (
    <div style={{ color: "white" }}>
      <div className="field">
        <div className="player">
          {Object.keys(players).map((position, index) => (
            <div
              key={position}
              className={`position-${index}`}
              style={{
                position: "absolute",
                top: `${16 + index * 20}%`,
                color: "black",
                fontWeight: "bold",
                width: "500px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: "400px",
                  justifyContent: "space-around",
                }}
              >
                {players[position as keyof Players]?.map((player, index) => (
                  <Player key={index} position={position} player={player} />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="details">
          <Filter />
          <PlayerList />
        </div>
      </div>
    </div>
  );
}

export default Field;
