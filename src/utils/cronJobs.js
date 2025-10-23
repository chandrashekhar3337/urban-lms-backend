import cron from "node-cron";
import Lead from "../models/Lead.js";

// Dummy Meta Ads Auto Sync (Every 5 mins)
cron.schedule("*/5 * * * *", async () => {
  console.log("🔁 Auto fetching Meta Ads leads...");
  await Lead.create({
    name: "Meta Auto Lead",
    email: "autolead@meta.com",
    phone: "9876543211",
    service: "Test Drive",
    source: "Meta",
    campaignName: "Meta Auto Campaign",
  });
});

// Dummy Google Ads Auto Sync (Every 10 mins)
cron.schedule("*/10 * * * *", async () => {
  console.log("🔁 Auto fetching Google Ads leads...");
  await Lead.create({
    name: "Google Auto Lead",
    email: "autolead@google.com",
    phone: "7777777777",
    service: "Airport Pickup",
    source: "Google",
    campaignName: "Google Smart Campaign",
  });
});
