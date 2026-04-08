import { useEffect, useState } from "react";
import {
  Box, Typography, Card, CardContent, Avatar, Chip, Skeleton,
} from "@mui/material";
import { getFixturesByLeague } from "../api/endpoints";
import type { Fixture } from "../types";

const LEAGUES = [
  { id: 39, name: "Premier League" },
  { id: 140, name: "La Liga" },
  { id: 135, name: "Serie A" },
  { id: 78, name: "Bundesliga" },
  { id: 61, name: "Ligue 1" },
  { id: 2, name: "Champions League" },
];

export default function FixturesPage() {
  const [league, setLeague] = useState(39);
  const [recent, setRecent] = useState<Fixture[]>([]);
  const [upcoming, setUpcoming] = useState<Fixture[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getFixturesByLeague(league)
      .then((r) => {
        setRecent(r.data.recent);
        setUpcoming([...r.data.live, ...r.data.upcoming]);
      })
      .catch(() => {
        setRecent([]);
        setUpcoming([]);
      })
      .finally(() => setLoading(false));
  }, [league]);

  const isToday = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  };

  const isYesterday = (dateStr: string) => {
    const d = new Date(dateStr);
    const y = new Date();
    y.setDate(y.getDate() - 1);
    return d.toDateString() === y.toDateString();
  };

  const formatDate = (dateStr: string) => {
    if (isToday(dateStr)) return "Today";
    if (isYesterday(dateStr)) return "Yesterday";
    return new Date(dateStr).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
  };

  const formatTime = (dateStr: string) =>
    new Date(dateStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  // Group upcoming by date
  const groupByDate = (fixtures: Fixture[]) => {
    const groups: Record<string, Fixture[]> = {};
    for (const f of fixtures) {
      const key = formatDate(f.fixture.date);
      if (!groups[key]) groups[key] = [];
      groups[key].push(f);
    }
    return groups;
  };

  const upcomingGroups = groupByDate(upcoming);
  const recentGroups = groupByDate(recent);

  const FixtureRow = ({ f }: { f: Fixture }) => (
    <Box sx={{ display: "flex", alignItems: "center", py: 1.5, borderBottom: "1px solid #2A2A2A", "&:last-child": { borderBottom: 0 } }}>
      <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 1 }}>
        <Typography variant="body2" fontWeight={600} textAlign="right">{f.teams.home.name}</Typography>
        <Avatar src={f.teams.home.logo} sx={{ width: 28, height: 28 }} />
      </Box>
      <Box sx={{ px: 2, minWidth: 80, textAlign: "center" }}>
        {f.fixture.status.short === "NS" ? (
          <Typography variant="body2" fontWeight={600}>{formatTime(f.fixture.date)}</Typography>
        ) : ["LIVE", "1H", "2H", "HT"].includes(f.fixture.status.short) ? (
          <Box>
            <Typography variant="body2" fontWeight={700}>
              {f.goals.home ?? 0} - {f.goals.away ?? 0}
            </Typography>
            <Chip label={f.fixture.status.short === "HT" ? "HT" : `${f.fixture.status.elapsed}'`} size="small" color="error" sx={{ height: 18, fontSize: "0.65rem" }} />
          </Box>
        ) : (
          <Typography variant="body2" fontWeight={700}>
            {f.goals.home ?? 0} - {f.goals.away ?? 0}
          </Typography>
        )}
      </Box>
      <Box sx={{ flex: 1, display: "flex", alignItems: "center", gap: 1 }}>
        <Avatar src={f.teams.away.logo} sx={{ width: 28, height: 28 }} />
        <Typography variant="body2" fontWeight={600}>{f.teams.away.name}</Typography>
      </Box>
    </Box>
  );

  const FixtureGroup = ({ label, fixtures }: { label: string; fixtures: Fixture[] }) => (
    <Box sx={{ mb: 2 }}>
      <Typography variant="caption" fontWeight={700} color={label === "Today" ? "primary.main" : "text.secondary"} sx={{ mb: 0.5, display: "block", textTransform: "uppercase", letterSpacing: 1 }}>
        {label}
      </Typography>
      {fixtures.map((f) => (
        <FixtureRow key={f.fixture.id} f={f} />
      ))}
    </Box>
  );

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", px: { xs: 2, md: 3 }, py: 3 }}>
      <Typography variant="h4" gutterBottom>Fixtures</Typography>

      <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
        {LEAGUES.map((l) => (
          <Chip
            key={l.id}
            label={l.name}
            onClick={() => setLeague(l.id)}
            color={league === l.id ? "primary" : "default"}
            variant={league === l.id ? "filled" : "outlined"}
          />
        ))}
      </Box>

      {loading ? (
        <Card>
          <CardContent>
            {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} height={50} sx={{ mb: 1 }} />)}
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Upcoming Matches */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Upcoming Matches</Typography>
              {upcoming.length === 0 ? (
                <Typography color="text.secondary" variant="body2">No upcoming matches scheduled.</Typography>
              ) : (
                Object.entries(upcomingGroups).map(([date, fixtures]) => (
                  <FixtureGroup key={date} label={date} fixtures={fixtures} />
                ))
              )}
            </CardContent>
          </Card>

          {/* Recent Results */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Recent Results</Typography>
              {recent.length === 0 ? (
                <Typography color="text.secondary" variant="body2">No recent results available.</Typography>
              ) : (
                Object.entries(recentGroups).map(([date, fixtures]) => (
                  <FixtureGroup key={date} label={date} fixtures={fixtures} />
                ))
              )}
            </CardContent>
          </Card>
        </>
      )}
    </Box>
  );
}
