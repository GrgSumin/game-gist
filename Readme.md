# Game Gist - Fantasy Football Platform

A full-stack fantasy football web app powered by real football data. Build your dream team, compete with friends in private leagues, and track live scores, standings, and news from top European leagues.

## What is Game Gist?

Game Gist is a fantasy football game where you:

- **Pick your squad** - Select 11 real players within a budget (100M)
- **Earn points weekly** - Players earn fantasy points based on real-world performances (goals, assists, clean sheets, cards)
- **Compete with friends** - Create or join private groups with invite codes
- **Track everything** - Live standings, fixtures, top scorers, and football news from the Premier League, Champions League, and Bundesliga

Points are calculated using a weekly-diff system: each sync compares a player's current season stats with their previous stats, and the difference becomes that gameweek's points.

### Fantasy Points System

| Action | Points |
|--------|--------|
| Goal (FWD/MID) | +4 |
| Goal (DEF/GK) | +6 |
| Assist | +3 |
| Clean Sheet (DEF/GK) | +4 |
| 60+ Minutes Played | +2 |
| Yellow Card | -1 |
| Red Card | -3 |
| Captain | 2x points |

## Tech Stack

| Layer | Tech |
|-------|------|
| **Backend** | Node.js, Express, MongoDB (Mongoose) |
| **Frontend** | React 18, TypeScript, Vite, MUI 5, Recoil |
| **Admin Panel** | React 18, TypeScript, Vite, MUI 5 |
| **Auth** | JWT + bcrypt |
| **Football Data** | [API-Football](https://www.api-football.com/) (free tier, 100 req/day) |
| **News** | [GNews API](https://gnews.io/) (free tier, 100 req/day) + manual admin articles |
| **Database** | MongoDB Atlas (cloud) |

## Project Structure

```
game-gist/
├── backend/          # Express API server (port 4001)
│   ├── controller/   # Route handlers
│   ├── middleware/    # JWT auth, admin guard
│   ├── model/        # Mongoose schemas
│   ├── routes/       # API routes
│   └── services/     # API-Football & GNews integrations
├── frontend/         # Main user app (port 5173)
│   ├── src/
│   │   ├── api/        # Axios client & endpoints
│   │   ├── atoms/      # Recoil state
│   │   ├── components/ # Navbar, PitchView, PlayerCard
│   │   ├── context/    # Auth context
│   │   ├── pages/      # Dashboard, Team, Players, etc.
│   │   ├── theme/      # Dark theme config
│   │   └── types/      # TypeScript interfaces
└── admin/            # Admin panel (port 5174)
    └── src/
        └── pages/    # Dashboard, SyncPlayers, Users, AddNews
```

## Prerequisites

- **Node.js** 18+
- **Yarn** (package manager)
- **MongoDB Atlas** account (free tier) - [mongodb.com/atlas](https://www.mongodb.com/atlas)
- **API-Football** key (free) - [api-football.com](https://www.api-football.com/)
- **GNews** API key (free, optional) - [gnews.io](https://gnews.io/)

## Installation

### 1. Clone the repo

```bash
git clone https://github.com/GrgSumin/game-gist.git
cd game-gist/game-gist
```

### 2. Install dependencies

```bash
# Backend
cd backend && yarn install

# Frontend
cd ../frontend && yarn install

# Admin
cd ../admin && yarn install
```

### 3. Configure environment

Create `backend/.env` from the example:

```bash
cp backend/.env.example backend/.env
```

Fill in your values:

```env
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/game-gist
PORT=4001
JWT_SECRET=your-secret-key-change-this
API_FOOTBALL_KEY=your-api-football-key
GNEWS_API_KEY=your-gnews-api-key
CORS_ORIGIN=http://localhost:5173,http://localhost:5174
```

### 4. Run the app

Open three terminals:

```bash
# Terminal 1 - Backend
cd backend
yarn dev
# Runs on http://localhost:4001

# Terminal 2 - Frontend
cd frontend
yarn dev
# Runs on http://localhost:5173

# Terminal 3 - Admin Panel
cd admin
yarn dev
# Runs on http://localhost:5174
```

## How to Use

### As a Player
1. Register at `http://localhost:5173`
2. Browse players and build your 11-player squad within budget
3. Set your captain for 2x points
4. Join or create groups to compete with friends
5. Check the leaderboard to see rankings

### As an Admin
1. Login at `http://localhost:5174` with an admin account
2. **Sync Players** - Pulls latest player stats from API-Football and calculates gameweek points
3. **Advance Gameweek** - After syncing, advance to start a new scoring period
4. **Add News** - Write custom articles that appear alongside API news
5. **Manage Users** - View registered users

### Setting Up an Admin Account

After registering a normal account, promote it to admin in MongoDB:

```javascript
// In MongoDB Atlas or mongosh
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
)
```

## API Caching

Both API-Football and GNews responses are cached in MongoDB with a 1-hour TTL. This keeps you well within the free tier limits (100 requests/day each) even with multiple users.

## Supported Leagues

- Premier League (England)
- Champions League (Europe)
- Bundesliga (Germany)

## License

MIT
