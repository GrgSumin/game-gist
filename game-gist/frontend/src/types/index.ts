export type Position = "GK" | "DEF" | "MID" | "FWD";

export interface User {
  _id: string;
  email: string;
  username: string;
  avatar: string;
  role: string;
}

export interface Player {
  _id: string;
  apiId?: number;
  name: string;
  firstname: string;
  lastname: string;
  age?: number;
  nationality: string;
  photo: string;
  club: string;
  clubLogo: string;
  league: string;
  leagueId: number;
  position: Position;
  price: number;
  totalPoints: number;
  stats: PlayerStats;
}

export interface PlayerStats {
  appearances: number;
  goals: number;
  assists: number;
  cleanSheets: number;
  yellowCards: number;
  redCards: number;
  minutesPlayed: number;
}

export interface TeamSlot {
  playerId: string | Player;
  position: Position;
  isCaptain: boolean;
  isViceCaptain: boolean;
}

export interface FantasyTeam {
  _id: string;
  userId: string;
  name: string;
  formation: string;
  players: TeamSlot[];
  totalPoints: number;
  gameweekPoints: number;
  budget: number;
}

export interface LeaderboardEntry {
  rank: number;
  teamName: string;
  username: string;
  avatar: string;
  totalPoints: number;
  gameweekPoints: number;
}

export interface Fixture {
  fixture: {
    id: number;
    date: string;
    status: { short: string; long: string; elapsed?: number };
    venue: { name: string; city: string };
  };
  league: { id: number; name: string; logo: string; round: string };
  teams: {
    home: { id: number; name: string; logo: string; winner?: boolean };
    away: { id: number; name: string; logo: string; winner?: boolean };
  };
  goals: { home: number | null; away: number | null };
}

export interface StandingRow {
  rank: number;
  team: { id: number; name: string; logo: string };
  points: number;
  goalsDiff: number;
  all: { played: number; win: number; draw: number; lose: number; goals: { for: number; against: number } };
  form: string;
}

export interface NewsArticle {
  _id: string;
  title: string;
  shortDesc: string;
  description: string;
  image: string;
  url: string;
  source: string;
  isHeadline: boolean;
  category: string;
  createdAt: string;
}

export interface Group {
  _id: string;
  creatorId: { _id: string; username: string };
  groupCode: string;
  groupName: string;
  members: GroupMember[];
}

export interface GroupMember {
  userId: { _id: string; username: string; avatar: string };
  fantasyTeamId?: FantasyTeam;
  joinedAt: string;
}
