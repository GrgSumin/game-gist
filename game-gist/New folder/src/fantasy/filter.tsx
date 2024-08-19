import { useRecoilState } from "recoil";
import { positionState } from "../atoms/Player";

const positionList = ["All", "FWD", "MID", "DEF", "GK"];

function Filter() {
  const [positionFilter, setPositionFilter] = useRecoilState(positionState);

  const FilterClick = (position: string) => {
    setPositionFilter([position]);
  };

  const isSelected = (position: string) => {
    return positionFilter.includes(position);
  };

  return (
    <div className="filter">
      {positionList.map((position, i) => (
        <div
          key={i}
          onClick={() => FilterClick(position)}
          className="filter-container"
          style={{
            backgroundColor: isSelected(position)
              ? "yellow"
              : "rgb(210, 207, 207)",
          }}
        >
          <h4 className="filter-text">{position}</h4>
        </div>
      ))}
    </div>
  );
}

export default Filter;
