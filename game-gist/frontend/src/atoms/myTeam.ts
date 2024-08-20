import { atom, selector } from "recoil";
import { FootballPlayer, Positions } from "../fantasy/FootballPlayer";

export const myFormationState = atom<{ [key in Positions]: number }>({
  key: "myFormation",
  default: {
    FWD: 3,
    MID: 3,
    DEF: 4,
    GK: 1,
  },
});

export const myTeamState = atom<FootballPlayer[]>({
  key: "MyTeamState",
  default: [],
});

const positionList = ["FWD", "MID", "DEF", "GK"] as Positions[];

export const myPlayersByPosition = selector({
  key: "MyPlayersByPosition",
  get: ({ get }) => {
    const players = get(myTeamState);
    const myFormation = get(myFormationState);

    const groupPlayers: { [key in Positions]?: (FootballPlayer | null)[] } = {};

    positionList.forEach((position) => {
      groupPlayers[position] = players.filter((p) => p.position === position);

      for (
        let i = groupPlayers[position].length;
        i < myFormation[position];
        i++
      ) {
        groupPlayers[position].push(null);
      }
    });

    return groupPlayers;
  },
});

export const numberofPlayers = selector({
  key: "numberofPlayers",
  get: ({ get }) => {
    return get(myTeamState).length;
  },
});
export const valueofPlayers = selector({
  key: "valueofPlayers",
  get: ({ get }) => {
    return get(myTeamState).reduce((acc, player) => acc + player.price, 0);
  },
});
