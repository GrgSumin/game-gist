import { atom, selector } from "recoil";
import type { Player, Position } from "../types";

export interface TeamPlayer extends Player {
  isCaptain: boolean;
  isViceCaptain: boolean;
}

export const myTeamState = atom<TeamPlayer[]>({
  key: "myTeamState",
  default: [],
});

export const teamNameState = atom<string>({
  key: "teamNameState",
  default: "My Fantasy XI",
});

export const formationState = atom<string>({
  key: "formationState",
  default: "4-3-3",
});

export const teamByPosition = selector({
  key: "teamByPosition",
  get: ({ get }) => {
    const players = get(myTeamState);
    const formation = get(formationState);
    const [d, m, f] = formation.split("-").map(Number);
    const slots: Record<Position, number> = { GK: 1, DEF: d, MID: m, FWD: f };

    const grouped: Record<Position, (TeamPlayer | null)[]> = { GK: [], DEF: [], MID: [], FWD: [] };

    (["GK", "DEF", "MID", "FWD"] as Position[]).forEach((pos) => {
      const posPlayers = players.filter((p) => p.position === pos);
      grouped[pos] = [...posPlayers];
      while (grouped[pos].length < slots[pos]) {
        grouped[pos].push(null);
      }
    });

    return grouped;
  },
});

export const teamCount = selector({
  key: "teamCount",
  get: ({ get }) => get(myTeamState).length,
});

export const teamValue = selector({
  key: "teamValue",
  get: ({ get }) => get(myTeamState).reduce((sum, p) => sum + p.price, 0),
});

export const remainingBudget = selector({
  key: "remainingBudget",
  get: ({ get }) => 100 - get(teamValue),
});
