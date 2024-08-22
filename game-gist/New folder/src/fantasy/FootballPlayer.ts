export enum Positions {
  GK = "GK",
  DEF = "DEF",
  MID = "MID",
  FWD = "FWD",
}
export type Player = {
  id: number;
  name: string;
  club: string;
  price: number;
  totalpoints: number;
  position: Positions;
};

export const footballplayers: Player[] = [
  {
    id: 1,
    name: "Brice Samba",
    club: "Lens",
    price: 4,
    position: Positions.GK,
    totalpoints: 0,
  },
  {
    id: 2,
    name: "Mike Maignan",
    club: "AC Milan",
    price: 7,
    position: Positions.GK,
    totalpoints: 0,
  },
  {
    id: 3,
    name: "Alphonse Areola",
    club: "West Ham",
    price: 2,
    position: Positions.GK,
    totalpoints: 0,
  },
  // Defenders
  {
    id: 4,
    name: "Ibrahima Konate",
    club: "Liverpool",
    price: 3,
    position: Positions.DEF,
    totalpoints: 0,
  },
  {
    id: 5,
    name: "William Saliba",
    club: "Arsenal",
    price: 5,
    position: Positions.DEF,
    totalpoints: 0,
  },
  {
    id: 6,
    name: "Jules Kounde",
    club: "Barcelona",
    price: 8,
    position: Positions.DEF,
    totalpoints: 0,
  },
  {
    id: 7,
    name: "Dayot Upamecano",
    club: "Bayern Munich",
    price: 1,
    position: Positions.DEF,
    totalpoints: 0,
  },
  {
    id: 8,
    name: "Jonathan Clauss",
    club: "Marseille",
    price: 6,
    position: Positions.DEF,
    totalpoints: 0,
  },
  {
    id: 9,
    name: "Benjamin Pavard",
    club: "Inter Milan",
    price: 9,
    position: Positions.DEF,
    totalpoints: 0,
  },
  {
    id: 10,
    name: "Theo Hernandez",
    club: "AC Milan",
    price: 4,
    position: Positions.DEF,
    totalpoints: 0,
  },
  {
    id: 11,
    name: "Ferland Mendy",
    club: "Real Madrid",
    price: 7,
    position: Positions.DEF,
    totalpoints: 0,
  },
  // Midfielders
  {
    id: 12,
    name: "N'Golo Kante",
    club: "Al-Ittihad",
    price: 2,
    position: Positions.MID,
    totalpoints: 0,
  },
  {
    id: 13,
    name: "Eduardo Camavinga",
    club: "Real Madrid",
    price: 5,
    position: Positions.MID,
    totalpoints: 0,
  },
  {
    id: 14,
    name: "Adrien Rabiot",
    club: "Juventus",
    price: 8,
    position: Positions.MID,
    totalpoints: 0,
  },
  {
    id: 15,
    name: "Warren Zaire-Emery",
    club: "PSG",
    price: 1,
    position: Positions.MID,
    totalpoints: 0,
  },
  {
    id: 16,
    name: "Youssouf Fofana",
    club: "Monaco",
    price: 3,
    position: Positions.MID,
    totalpoints: 0,
  },
  {
    id: 17,
    name: "Aurelien Tchouameni",
    club: "Real Madrid",
    price: 6,
    position: Positions.MID,
    totalpoints: 0,
  },
  // Forwards
  {
    id: 18,
    name: "Olivier Giroud",
    club: "AC Milan",
    price: 9,
    position: Positions.FWD,
    totalpoints: 0,
  },
  {
    id: 19,
    name: "Antoine Griezmann",
    club: "Atletico Madrid",
    price: 4,
    position: Positions.FWD,
    totalpoints: 0,
  },
  {
    id: 20,
    name: "Kylian Mbappe",
    club: "PSG",
    price: 7,
    position: Positions.FWD,
    totalpoints: 0,
  },
  {
    id: 21,
    name: "Ousmane Dembele",
    club: "PSG",
    price: 2,
    position: Positions.FWD,
    totalpoints: 0,
  },
  {
    id: 22,
    name: "Randal Kolo Muani",
    club: "PSG",
    price: 5,
    position: Positions.FWD,
    totalpoints: 0,
  },
  {
    id: 23,
    name: "Marcus Thuram",
    club: "Inter Milan",
    price: 8,
    position: Positions.FWD,
    totalpoints: 0,
  },
  {
    id: 24,
    name: "Bradley Barcola",
    club: "PSG",
    price: 1,
    position: Positions.FWD,
    totalpoints: 0,
  },
  {
    id: 25,
    name: "Kingsley Coman",
    club: "Bayern Munich",
    price: 6,
    position: Positions.FWD,
    totalpoints: 0,
  },
];