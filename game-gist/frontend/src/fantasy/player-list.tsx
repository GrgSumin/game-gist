import "./fantasy.css";

enum Positions {
  FW,
  MF,
  DF,
  GK,
}
type Player = {
  id: number;
  name: string;
  club: string;
  price: number;
  totalpoints: number;
  position: Positions;
};

interface playerProps {
  player: Player;
}
function Playerlist({ player }: playerProps) {
  const imageURL = `https://media.api-sports.io/football/players/${player.id}.png`;
  return (
    <div className="Lists">
      <div className="">
        <img className="image" src={imageURL} />
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

export default Playerlist;
