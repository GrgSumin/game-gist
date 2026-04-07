import api from "./client";
import type { User, Player, FantasyTeam, Fixture, StandingRow, LeaderboardEntry, NewsArticle, Group } from "../types";

// Auth
export const loginUser = (email: string, password: string) =>
  api.post<{ user: User; token: string }>("/api/users/login", { email, password });

export const registerUser = (email: string, username: string, password: string) =>
  api.post<{ user: User; token: string }>("/api/users/register", { email, username, password });

export const getProfile = () =>
  api.get<{ user: User }>("/api/users/profile");

// Football data
export const getLeagues = () =>
  api.get<{ leagues: unknown[] }>("/api/football/leagues");

export const getFixtures = (league = 39, season = 2024) =>
  api.get<{ fixtures: Fixture[] }>(`/api/football/fixtures?league=${league}&season=${season}`);

export const getStandings = (league = 39, season = 2024) =>
  api.get<{ standings: StandingRow[][] }>(`/api/football/standings?league=${league}&season=${season}`);

export const getTopScorers = (league = 39) =>
  api.get(`/api/football/top-scorers?league=${league}`);

export const getTopAssists = (league = 39) =>
  api.get(`/api/football/top-assists?league=${league}`);

export const getPlayers = (params?: { league?: number; position?: string; search?: string; page?: number }) =>
  api.get<{ players: Player[]; pagination: { page: number; total: number; pages: number } }>("/api/football/players", { params });

export const getPlayerById = (id: string) =>
  api.get<{ player: Player }>(`/api/football/players/${id}`);

// Fantasy
export const saveFantasyTeam = (data: { name: string; formation: string; players: { playerId: string; position: string; isCaptain: boolean; isViceCaptain: boolean }[] }) =>
  api.post<{ team: FantasyTeam }>("/api/fantasy/team", data);

export const getMyTeam = () =>
  api.get<{ team: FantasyTeam | null }>("/api/fantasy/team");

export const getFantasyScore = () =>
  api.get<{ totalPoints: number; playerScores: unknown[] }>("/api/fantasy/score");

export const getLeaderboard = () =>
  api.get<{ leaderboard: LeaderboardEntry[] }>("/api/fantasy/leaderboard");

// Groups
export const createGroup = (groupName: string) =>
  api.post<{ group: Group }>("/api/groups/create", { groupName });

export const joinGroup = (groupCode: string) =>
  api.post<{ group: Group }>("/api/groups/join", { groupCode });

export const getMyGroups = () =>
  api.get<{ groups: Group[] }>("/api/groups/my");

export const getGroupMembers = (groupCode: string) =>
  api.get<{ group: Group }>(`/api/groups/${groupCode}/members`);

// News
export const getNews = (page = 1) =>
  api.get<{ articles: NewsArticle[]; headlines: NewsArticle[]; pagination: { total: number; pages: number } }>(`/api/news?page=${page}`);

export const getNewsById = (id: string) =>
  api.get<{ article: NewsArticle }>(`/api/news/${id}`);
