import { useRecoilValue } from "recoil";
import "./fantasy.css";
import { numberofPlayers, valueofPlayers } from "../atoms/myTeam";

function Teamstats() {
  const totalPlayer = useRecoilValue(numberofPlayers);
  const totalprice = useRecoilValue(valueofPlayers);

  return (
    <div className="Stats">
      <div className="">
        <p className="label">Players</p>
        <p className="value">{totalPlayer} / 11</p>
      </div>
      <div className="">
        <p className="label">Remaining</p>
        <p className="value">${((100 - totalprice) / 1).toFixed(1)}m</p>
      </div>
    </div>
  );
}

export default Teamstats;
