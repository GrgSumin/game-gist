import { atom, selector } from "recoil";
import { FootballPlayer, Positions } from "../fantasy/FootballPlayer";

// Union type for position filters
type PositionFilter = Positions | "All";

// Selector to fetch all football players from the API
export const selectedPlayersState = atom<FootballPlayer[]>({
  key: "selectedPlayersState",
  default: [],
});

// Selector to fetch updated player data from the API
export const allPlayerState = selector<FootballPlayer[]>({
  key: "allPlayerState",
  get: async () => {
    try {
      const response = await fetch(
        "http://localhost:4001/api/footballplayers/players"
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      const players: FootballPlayer[] = data.map((player: any) => ({
        id: player._id,
        name: player.name,
        club: player.club,
        price: player.price,
        totalpoints: player.totalpoints,
        position: player.position,
        image: player.image,
      }));
      return players;
    } catch (error) {
      console.error("Failed to fetch players data", error);
      return [];
    }
  },
});

// Atom to hold the position filters
export const positionState = atom<PositionFilter[]>({
  key: "positionState",
  default: ["All"], // Default can be "All" or specific positions
});

// Selector to filter players based on position
export const filterPlayers = selector<FootballPlayer[]>({
  key: "filterPlayers",
  get: ({ get }) => {
    const players = get(allPlayerState);
    const filters = get(positionState);

    // Check if filters include "All" or if no filters are applied
    if (filters.includes("All") || filters.length === 0) return players;

    // Filter players based on the selected positions
    return players.filter((player) => filters.includes(player.position));
  },
});
