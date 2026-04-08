const cron = require("node-cron");
const { autoSyncAllLeagues, autoAdvanceGameweek } = require("./syncService");
const { detectSeason } = require("./apiFootball");

function startCronJobs() {
  // Re-detect season daily at 4:00 AM UTC (auto-switches when new season data appears)
  cron.schedule("0 4 * * *", async () => {
    console.log("[Cron] Daily season detection triggered");
    await detectSeason();
  });

  // Sync all leagues daily at 6:00 AM UTC (after most European matches finish)
  cron.schedule("0 6 * * *", async () => {
    console.log("[Cron] Daily player sync triggered");
    await autoSyncAllLeagues();
  });

  // Second sync at 10:00 PM UTC (catches evening match results)
  cron.schedule("0 22 * * *", async () => {
    console.log("[Cron] Evening player sync triggered");
    await autoSyncAllLeagues();
  });

  // Advance gameweek every Monday at 3:00 AM UTC (new week starts fresh)
  cron.schedule("0 3 * * 1", async () => {
    console.log("[Cron] Weekly gameweek advance triggered");
    await autoAdvanceGameweek();
  });

  console.log("Cron jobs scheduled:");
  console.log("  - Season detection: daily at 04:00 UTC");
  console.log("  - Player sync: daily at 06:00 & 22:00 UTC");
  console.log("  - Gameweek advance: every Monday at 03:00 UTC");
}

module.exports = { startCronJobs };
