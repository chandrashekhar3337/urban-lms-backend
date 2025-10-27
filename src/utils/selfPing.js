import cron from "node-cron";
import fetch from "node-fetch";

cron.schedule("*/10 * * * *", async () => {
  try {
    await fetch("https://urban-lms-backend.onrender.com");
    console.log("🟢 Self-ping to keep Render alive");
  } catch (err) {
    console.error("Ping failed:", err.message);
  }
});
