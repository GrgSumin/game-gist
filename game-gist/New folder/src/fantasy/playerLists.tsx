import Players from "./players";
import { useRecoilValue } from "recoil";
import { filterPlayers } from "../atoms/Player";

function playerLists() {
  const players = useRecoilValue(filterPlayers);
  return (
    <div className="">
      {players.map((player: any, i) => (
        <Players key={i} player={player} />
      ))}
    </div>
  );
}

export default playerLists;
