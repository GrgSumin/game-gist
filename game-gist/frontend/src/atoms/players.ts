import { atom } from "recoil";
import type { Player, Position } from "../types";

export const allPlayersState = atom<Player[]>({
  key: "allPlayersState",
  default: [],
});

export const positionFilterState = atom<Position | "ALL">({
  key: "positionFilterState",
  default: "ALL",
});

export const searchState = atom<string>({
  key: "searchState",
  default: "",
});
