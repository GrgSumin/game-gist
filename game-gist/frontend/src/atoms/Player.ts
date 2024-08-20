import { atom, selector } from "recoil";
import { footballplayers, FootballPlayer } from "../fantasy/FootballPlayer";

export const allPlayersState = atom({
  key: "allPlayersState",
  default: footballplayers,
});
export const selectedPlayersState = atom<FootballPlayer[]>({
  key: "selectedPlayersState",
  default: [],
});

export const positionState = atom<string[]>({
  key: "positionState",
  default: ["All"],
});

export const filterPlayers = selector<FootballPlayer[]>({
  key: "filterPlayers",
  get: ({ get }) => {
    const players = get(allPlayersState);
    const filters = get(positionState);
    if (!players) return [];

    if (filters.includes("All") || filters.length === 0) return players;
    return players.filter((player) => filters.includes(player.position));
  },
});
